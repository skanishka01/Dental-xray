import React, { useEffect } from 'react';
import client from '../api/client';

export default function ReportViewer({ annotations, onReport, report }) {
  useEffect(() => {
    const getReport = async () => {
      // If no annotations or empty array, set default message
      if (!annotations) return;
      if (annotations.length === 0) {
        onReport('No cavities detected.');
        return;
      }
      try {
        const res = await client.post(
          '/report/',
          annotations,
          { headers: { 'Content-Type': 'application/json' } }
        );
        onReport(res.data.report || 'No report returned');
      } catch (err) {
        const status = err.response?.status || '';
        onReport(`Report generation failed: ${status} ${err.message}`);
      }
    };
    getReport();
  }, [annotations, onReport]);

  return (
    <div>
      <h3>Diagnostic Report</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{report}</p>
    </div>
  );
}