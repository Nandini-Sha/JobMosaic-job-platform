import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Alert, Dialog, DialogActions,
  DialogContent, DialogTitle, Slider
} from '@mui/material';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage'; // helper function we'll create below

import registerImg from '../assets/employee.jpg';
import Male from '../assets/male.jpg';
import Female from '../assets/female.jpg';
import idk from '../assets/download.jpg';

const EmployeeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state;
  const gender = user?.gender?.toLowerCase();
  const defaultPic = gender === 'female' ? Female : gender === 'male' ? Male : idk;

  const [profilePic, setProfilePic] = useState(defaultPic);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    userId: user?._id || '',
    skills: '',
    pastexperience: '',
    company: '',
    roleExp: '',
    duration: '',
    certificates: '',
    bio: '',
  });

  // Cropping states
  const [openCrop, setOpenCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleImageChange = (e) => {
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
      setProfilePic(url);
      setProfilePicFile(blob);
      setOpenCrop(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const hc = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const hs = async (e) => {
    e.preventDefault();

    if (!form.userId) {
      setErrorMessage('User ID is missing');
      setSuccessMessage('');
      return;
    }

    const hasPastExp = form.pastexperience.trim() !== '';

    const data = new FormData();
    data.append('userId', form.userId);
    data.append('skills', form.skills);
    data.append('pastexperience', form.pastexperience);
    data.append('bio', form.bio);

    if (form.certificates) {
      const certArray = form.certificates.split(',').map(c => ({ name: c.trim() }));
      data.append('certificates', JSON.stringify(certArray));
    }

    if (hasPastExp) {
      data.append('experience', JSON.stringify({
        company: form.company || 'N/A',
        role: form.roleExp || 'N/A',
        duration: form.duration || 'N/A'
      }));
    }

    if (profilePicFile) {
      data.append('profilepicture', profilePicFile);
    }

    if (resumeFile) {
      data.append('resume', resumeFile);
    }

    try {
      await axios.post('http://localhost:303/api/employees', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccessMessage('Employee profile created!');
      setErrorMessage('');
      setTimeout(() => {
        navigate('/employee/dashboard');
      }, 1000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to create employee');
      setSuccessMessage('');
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
    backgroundColor: '#ffffffcc'
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '4px',
    fontSize: '14px',
    textAlign: 'left',
    display: 'inline-block'
  };

  const showExperienceFields = form.pastexperience.trim() !== '';

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${registerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2
        }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.25)',
            p: 4,
            borderRadius: 3,
            boxShadow: 5,
            width: '360px',
            backdropFilter: 'blur(6px)',
            textAlign: 'center',
            my: 8
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            Complete Employee Profile
          </Typography>

          {/* Profile Image Preview */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={profilePic}
              alt="Profile"
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: '10px' }}
            />
          </Box>

          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
          {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

          <form onSubmit={hs} style={{ textAlign: 'left' }}>
            <Box>
              <label style={labelStyle}>Skills *</label>
              <input type="text" name="skills" onChange={hc} required style={inputStyle} placeholder="e.g. React, Node.js" />
            </Box>

            <Box>
              <label style={labelStyle}>Past experience (months/years)</label>
              <input type="text" name="pastexperience" onChange={hc} style={inputStyle} placeholder="e.g. 1 year" />
            </Box>

            {showExperienceFields && (
              <>
                <Box>
                  <label style={labelStyle}>Previous Company</label>
                  <input type="text" name="company" onChange={hc} style={inputStyle} placeholder="e.g. Infosys" />
                </Box>
                <Box>
                  <label style={labelStyle}>Role in Company</label>
                  <input type="text" name="roleExp" onChange={hc} style={inputStyle} placeholder="e.g. Frontend Developer" />
                </Box>
                <Box>
                  <label style={labelStyle}>Duration (in company)</label>
                  <input type="text" name="duration" onChange={hc} style={inputStyle} placeholder="e.g. 6 months" />
                </Box>
              </>
            )}

            <Box>
              <label style={labelStyle}>Certificates</label>
              <input type="text" name="certificates" onChange={hc} style={inputStyle} placeholder="e.g. AWS, React Certified" />
            </Box>

            <Box>
              <label style={labelStyle}>Upload Resume</label>
              <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleResumeChange} style={{ marginBottom: '12px' }} />
            </Box>

            <Box>
              <label style={labelStyle}>Short Bio</label>
              <textarea name="bio" rows="3" onChange={hc} style={{ ...inputStyle, resize: 'none' }} maxLength={500} placeholder="Tell us about yourself" />
            </Box>

            <Button
              type="submit"
              sx={{
                backgroundColor: 'rgb(92, 225, 230)',
                borderRadius: '30px',
                width: '100%',
                py: 1,
                mt: 1,
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgb(65, 195, 200)' }
              }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Box>

      {/* Crop Dialog */}
      <Dialog open={openCrop} onClose={() => setOpenCrop(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crop Profile Picture</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ position: 'relative', height: 300, width: '100%' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
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

export default EmployeeDetails;
