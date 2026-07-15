import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';

const EmployeeBrowseJobs = ({
  searchQuery,
  setSearchQuery,
  filteredJobs,
  getApplicationStatus,
  renderStatusChip,
  setSelectedJob,
  setOpenJobDialog
}) => {
  return (
    <>
      <Typography variant="h6">Available Jobs</Typography>
      <Box mt={2}>
        <input
          type="text"
          placeholder="Search by title or category"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #4dd0e1', background: '#000', color: '#fff' }}
        />
      </Box>

      <Box mt={3}>
        {filteredJobs.map(job => {
          const status = getApplicationStatus(job._id);
          return (
            <Paper key={job._id} sx={{ mb: 2, p: 2, backgroundColor: '#000', color: '#fff', border: '1px solid #4dd0e1' }}>
              <Typography variant="h6" sx={{ color: '#4dd0e1' }}>{job.title}</Typography>
              <Typography>{job.employerId?.companyName || 'N/A'} • {job.location?.city || 'N/A'}</Typography>
              <Typography>Category: {job.category}</Typography>
              <Typography>Type: {job.employmentType}</Typography>
              <Typography>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</Typography>
              <Typography>Description: {job.description}</Typography>
              <Typography>Requirements: {Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                {status ? renderStatusChip(status) : (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: '#4dd0e1', borderColor: '#4dd0e1' }}
                    onClick={() => { setSelectedJob(job); setOpenJobDialog(true); }}
                  >
                    View & Apply
                  </Button>
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </>
  );
};

export default EmployeeBrowseJobs;
