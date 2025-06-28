import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, Slider
} from '@mui/material';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

import registerImg from '../assets/employer.jpg';
import Industry from '../assets/industry.jpg';

const EmployerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state;
  const userId = user?._id;

  const [form, setForm] = useState({
    userId: userId || '',
    companyName: '',
    position: '',
    companyDescription: '',
    website: '',
    industry: '',
    customIndustry: '',
    contactPerson: ''
  });

  const [croppedImageBlob, setCroppedImageBlob] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [openCrop, setOpenCrop] = useState(false);

  const [logoPreview, setLogoPreview] = useState(Industry);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setOpenCrop(true);
    };
    reader.readAsDataURL(file);
  };

  const showCroppedImage = async () => {
    try {
      const { blob, url } = await getCroppedImg(imageSrc, croppedAreaPixels);
      setLogoPreview(url);
      setCroppedImageBlob(blob);
      setOpenCrop(false);
    } catch (e) {
      console.error('Crop error:', e);
    }
  };

  const hc = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userId) {
      setErrorMessage('User ID is missing');
      return;
    }

    const finalForm = new FormData();
    finalForm.append('userId', form.userId);
    finalForm.append('companyName', form.companyName);
    finalForm.append('position', form.position);
    finalForm.append('companyDescription', form.companyDescription);
    finalForm.append('website', form.website);
    finalForm.append('contactPerson', form.contactPerson);

    const industryToSend =
      form.industry === 'Other' ? form.customIndustry || 'Other' : form.industry;
    finalForm.append('industry', industryToSend);

    if (croppedImageBlob) {
      const file = new File([croppedImageBlob], 'logo.jpg', { type: 'image/jpeg' });
      finalForm.append('companyLOGO', file);
    }

    try {
      const res = await axios.post('http://localhost:303/api/employers', finalForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const employer = res.data.employer;
      localStorage.setItem('employerId', employer._id);
      setSuccessMessage(res.data.message || 'Profile saved');
      setTimeout(() => navigate('/employer/dashboard'), 1000);
    } catch (err) {
      console.error('❌ Error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to save employer');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    outline: 'none',
    backgroundColor: '#ffffffcc',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '4px',
    fontSize: '14px',
    textAlign: 'left',
    display: 'inline-block'
  };

  return (
    <>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${registerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Box sx={{
          bgcolor: 'rgba(255, 255, 255, 0.25)',
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
          width: '360px',
          backdropFilter: 'blur(6px)',
          textAlign: 'center',
          my: 8,
        }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Complete Employer Profile
          </Typography>

          {/* Company Logo Preview */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src={logoPreview} alt="Company Logo"
              style={{
                width: '100%', height: '120px', objectFit: 'cover',
                borderRadius: '8px', border: '1px solid #ccc'
              }}
            />
            <input type="file" accept="image/*" onChange={handleLogoChange}
              style={{ marginTop: '10px' }} />
          </Box>

          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <Box><label style={labelStyle}>Company Name *</label>
              <input name="companyName" required onChange={hc} style={inputStyle} /></Box>

            <Box><label style={labelStyle}>Position *</label>
              <input name="position" required onChange={hc} style={inputStyle} /></Box>

            <Box><label style={labelStyle}>Industry *</label>
              <select name="industry" value={form.industry} onChange={hc} required style={inputStyle}>
                <option value="">Select</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Construction">Construction</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </Box>

            {form.industry === 'Other' && (
              <Box>
                <label style={labelStyle}>Specify Other Industry *</label>
                <input name="customIndustry" required onChange={hc} style={inputStyle} />
              </Box>
            )}

            <Box><label style={labelStyle}>Company Description</label>
              <textarea name="companyDescription" onChange={hc} rows="3"
                style={{ ...inputStyle, resize: 'none' }} /></Box>

            <Box><label style={labelStyle}>Website</label>
              <input type="url" name="website" onChange={hc} style={inputStyle} /></Box>

            <Box><label style={labelStyle}>Contact Person</label>
              <input name="contactPerson" onChange={hc} style={inputStyle} /></Box>

            <Button type="submit" sx={{
              backgroundColor: 'rgb(92, 225, 230)',
              borderRadius: '30px',
              width: '100%',
              py: 1,
              mt: 1,
              color: 'white',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: 'rgb(65, 195, 200)' },
            }}>Submit</Button>
          </form>
        </Box>
      </Box>

      {/* Crop Dialog */}
      <Dialog open={openCrop} onClose={() => setOpenCrop(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crop Company Logo</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ position: 'relative', height: 300, width: '100%' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Zoom</Typography>
            <Slider min={1} max={3} step={0.1} value={zoom} onChange={(e, z) => setZoom(z)} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCrop(false)}>Cancel</Button>
          <Button onClick={showCroppedImage}>Crop</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployerDetails;
