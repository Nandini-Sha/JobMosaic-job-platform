import React from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Chip, Button } from '@mui/material';

const EmployerApplications = ({ jobs, jobStats, fetchApplicationsForJob }) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>All Applications</Typography>
      {jobs.length === 0 ? (
        <Typography>No jobs posted yet.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#121212', color: 'white', borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Job Title</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Applications</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => {
                const stats = jobStats[job._id] || {};
                return (
                  <TableRow key={job._id} hover sx={{ '&:hover': { backgroundColor: '#1e1e1e' } }}>
                    <TableCell sx={{ color: 'white' }}>{job.title}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Chip label={`Total: ${stats.total || 0}`} sx={{ backgroundColor: '#333', color: 'white' }} />
                        <Chip label={`Pending: ${stats.pending || 0}`} color="warning" />
                        <Chip label={`Selected: ${stats.selected || 0}`} color="success" />
                        <Chip label={`Rejected: ${stats.rejected || 0}`} color="error" />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {job.applicationDeadline && new Date(job.applicationDeadline) > new Date() ? (
                        <Chip label="Active" color="success" />
                      ) : (
                        <Chip label="Expired" color="error" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => fetchApplicationsForJob(job._id)}
                        sx={{
                          backgroundColor: '#4dd0e1',
                          color: '#000',
                          fontWeight: 'bold',
                          '&:hover': { backgroundColor: '#26c6da' },
                        }}
                      >
                        View All
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default EmployerApplications;
