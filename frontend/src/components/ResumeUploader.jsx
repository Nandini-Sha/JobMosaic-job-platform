import React, { useState } from 'react';
import api from '../utils/api';
import { Button, Typography, Box } from '@mui/material';

const ResumeUploader = ({ employeeId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setUploading(true);
      const res = await api.put(`/api/employees/upload-resume/${employeeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploadSuccess(res.data.resumeUrl); // Pass URL back to parent
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2">Upload Resume:</Typography>
      <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
      <Button onClick={handleUpload} disabled={uploading || !file} variant="contained" sx={{ mt: 1 }}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </Box>
  );
};

export default ResumeUploader;
