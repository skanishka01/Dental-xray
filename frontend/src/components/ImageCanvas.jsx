import React, { useEffect, useRef, useState } from 'react';
import client from '../api/client';

export default function ImageCanvas({ imageUrl, onDetect }) {
  const imgRef = useRef();
  const canvasRef = useRef();
  const [loading, setLoading] = useState(false);

  // Resize canvas when image loads
  const onImageLoad = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
  };

  const runDetection = async () => {
    if (!imageUrl) return;
    setLoading(true);

    // Fetch blob from URL
    const blob = await fetch(imageUrl).then(r => r.blob());
    const form = new FormData();
    form.append('file', blob, 'converted.png');

    try {
      const { data } = await client.post('/detect/', form);
      const preds = data.predictions || [];
      console.log('Detection response:', data);
      if (preds.length === 0) {
        alert('No cavities detected.');
      }
      drawBoxes(preds);
      onDetect(preds);
    } catch (err) {
      alert('Detection failed: ' + err.message);
    } finally {
      setLoading(false);
    }
};

  const drawBoxes = (preds) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.font = '16px sans-serif';
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';

    // Scale factors if image displayed size != natural size
    const xScale = canvas.width / img.naturalWidth;
    const yScale = canvas.height / img.naturalHeight;

    preds.forEach(p => {
      const { x, y, width, height, class: cls, confidence } = p;
      // Apply scaling
      const sx = x * xScale;
      const sy = y * yScale;
      const sw = width * xScale;
      const sh = height * yScale;

      ctx.strokeRect(sx, sy, sw, sh);
      ctx.fillText(
        `${cls} ${(confidence * 100).toFixed(1)}%`,
        sx,
        sy - 5
      );
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <h3>Annotated Image</h3>
      {imageUrl && (
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Converted"
          onLoad={onImageLoad}
          style={{ display: 'block', maxWidth: '100%' }}
        />
      )}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <button disabled={loading || !imageUrl} onClick={runDetection}>
        {loading ? 'Detecting...' : 'Run Detection'}
      </button>
    </div>
  );
}