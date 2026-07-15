import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Stack, Paper } from '@mui/material';

export const ApplicationsListDialog = ({
  open,
  onClose,
  selectedJobApplications,
  navigate
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Job Applications</DialogTitle>
      <DialogContent>
        {selectedJobApplications.length === 0 ? (
          <Typography>No applications found for this job.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied On</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedJobApplications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>
                      <Chip
                        label={app.status}
                        color={
                          app.status === 'selected'
                            ? 'success'
                            : app.status === 'rejected'
                              ? 'error'
                              : 'warning'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => {
                          const employeeId =
                            app?.employeeId && typeof app.employeeId === 'object'
                              ? app.employeeId._id
                              : app?.employeeId;

                          const userId =
                            app?.userId && typeof app.userId === 'object'
                              ? app.userId._id
                              : app?.userId;

                          if (!employeeId || !userId || !app._id) {
                            console.warn('❌ Missing one of: employeeId, userId, applicationId', { employeeId, userId, applicationId: app._id });
                            return;
                          }
                          navigate(`/employee/${employeeId}?userId=${userId}&applicationId=${app._id}`);
                        }}
                        sx={{ color: '#4dd0e1' }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export const SingleApplicationDialog = ({
  open,
  onClose,
  selectedApplication,
  handleUpdateApplicationStatus,
  API_URL
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Application Details</DialogTitle>
      <DialogContent>
        {selectedApplication && (
          <Stack spacing={2}>
            <Typography variant="h6">
              {selectedApplication.userId?.name || 'N/A'} - {selectedApplication.jobId?.title || 'N/A'}
            </Typography>
            <Typography><strong>Email:</strong> {selectedApplication.userId?.email || 'N/A'}</Typography>
            <Typography><strong>Phone:</strong> {selectedApplication.userId?.phone || 'N/A'}</Typography>
            <Typography><strong>Status:</strong>
              <Chip
                label={selectedApplication.status}
                sx={{
                  ml: 1,
                  backgroundColor:
                    selectedApplication.status === 'selected'
                      ? '#4caf50'
                      : selectedApplication.status === 'rejected'
                        ? '#f44336'
                        : '#ffc107',
                  color: '#fff'
                }}
              />
            </Typography>
            <Typography><strong>Applied On:</strong> {new Date(selectedApplication.createdAt).toLocaleDateString()}</Typography>
            <Typography><strong>Cover Letter:</strong></Typography>
            <Paper sx={{ p: 2 }}>
              <Typography>{selectedApplication.coverLetter || 'No cover letter provided.'}</Typography>
            </Paper>
            {selectedApplication.resume && (
              <Button
                variant="contained"
                href={`${API_URL}/uploads/resumes/${selectedApplication.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ backgroundColor: '#4dd0e1', color: '#000' }}
              >
                View Resume
              </Button>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {selectedApplication?.status === 'pending' && (
          <>
            <Button
              onClick={() => handleUpdateApplicationStatus(selectedApplication._id, 'rejected')}
              color="error"
            >
              Reject
            </Button>
            <Button
              onClick={() => handleUpdateApplicationStatus(selectedApplication._id, 'selected')}
              color="success"
            >
              Accept
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
