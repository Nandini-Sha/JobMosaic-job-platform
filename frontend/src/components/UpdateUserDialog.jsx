import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from '@mui/material';
import axios from 'axios';

const UpdateUserDialog = ({ open, onClose, userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: {
      city: '',
      state: '',
      country: ''
    }
  });

  // Populate formData when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        location: {
          city: userData.location?.city || '',
          state: userData.location?.state || '',
          country: userData.location?.country || ''
        }
      });
    }
  }, [userData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['city', 'state', 'country'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit updated data
  const handleSubmit = async () => {
    try {
      const userId = userData.userId; // ✅ now uses correct User ID
      console.log('Updating USER:', userId, formData);



      await axios.put(`http://localhost:303/api/user/${userId}`, formData);

      if (typeof onUpdate === 'function') onUpdate(); // Refresh parent data
      onClose(); // Close dialog
    } catch (err) {
      console.error('User update failed:', err.response?.data || err.message);
      alert('Failed to update user info.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update User Information</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="City"
              name="city"
              value={formData.location.city}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="State"
              name="state"
              value={formData.location.state}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Country"
              name="country"
              value={formData.location.country}
              onChange={handleChange}
              fullWidth
            />
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

export default UpdateUserDialog;
