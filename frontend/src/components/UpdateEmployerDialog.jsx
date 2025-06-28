import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from '@mui/material';
import axios from 'axios';

const UpdateEmployerDialog = ({ open, onClose, employerData, onUpdate }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    website: '',
    industry: '',
    contactPerson: '',
    position: '',
    userId: '',
  });

  useEffect(() => {
    if (employerData) {
      setFormData({
        companyName: employerData.companyName || '',
        companyDescription: employerData.companyDescription || '',
        website: employerData.website || '',
        industry: employerData.industry || '',
        contactPerson: employerData.contactPerson || '',
        position: employerData.position || '',
        userId: employerData.userId || ''
      });
    }
  }, [employerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:303/api/employers/${formData.userId}`,
        formData
      );
      onUpdate(); // refresh data
      onClose();
    } catch (err) {
      console.error('Failed to update employer:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Employer Details</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="companyDescription"
            value={formData.companyDescription}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateEmployerDialog;
