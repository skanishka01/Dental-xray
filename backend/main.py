from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access variables using os.environ
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")
ROBOFLOW_API_URL = os.getenv("ROBOFLOW_API_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")



from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
import pydicom, io, tempfile, os
from PIL import Image
from inference_sdk import InferenceHTTPClient



import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ────────────────────────────────────────────────────────────────────────────────
# 1) Set up  Roboflow inference client
#    - api_url must be "https://serverless.roboflow.com"
#    - api_key must be your SERVER (private) key from Workspace → API Keys
CLIENT = InferenceHTTPClient(
    # api_url="https://serverless.roboflow.com",
    # api_key="PWoAQ2n5VnUlhyUSukff"
    api_url=ROBOFLOW_API_URL,
    api_key=ROBOFLOW_API_KEY
)
# ────────────────────────────────────────────────────────────────────────────────

@app.post("/upload-dicom/")
async def upload_dicom(file: UploadFile = File(...)):
    # *** MODIFIED: Decompress and normalize pixel data ***
    try:
        ds = pydicom.dcmread(file.file)         # unchanged
        arr = ds.pixel_array.astype(float)      # added `.astype(float)`
    except RuntimeError:
        raise HTTPException(
            status_code=415,
            detail=(
                "Cannot decompress DICOM pixel data. "
                "Ensure pylibjpeg, pylibjpeg-libjpeg, and pylibjpeg-openjpeg are installed."
            )
        )

    # *** MODIFIED: Normalize values to 0–255 ***
    arr -= arr.min()
    if arr.max() != 0:
        arr = arr / arr.max() * 255.0
    arr = arr.astype('uint8')

    # *** UNCHANGED: Convert to PIL Image and stream back ***
    img = Image.fromarray(arr).convert("L")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="image/png",
        headers={"Content-Disposition": "inline; filename=converted.png"}
    )

@app.post("/detect/")
async def detect(file: UploadFile = File(...)):
    # 1) Read and validate the PNG bytes
    img_bytes = await file.read()
    if not img_bytes:
        raise HTTPException(status_code=400, detail="No image data received.")

    # 2) Write bytes to temp file for inference
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        tmp.write(img_bytes)
        tmp_path = tmp.name

    try:
        result = CLIENT.infer(tmp_path, model_id="adr/6")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Inference failed: {e}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    return JSONResponse(content=result)



from fastapi.responses import JSONResponse
import openai  # or use your mock logic

openai.api_key = OPENAI_API_KEY # or leave blank for mock

from fastapi import Body

@app.post("/report/")
async def report(
    annotations: list = Body(..., description="List of prediction objects from /detect/"),
):
    # 1) Validate incoming JSON array
    if not annotations or not isinstance(annotations, list):
        raise HTTPException(status_code=400, detail="Expected a non-empty list of annotations.")

    # 2) Generate report via OpenAI or mock
    if openai.api_key:
        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a dental radiologist."},
                {"role": "user", "content": f"Given these annotations: {annotations}, write a concise diagnostic report."},
            ]
        )
        text = resp.choices[0].message.content
    else:
        text = "Mock report: Detected cavity on upper left molar, confidence 92%."

    return JSONResponse({"report": text})
