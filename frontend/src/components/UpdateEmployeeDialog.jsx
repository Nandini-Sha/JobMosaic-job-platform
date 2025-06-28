import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Typography
} from '@mui/material';
import axios from 'axios';

const UpdateEmployeeDialog = ({ open, onClose, employeeData, onUpdate }) => {
  const [formData, setFormData] = useState({
    pastexperience: '',
    experience: {
      company: '',
      role: '',
      duration: ''
    },
    bio: '',
    skills: '',
    certificates: '',
    resume: null
  });

  useEffect(() => {
    if (employeeData) {
      setFormData({
        pastexperience: employeeData.pastexperience || '',
        experience: employeeData.experience || { company: '', role: '', duration: '' },
        bio: employeeData.bio || '',
        skills: (employeeData.skills || []).join(', '),
        certificates: (employeeData.certificates || [])
          .map(c => (typeof c === 'string' ? c : c.name))
          .join(', '),
        resume: null
      });
    }
  }, [employeeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['company', 'role', 'duration'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        experience: { ...prev.experience, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append('pastexperience', formData.pastexperience);
      data.append('bio', formData.bio);

      // Convert comma-separated strings to arrays
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      const certsArray = formData.certificates.split(',').map(c => ({ name: c.trim() })).filter(c => c.name);

      data.append('skills', JSON.stringify(skillsArray));
      data.append('certificates', JSON.stringify(certsArray));
      data.append('experience', JSON.stringify(formData.experience));
      if (formData.resume) data.append('resume', formData.resume);

      await axios.put(
        `http://localhost:303/api/employees/${employeeData.userId}`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Employee update failed:', error.response?.data || error.message);
      alert('Failed to update employee info');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Employee Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              label="Past Experience"
              name="pastexperience"
              value={formData.pastexperience}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Company"
              name="company"
              value={formData.experience.company}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Role"
              name="role"
              value={formData.experience.role}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Duration"
              name="duration"
              value={formData.experience.duration}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Skills (comma separated)"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Certificates (comma separated)"
              name="certificates"
              value={formData.certificates}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Upload New Resume</Typography>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateEmployeeDialog;
