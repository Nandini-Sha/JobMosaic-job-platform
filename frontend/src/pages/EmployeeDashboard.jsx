import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, CircularProgress, Divider, Chip,
  Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Slider, DialogContentText, Tabs, Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import UpdateUserDialog from '../components/UpdateUserDialog';
import UpdateEmployeeDialog from '../components/UpdateEmployeeDialog';
import defaultMale from '../assets/male.jpg';
import defaultFemale from '../assets/female.jpg';
import defaultNeutral from '../assets/download.jpg';

const EmployeeDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCrop, setOpenCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openEmpDialog, setOpenEmpDialog] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  const userId = localStorage.getItem('userId') || profile?.userId;

  const navigate = useNavigate();

  const fetchEmployeeProfile = async () => {
    try {
      if (!userId) return;
      const userRes = await axios.get(`http://localhost:303/api/user/${userId}`);
      const empRes = await axios.get(`http://localhost:303/api/employees/by-user/${userId}`);

      if (!empRes.data || Object.keys(empRes.data).length === 0) {
        console.warn('Employee not found. Redirecting...');
        setProfile(null);
        setLoading(false);
        return;
      }

      setProfile({
        ...userRes.data,
        ...empRes.data,
        userId: userRes.data._id,
        employeeId: empRes.data._id
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchJobsAndApplications = async () => {
    try {
      const jobsRes = await axios.get(`http://localhost:303/api/jobs`);
      const validJobs = jobsRes.data.filter(job => new Date(job.applicationDeadline) >= new Date());
      setAllJobs(validJobs);
      setFilteredJobs(validJobs);


      if (profile?.employeeId) {
        const appRes = await axios.get(`http://localhost:303/api/applications/employee/${profile.employeeId}`);
        setAppliedJobs(appRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs/applications:', err);
    }
  };

  useEffect(() => {
    fetchEmployeeProfile();
  }, [userId]);

  useEffect(() => {
    if (profile?.employeeId) {
      fetchJobsAndApplications();
    }
  }, [profile]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = allJobs.filter(job =>
      job.title?.toLowerCase().includes(q) || job.category?.toLowerCase().includes(q)
    );
    setFilteredJobs(filtered);
  }, [searchQuery, allJobs]);

  const handleApply = async (jobId) => {
    try {
      const job = allJobs.find(j => j._id === jobId);
      if (!job || !job.employerId) {
        alert("Cannot apply: Employer ID is missing.");
        return;
      }

      const payload = {
        employeeId: profile.employeeId,
        userId: profile.userId,
        jobId,
        employerId: job.employerId,
      };

      await axios.post(`http://localhost:303/api/applications`, payload);
      fetchJobsAndApplications();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("You've already applied to this job.");
      } else {
        console.error('Apply failed:', err);
        alert("Something went wrong while applying. Try again.");
      }
    }
  };

  const getApplicationStatus = (jobId) => {
    const application = appliedJobs.find(app => app.jobId === jobId);
    return application ? application.status : null;
  };

  const getDefaultAvatar = (gender) => {
    if (gender === 'male') return defaultMale;
    if (gender === 'female') return defaultFemale;
    return defaultNeutral;
  };

  const getResumeUrl = (resume) =>
    resume?.startsWith('http') ? resume : `http://localhost:303/uploads/resumes/${resume}`;

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

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

  const showCroppedImage = async () => {
    try {
      const { blob } = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append('profilepicture', blob);
      formData.append('userId', userId);
      await axios.put(`http://localhost:303/api/employees/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setOpenCrop(false);
      fetchEmployeeProfile();
    } catch (err) {
      console.error('Crop/upload failed:', err);
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      await axios.put(`http://localhost:303/api/employees/remove-profile-picture/${userId}`);
      fetchEmployeeProfile();
    } catch (err) {
      console.error('Remove profile pic failed:', err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:303/api/user/${profile.userId}`);
      await axios.delete(`http://localhost:303/api/employees/${profile.employeeId}`);
      localStorage.clear();
      navigate('/register');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const renderStatusChip = (status) => {
    switch (status) {
      case 'pending': return <Chip label="Pending" color="warning" />;
      case 'selected': return <Chip label="Selected" color="success" />;
      case 'rejected': return <Chip label="Rejected" color="error" />;
      default: return null;
    }
  };

  if (!profile) {
    return (
      <Box p={4}>
        <Typography color="error">Employee profile not found. Please complete your details.</Typography>
      </Box>
    );
  }

  const hasPastExperience = profile?.pastexperience?.trim()?.length > 0;
  const hasLocation = profile?.location?.city || profile?.location?.state || profile?.location?.country;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
      {/* LEFT PANEL */}
      <Paper elevation={3} sx={{ width: '30%', p: 2, mr: 2, height: '80vh', overflowY: 'auto', backgroundColor: '#000', color: '#fff' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Stack alignItems="center">
              <img
                src={profile.profilepicture ? `http://localhost:303/uploads/profilepics/${profile.profilepicture}?${Date.now()}` : getDefaultAvatar(profile.gender)}
                alt="Profile"
                style={{ width: 150, height: 150, borderRadius: '50%', objectFit: 'cover' }}
              />
              <input type="file" accept="image/*" onChange={handleFileSelect} id="profilePicInput" style={{ display: 'none' }} />
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button onClick={() => document.getElementById('profilePicInput').click()} variant="outlined" size="small" sx={{ color: '#4dd0e1', borderColor: '#4dd0e1' }}>Update Pic</Button>
                <Button onClick={handleRemoveProfilePic} variant="outlined" size="small" color="error">Remove Pic</Button>
              </Stack>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1.5} alignItems="center">
              <Typography variant="h6" sx={{ color: '#4dd0e1' }}>{profile.name}</Typography>
              <Typography>Email: {profile.email}</Typography>
              <Typography>Phone: {profile.phone || 'N/A'}</Typography>
              {hasLocation && (
                <>
                  {profile.location.city && <Typography>City: {profile.location.city}</Typography>}
                  {profile.location.state && <Typography>State: {profile.location.state}</Typography>}
                  {profile.location.country && <Typography>Country: {profile.location.country}</Typography>}
                </>
              )}
              <Button variant="outlined" size="small" onClick={() => setOpenUserDialog(true)} sx={{ color: '#4dd0e1', borderColor: '#4dd0e1' }}>Update User Info</Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={2} alignItems="center">
              {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                <>
                  <Typography fontWeight="bold" textAlign="center">Skills</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                    {profile.skills.map((skill, i) => (
                      <Chip key={i} label={skill} size="small" sx={{ backgroundColor: '#4dd0e1', color: '#000' }} />
                    ))}
                  </Stack>
                </>
              )}

              {hasPastExperience && (
                <>
                  <Typography fontWeight="bold" textAlign="center">Experience: {profile.pastexperience}</Typography>
                  <Typography textAlign="center">Company: {profile.experience?.company || 'N/A'}</Typography>
                  <Typography textAlign="center">Role: {profile.experience?.role || 'N/A'}</Typography>
                  <Typography textAlign="center">Duration: {profile.experience?.duration || 'N/A'}</Typography>
                </>
              )}

              <Typography fontWeight="bold" textAlign="center">Resume</Typography>
              {profile.resume ? (
                <Chip
                  label="View Resume"
                  component="a"
                  href={getResumeUrl(profile.resume)}
                  target="_blank"
                  clickable
                  variant="outlined"
                  sx={{ color: '#4dd0e1', borderColor: '#4dd0e1' }}
                />
              ) : (
                <Typography textAlign="center">No resume uploaded</Typography>
              )}

              {Array.isArray(profile.certificates) && profile.certificates.length > 0 && (
                <>
                  <Typography fontWeight="bold" textAlign="center">Certificates</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                    {profile.certificates.map((c, i) => (
                      <Chip key={i} label={c.name || c} size="small" sx={{ backgroundColor: '#4dd0e1', color: '#000' }} />
                    ))}
                  </Stack>
                </>
              )}

              {profile.bio && (
                <>
                  <Typography fontWeight="bold" textAlign="center">Bio</Typography>
                  <Typography textAlign="center">{profile.bio}</Typography>
                </>
              )}

              <Button variant="outlined" size="small" onClick={() => setOpenEmpDialog(true)} sx={{ color: '#4dd0e1', borderColor: '#4dd0e1' }}>Update Employee Details</Button>
              <Button variant="contained" color="error" size="small" onClick={() => setOpenDeleteConfirm(true)}>Delete Profile</Button>
            </Stack>
          </>
        )}
      </Paper>

      {/* RIGHT PANEL */}
      <Paper elevation={3} sx={{ width: '70%', p: 2, height: '80vh', overflowY: 'auto', backgroundColor: 'rgba(92, 225, 230, 0.29)' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Browse Jobs" />
          <Tab label="My Applications" />
        </Tabs>

        {tabValue === 0 ? (
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
        ) : (
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
        )}
      </Paper>

      {/* Crop Dialog */}
      <Dialog open={openCrop} onClose={() => setOpenCrop(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crop Profile Picture</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ position: 'relative', height: 300 }}>
            <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
          </Box>
          <Slider min={1} max={3} step={0.1} value={zoom} onChange={(e, z) => setZoom(z)} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCrop(false)}>Cancel</Button>
          <Button onClick={showCroppedImage}>Crop & Upload</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <DialogTitle>Delete Profile?</DialogTitle>
        <DialogContent>
          <DialogContentText>This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Yes, Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Job Dialog */}
      <Dialog open={openJobDialog} onClose={() => setOpenJobDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent dividers>
          {selectedJob && (
            <>
              <Typography variant="h6">{selectedJob.title}</Typography>
              <Typography>Company: {selectedJob.employerId?.companyName || 'N/A'}</Typography>
              <Typography>Category: {selectedJob.category}</Typography>
              <Typography>Type: {selectedJob.employmentType}</Typography>
              <Typography>Location: {selectedJob.location?.city || 'N/A'}</Typography>
              <Typography>Description: {selectedJob.description}</Typography>
              <Typography>Requirements: {Array.isArray(selectedJob.requirements) ? selectedJob.requirements.join(', ') : selectedJob.requirements}</Typography>
              <Typography>Deadline: {new Date(selectedJob.applicationDeadline).toLocaleDateString()}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJobDialog(false)}>Cancel</Button>
          <Button onClick={() => { handleApply(selectedJob._id); setOpenJobDialog(false); }} variant="contained" color="primary">Apply</Button>
        </DialogActions>
      </Dialog>

      {/* User & Employee Update Dialogs */}
        <UpdateUserDialog
  open={openUserDialog}
  onClose={() => setOpenUserDialog(false)}
  userId={userId}
  userData={{
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location
  }}
  onSuccess={() => {
    fetchEmployeeProfile(); // ✅ CORRECT
    setOpenUserDialog(false);
  }}
/>

     <UpdateEmployeeDialog
  open={openEmpDialog}
  onClose={() => setOpenEmpDialog(false)}
  employeeData={profile}
  onUpdate={fetchEmployeeProfile}
/>

    </Box>
  );
};

export default EmployeeDashboard;
