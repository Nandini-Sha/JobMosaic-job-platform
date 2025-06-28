import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Stack, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Slider, DialogContentText, Chip, Divider, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import UpdateUserDialog from '../components/UpdateUserDialog';
import UpdateEmployerDialog from '../components/UpdateEmployerDialog';
import JobPostFormDialog from '../components/JobPostFormDialog';
import defaultIndustry from '../assets/industry.jpg';
import { useNavigate } from 'react-router-dom';

const EmployerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCrop, setOpenCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openEmployerDialog, setOpenEmployerDialog] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openJobForm, setOpenJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobStats, setJobStats] = useState({});
  const [selectedJobApplications, setSelectedJobApplications] = useState([]);
  const [openApplicationsDialog, setOpenApplicationsDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openApplicationDialog, setOpenApplicationDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const employerId = localStorage.getItem('employerId');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const fetchEmployerProfile = async () => {
    try {
      if (!employerId || !userId) return;
      const userRes = await axios.get(`http://localhost:303/api/user/${userId}`);
      const empRes = await axios.get(`http://localhost:303/api/employers/${employerId}`);
      setProfile({ ...userRes.data, ...empRes.data, userId, employerId });
    } catch (error) {
      console.error('Error fetching employer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobStats = async (jobId) => {
    try {
      const res = await axios.get(`http://localhost:303/api/applications/job/${jobId}/stats`);
      const stats = res.data;
    const total = (stats.pending || 0) + (stats.selected || 0) + (stats.rejected || 0);
    setJobStats(prev => ({ ...prev, [jobId]: { ...stats, total } }));
    } catch (err) {
      console.error(`Error fetching stats for job ${jobId}:`, err);
    }
  };

  const fetchJobs = async () => {
  try {
    setJobStats({}); // Clear old stats
    const res = await axios.get(`http://localhost:303/api/jobs/employer/${employerId}`);
    setJobs(res.data);

    // Wait for all stats to be fetched
    const updatedStats = await Promise.all(
      res.data.map(async (job) => {
        const statsRes = await axios.get(`http://localhost:303/api/applications/job/${job._id}/stats`);
        const stats = statsRes.data;
        const total = (stats.pending || 0) + (stats.selected || 0) + (stats.rejected || 0);

        // ✅ DEBUG LOG FOR EACH JOB
        console.log(`📊 Stats for "${job.title}":`, stats);

        if (!stats.selected) {
          console.warn(`⚠️ No 'selected' applications found for "${job.title}"`);
        }

        return { jobId: job._id, stats: { ...stats, total } };
      })
    );

    // Consolidate stats
    const statsMap = {};
    updatedStats.forEach(({ jobId, stats }) => {
      statsMap[jobId] = stats;
    });

    setJobStats(statsMap);

    // ✅ FINAL DEBUG LOG FOR ENTIRE JOB STATS MAP
    console.log('✅ All jobStats updated:', statsMap);

  } catch (err) {
    console.error('❌ Error fetching jobs or stats:', err);
  }
};




  const fetchApplicationsForJob = async (jobId) => {
  try {
    const res = await axios.get(`http://localhost:303/api/applications/job/${jobId}?populateUser=true`);
    setSelectedJobApplications(res.data);
    setOpenApplicationsDialog(true);
    
  } catch (err) {
    console.error('Error fetching applications:', err);
  }
};


  const fetchApplicationDetails = async (applicationId) => {
    try {
      const res = await axios.get(`http://localhost:303/api/applications/${applicationId}`);
      setSelectedApplication(res.data);
      setOpenApplicationDialog(true);
    } catch (err) {
      console.error('Error fetching application:', err);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.put(`http://localhost:303/api/applications/${applicationId}`, { status });
      if (selectedJobApplications.length > 0) {
        fetchApplicationsForJob(selectedJobApplications[0].jobId._id);
      }
      fetchJobs(); // Refresh job stats
      setOpenApplicationDialog(false);
    } catch (err) {
      console.error('Error updating application:', err);
    }
  };

  useEffect(() => {
    if (employerId) {
      fetchEmployerProfile();
      fetchJobs();
    }
  }, [employerId]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setOpenCrop(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      const { blob } = await getCroppedImg(imageSrc, croppedAreaPixels);
      setOpenCrop(false);
      const formData = new FormData();
      formData.append('companyLOGO', blob);
      formData.append('userId', userId);
      await axios.put(`http://localhost:303/api/employers/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchEmployerProfile();
    } catch (error) {
      console.error('Crop/upload failed:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:303/api/jobs/${jobId}`);
      fetchJobs();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:303/api/user/${userId}`);
      await axios.delete(`http://localhost:303/api/employers/${employerId}`);
      localStorage.clear();
      navigate('/register');
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setOpenJobForm(true);
  };

  const handleJobFormClose = () => {
    setEditingJob(null);
    setOpenJobForm(false);
  };

  const {
    name, email, phone, location, companyName, companyDescription,
    industry, website, position, contactPerson, companyLOGO
  } = profile || {};

  const logoUrl = companyLOGO?.startsWith('http')
    ? companyLOGO
    : companyLOGO
      ? `http://localhost:303/uploads/companyLogos/${companyLOGO}?${new Date().getTime()}`
      : defaultIndustry;

  if (loading) {
    return (
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading Dashboard...</Typography>
      </Box>
    );
  }

  if (loading) {
  return (
    <Box sx={{ mt: 10, textAlign: 'center' }}>
      <CircularProgress />
      <Typography>Loading Dashboard...</Typography>
    </Box>
  );
}

if (!profile) {
  return (
    <Box sx={{ mt: 10, textAlign: 'center' }}>
      <Typography color="error">Unable to load employer profile.</Typography>
    </Box>
  );
}


  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
      {/* LEFT PANEL - PROFILE SECTION */}
      <Paper elevation={3} sx={{ width: '30%', p: 2, mr: 2, height: '80vh', overflowY: 'auto', backgroundColor: '#000', color: '#fff' }}>
        {/* Profile image and upload */}
        <Stack alignItems="center">
          <img
            src={logoUrl}
            alt="Company Logo"
            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: 8, border: '2px solid #ccc' }}
          />
          <input type="file" accept="image/*" onChange={handleFileSelect} id="logoInput" style={{ display: 'none' }} />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => document.getElementById('logoInput').click()}
              sx={{ color: '#4dd0e1', borderColor: '#4dd0e1' }}
            >
              Update Logo
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2, borderColor: '#444' }} />

        {/* User Info Section */}
        <Stack spacing={1.5} alignItems="center" mt={2}>
          <Typography variant="h6" sx={{ color: '#4dd0e1' }}>User Info</Typography>
          <Typography>Name: {name}</Typography>
          <Typography>Email: {email}</Typography>
          <Typography>Phone: {phone || 'N/A'}</Typography>
          {location?.city && <Typography>City: {location.city}</Typography>}
          {location?.state && <Typography>State: {location.state}</Typography>}
          {location?.country && <Typography>Country: {location.country}</Typography>}
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => setOpenUserDialog(true)} 
            sx={{ mt: 1, color: '#4dd0e1', borderColor: '#4dd0e1' }}
          >
            Update User Info
          </Button>
        </Stack>

        <Divider sx={{ my: 2, borderColor: '#444' }} />

        {/* Company Info Section */}
        <Stack spacing={1.5} alignItems="center" mt={4}>
          <Typography variant="h6" sx={{ color: '#4dd0e1' }}>Company Info</Typography>
          <Typography>Company: {companyName}</Typography>
          <Typography>Position: {position}</Typography>
          {industry && <Chip label={industry} sx={{ backgroundColor: '#4dd0e1', color: '#000', fontWeight: 'bold' }} />}
          <Typography>Description: {companyDescription || 'No description provided.'}</Typography>
          {website && (
            <Typography>
              Website:{' '}
              <a href={website} target="_blank" rel="noopener noreferrer" style={{ color: '#4dd0e1' }}>
                {website}
              </a>
            </Typography>
          )}
          {contactPerson && <Typography>Contact Person: {contactPerson}</Typography>}
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => setOpenEmployerDialog(true)} 
            sx={{ mt: 1, color: '#4dd0e1', borderColor: '#4dd0e1' }}
          >
            Update Employer Info
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            color="error" 
            sx={{ mt: 1 }} 
            onClick={() => setOpenDeleteConfirm(true)}
          >
            Delete Profile
          </Button>
        </Stack>
      </Paper>

      {/* RIGHT PANEL - JOB MANAGEMENT */}
      <Paper elevation={3} sx={{ width: '70%', p: 2, height: '80vh', overflowY: 'auto', backgroundColor: 'rgba(92, 225, 230, 0.2)' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Job Management" />
          <Tab label="Applications" />
        </Tabs>

        {tabValue === 0 ? (
          <>
          <br></br>
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
        ) : (
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
        )}

        {/* JOB POST FORM DIALOG */}
        <JobPostFormDialog
          open={openJobForm}
          onClose={handleJobFormClose}
          employerId={employerId}
          jobData={editingJob}
          onSuccess={() => {
            fetchJobs();
            handleJobFormClose();
          }}
        />

        {/* UPDATE USER DIALOG */}
        <UpdateUserDialog
          open={openUserDialog}
          onClose={() => setOpenUserDialog(false)}
          userId={userId}
          userData={{
            name,
            email,
            phone,
            location
          }}
          onSuccess={() => {
            fetchEmployerProfile();
            setOpenUserDialog(false);
          }}
        />

        {/* UPDATE EMPLOYER DIALOG */}
        <UpdateEmployerDialog
          open={openEmployerDialog}
          onClose={() => setOpenEmployerDialog(false)}
          employerId={employerId}
          employerData={{
            companyName,
            companyDescription,
            industry,
            website,
            position,
            contactPerson
          }}
          onSuccess={() => {
            fetchEmployerProfile();
            setOpenEmployerDialog(false);
          }}
        />

        {/* DELETE CONFIRMATION DIALOG */}
        <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
          <DialogTitle>Delete Profile</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete your profile? This action cannot be undone and will permanently remove all your data.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* IMAGE CROPPER DIALOG */}
        <Dialog open={openCrop} onClose={() => setOpenCrop(false)} maxWidth="md">
          <DialogTitle>Crop Company Logo</DialogTitle>
          <DialogContent>
            <Box sx={{ position: 'relative', height: 400, width: '100%' }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography>Zoom</Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e, value) => setZoom(value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCrop(false)}>Cancel</Button>
            <Button onClick={showCroppedImage} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* APPLICATIONS LIST DIALOG */}
        <Dialog
          open={openApplicationsDialog}
          onClose={() => setOpenApplicationsDialog(false)}
          fullWidth
          maxWidth="md"
        >
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

    console.log('✅ Redirecting to employee profile with:', {
      employeeId, userId, applicationId: app._id
    });

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
            <Button onClick={() => setOpenApplicationsDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* SINGLE APPLICATION DIALOG */}
        <Dialog
          open={openApplicationDialog}
          onClose={() => setOpenApplicationDialog(false)}
          fullWidth
          maxWidth="md"
        >
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
                    href={`http://localhost:303/uploads/resumes/${selectedApplication.resume}`}
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
            <Button onClick={() => setOpenApplicationDialog(false)}>Close</Button>
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
      </Paper>
    </Box>
  );
};

export default EmployerDashboard;