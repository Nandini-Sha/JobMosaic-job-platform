import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage'; // Make sure this utility returns { blob }
import {
  Box,
  Button,
  Typography,
  Slider,
  CircularProgress,
  Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateProfilePic = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Called when cropping is done
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // When user selects a new image
  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  // Upload the cropped image blob to backend
  const handleUpload = async () => {
    setError(null);
    if (!croppedAreaPixels || !imageSrc) {
      setError('Please select and crop an image first.');
      return;
    }

    try {
      setUploading(true);

      const { blob } = await getCroppedImg(imageSrc, croppedAreaPixels);

      const formData = new FormData();
      formData.append('profilepicture', blob);

      // PUT request to update employee by _id with profile picture upload
      // Your backend route expects employee _id here (userId param is used as employee _id)
      const res = await axios.put(
        `http://localhost:303/api/employees/${userId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert('✅ Profile picture updated successfully!');
      navigate('/employee/dashboard'); // Redirect to employee dashboard
    } catch (uploadErr) {
      console.error('Upload failed:', uploadErr);
      setError('Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" mb={2} textAlign="center">
        Crop & Update Profile Picture
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imageSrc && (
        <>
          <Box sx={{ position: 'relative', width: 300, height: 300, mt: 3, mx: 'auto' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropShape="round"
              showGrid={false}
            />
          </Box>

          <Box sx={{ mt: 2, mx: 4 }}>
            <Typography gutterBottom>Zoom</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, z) => setZoom(z)}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleUpload}
            sx={{ mt: 3 }}
            disabled={uploading}
          >
            {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload Cropped Image'}
          </Button>
        </>
      )}
    </Box>
  );
};

export default UpdateProfilePic;
