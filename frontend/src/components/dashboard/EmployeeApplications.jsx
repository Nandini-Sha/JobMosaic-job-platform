import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const EmployeeApplications = ({ appliedJobs, renderStatusChip }) => {
  return (
    <>
      <Typography variant="h6">My Applications</Typography>
      <Box mt={3}>
        {appliedJobs.length === 0 ? (
          <Typography>You haven't applied to any jobs yet.</Typography>
        ) : (
          appliedJobs.map(application => (
            <Paper
              key={application._id}
              sx={{
                mb: 2,
                p: 2,
                backgroundColor: '#000',
                color: '#fff',
                border: '1px solid #4dd0e1'
              }}
            >
              <Typography variant="h6" sx={{ color: '#4dd0e1' }}>
                {application.jobId?.title || 'Job Title Unavailable'}
              </Typography>
              <Typography>
                Category: {application.jobId?.category || 'N/A'}
              </Typography>
              <Typography>
                Status: {renderStatusChip(application.status)}
              </Typography>
              <Typography>
                Applied on: {new Date(application.createdAt).toLocaleDateString()}
              </Typography>

              {application.status === 'selected' && (
                <Typography sx={{ color: 'success.main', mt: 1 }}>
                  Congratulations! You've been selected.
                </Typography>
              )}

              {application.status === 'rejected' && (
                <Typography sx={{ color: 'error.main', mt: 1 }}>
                  Unfortunately, your application wasn't selected.
                </Typography>
              )}
            </Paper>
          ))
        )}
      </Box>
    </>
  );
};

export default EmployeeApplications;
