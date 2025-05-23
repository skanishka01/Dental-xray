import React, { useRef, useState } from 'react';
import client from '../api/client';

export default function FileUpload({ onUpload }) {
  const fileInput = useRef();
  const [loading, setLoading] = useState(false);

  const uploadDicom = async () => {
    const file = fileInput.current.files[0];
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await client.post('/upload-dicom/', form, {
        responseType: 'blob'
      });
      const url = URL.createObjectURL(res.data);
      onUpload(url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Upload DICOM</h3>
      <input
        type="file"
        accept=".dcm,.rvg"
        ref={fileInput}
      />
      <button disabled={loading} onClick={uploadDicom}>
        {loading ? 'Uploading...' : 'Upload & Convert'}
      </button>
    </div>
  );
}