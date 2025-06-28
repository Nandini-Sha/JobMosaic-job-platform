// src/components/JobPostFormDialog.jsx
import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Stack
} from '@mui/material';
import axios from 'axios';

const employmentOptions = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'];

const JobPostFormDialog = ({ open, onClose, employerId, jobData, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    salaryMin: '',
    salaryMax: '',
    employmentType: 'Full-Time',
    applicationDeadline: '',
    category: '',
    location: {
      city: '',
      state: '',
      country: ''
    }
  });

  useEffect(() => {
    if (jobData) {
      setForm({
        title: jobData.title || '',
        description: jobData.description || '',
        requirements: (jobData.requirements || []).join(', '),
        salaryMin: jobData.salaryRange?.min || '',
        salaryMax: jobData.salaryRange?.max || '',
        employmentType: jobData.employmentType || 'Full-Time',
        applicationDeadline: jobData.applicationDeadline?.slice(0, 10) || '',
        category: jobData.category || '',
        location: {
          city: jobData.location?.city || '',
          state: jobData.location?.state || '',
          country: jobData.location?.country || ''
        }
      });
    } else {
      setForm({
        title: '',
        description: '',
        requirements: '',
        salaryMin: '',
        salaryMax: '',
        employmentType: 'Full-Time',
        applicationDeadline: '',
        category: '',
        location: {
          city: '',
          state: '',
          country: ''
        }
      });
    }
  }, [jobData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['city', 'state', 'country'].includes(name)) {
      setForm(prev => ({
        ...prev,
        location: { ...prev.location, [name]: value }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
const handleSubmit = async () => {
  const payload = {
    title: form.title,
    description: form.description,
    requirements: form.requirements
      .split(',')
      .map(r => r.trim())
      .filter(Boolean),
    salaryRange: {
      min: Number(form.salaryMin),
      max: Number(form.salaryMax)
    },
    employmentType: form.employmentType,
    applicationDeadline: form.applicationDeadline,
    category: form.category,
    location: {
      city: form.location.city,
      state: form.location.state,
      country: form.location.country
    },
    employerId  // ✅ Changed from postedBy
  };

  try {
    if (jobData) {
      await axios.put(`http://localhost:303/api/jobs/${jobData._id}`, payload);
    } else {
      await axios.post('http://localhost:303/api/jobs', payload);
    }
    onSuccess();
  } catch (error) {
    console.error('Job submission failed:', error.response?.data || error.message);
  }
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{jobData ? 'Edit Job' : 'Post New Job'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Job Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
          <TextField
            label="Requirements (comma separated)"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Min Salary (₹)"
              name="salaryMin"
              value={form.salaryMin}
              type="number"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Max Salary (₹)"
              name="salaryMax"
              value={form.salaryMax}
              type="number"
              onChange={handleChange}
              fullWidth
            />
          </Stack>
          <TextField
            label="Employment Type"
            name="employmentType"
            select
            value={form.employmentType}
            onChange={handleChange}
            fullWidth
          >
            {employmentOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Application Deadline"
            name="applicationDeadline"
            type="date"
            value={form.applicationDeadline}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="City"
            name="city"
            value={form.location.city}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="State"
            name="state"
            value={form.location.state}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Country"
            name="country"
            value={form.location.country}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {jobData ? 'Update Job' : 'Post Job'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobPostFormDialog;
