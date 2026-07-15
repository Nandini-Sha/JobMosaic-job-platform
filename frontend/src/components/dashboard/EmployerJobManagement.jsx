import React from 'react';
import { Box, Typography, Paper, Button, Stack, Chip } from '@mui/material';

const EmployerJobManagement = ({
  jobs,
  jobStats,
  setEditingJob,
  setOpenJobForm,
  fetchApplicationsForJob,
  handleEditJob,
  handleDeleteJob
}) => {
  return (
    <>
      <br />
      <Button
        variant="contained"
        onClick={() => {
          setEditingJob(null);
          setOpenJobForm(true);
        }}
        sx={{
          backgroundColor: '#4dd0e1',
          borderRadius: '50px',
          color: '#000',
          fontWeight: 'bold',
          textTransform: 'none',
          px: 3,
          '&:hover': { backgroundColor: '#26c6da' },
        }}
      >
        + New Job
      </Button>

      <Box mt={3}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Your Posted Jobs</Typography>
        {jobs.length === 0 ? (
          <Typography>No jobs posted yet.</Typography>
        ) : (
          jobs.map((job) => {
            const stats = jobStats[job._id] || {};
            return (
              <Paper key={job._id} sx={{ mb: 2, p: 2, backgroundColor: '#000', color: '#fff', border: '1px solid #4dd0e1' }}>
                <Typography variant="h6" sx={{ color: '#4dd0e1' }}>{job.title}</Typography>
                <Typography sx={{ mb: 1 }}>{job.category} • {job.employmentType}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>City:</strong> {job.location?.city || 'N/A'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Salary:</strong>{' '}
                  {job.salaryRange?.min && job.salaryRange?.max
                    ? `₹${job.salaryRange.min.toLocaleString()} - ₹${job.salaryRange.max.toLocaleString()}`
                    : job.salaryRange?.min
                      ? `From ₹${job.salaryRange.min.toLocaleString()}`
                      : job.salaryRange?.max
                        ? `Up to ₹${job.salaryRange.max.toLocaleString()}`
                        : 'Not specified'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Chip label={`Pending: ${stats.pending || 0}`} sx={{ bgcolor: '#ffc107', color: '#000', fontWeight: 'bold' }} />
                  <Chip label={`Selected: ${stats.selected || 0}`} sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 'bold' }} />
                  <Chip label={`Rejected: ${stats.rejected || 0}`} sx={{ bgcolor: '#f44336', color: '#fff', fontWeight: 'bold' }} />
                </Stack>
                <Stack direction="row" spacing={1} mt={1}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    sx={{ color: '#4dd0e1', borderColor: '#4dd0e1' }} 
                    onClick={() => fetchApplicationsForJob(job._id)}
                  >
                    View Applications
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    sx={{ color: '#4dd0e1', borderColor: '#4dd0e1' }} 
                    onClick={() => handleEditJob(job)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => handleDeleteJob(job._id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Paper>
            );
          })
        )}
      </Box>
    </>
  );
};

export default EmployerJobManagement;
