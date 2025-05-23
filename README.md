
#  Dental X-Ray Pathology Detection App

A full-stack web application for detecting dental pathologies in DICOM X-ray images using Roboflow's object detection API and generating diagnostic reports via an LLM (Large Language Model). Users can upload dental DICOM files, view automated bounding box predictions, and receive AI-generated reports, all in a modern React dashboard.

---

## Features

* Upload and view Dental DICOM (.dcm or .rvg) images
* Convert DICOM to grayscale PNG for visualization
* Detect dental pathologies using a Roboflow model
* Display bounding boxes for identified anomalies
* Generate AI-powered diagnostic reports using OpenAI or other LLMs
* Clean, responsive frontend built with React
* FastAPI backend for inference and report generation

---

## 🛠️ Tech Stack

**Frontend**: React, Tailwind CSS
**Backend**: FastAPI, Uvicorn
**AI Services**: Roboflow (object detection), OpenAI GPT (report generation)
**Languages**: Python, JavaScript
**Others**: DICOM (via pydicom), PIL (image conversion), inference-sdk

---

## 📦 Prerequisites

* [Node.js](https://nodejs.org/) v14+
* [Python](https://www.python.org/downloads/) 3.8+
* [Git](https://git-scm.com/)

---

## 🖥️ Setup Instructions

### 🔧 Backend (FastAPI)

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/dental-xray-app.git
   cd dental-xray-app/backend
   ```

2. **Create Virtual Environment**

   ```bash
   python -m venv venv
   ```

3. **Activate Virtual Environment**

   * **Windows:**

     ```powershell
     venv\Scripts\activate
     ```

   * **macOS/Linux:**

     ```bash
     source venv/bin/activate
     ```

4. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Set Required Environment Variables**

   ```bash
   set ROBOFLOW_API_KEY=your_roboflow_api_key
   set OPENAI_API_KEY=your_openai_api_key
   ```

6. **Start FastAPI Server**

   ```bash
   uvicorn main:app --reload
   ```

   Server runs at: [http://localhost:8000](http://localhost:8000)

---

### 🎨 Frontend (React)

1. **Navigate to Frontend Folder**

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start React App**

   ```bash
   npm start
   ```

   React runs at: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Usage

1. Upload a Dental DICOM file (`.dcm` or `.rvg`).
2. The image is converted to a visible format.
3. Click **Run Detection** to identify anomalies.
4. Bounding boxes are displayed on the image.
5. An AI-generated diagnostic report appears in the dashboard.

---

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── src/
│   └── ...
├── README.md
└── .gitignore
```

---

## 📷 Preview

![Screenshot 2025-05-23 135830](https://github.com/user-attachments/assets/bafc676b-ad03-43a9-b6dd-9c3c7a9c2bdb)
![Screenshot 2025-05-23 135859](https://github.com/user-attachments/assets/e4933541-c94b-405d-be56-2edeb72adcea)



---

## 🔐 API Keys

Make sure to set your **Roboflow** and **OpenAI** API keys as environment variables before running the app:

