import { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import {
  Box, Typography, Paper, CircularProgress, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Tabs, Tab
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import getCroppedImg from '../utils/cropImage';
import UpdateUserDialog from '../components/UpdateUserDialog';
import UpdateEmployeeDialog from '../components/UpdateEmployeeDialog';
import EmployeeSidebar from '../components/dashboard/EmployeeSidebar';
import EmployeeBrowseJobs from '../components/dashboard/EmployeeBrowseJobs';
import EmployeeApplications from '../components/dashboard/EmployeeApplications';
import ImageCropperDialog from '../components/dashboard/ImageCropperDialog';
import defaultMale from '../assets/male.jpg';
import defaultFemale from '../assets/female.jpg';
import defaultNeutral from '../assets/download.jpg';
const API_URL = import.meta.env.VITE_API_URL;
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
  const location = useLocation();

  const fetchEmployeeProfile = async () => {
    try {
      if (!userId) return;
      const userRes = await api.get(`/api/user/${userId}`);
      const empRes = await api.get(`/api/employees/by-user/${userId}`);

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
      const jobsRes = await api.get(`/api/jobs`);
      const validJobs = jobsRes.data.filter(job => new Date(job.applicationDeadline) >= new Date());
      setAllJobs(validJobs);
      setFilteredJobs(validJobs);


      if (profile?.employeeId) {
        const appRes = await api.get(`/api/applications/employee/${profile.employeeId}`);
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
      const intervalId = setInterval(() => {
        fetchJobsAndApplications();
      }, 10000); // Poll every 10 seconds
      return () => clearInterval(intervalId);
    }
  }, [profile]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = allJobs.filter(job =>
      job.title?.toLowerCase().includes(q) || job.category?.toLowerCase().includes(q)
    );
    setFilteredJobs(filtered);
  }, [searchQuery, allJobs]);

  useEffect(() => {
    if (allJobs.length > 0 && location.state?.openJobId) {
      const jobToOpen = allJobs.find(j => j._id === location.state.openJobId);
      if (jobToOpen) {
        setSelectedJob(jobToOpen);
        setOpenJobDialog(true);
        // Clear the state using navigate so it doesn't reopen on every render/polling
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [allJobs, location.state, navigate, location.pathname]);

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

      await api.post(`/api/applications`, payload);
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
    resume?.startsWith('http') ? resume : `${API_URL}/uploads/resumes/${resume}`;

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
      await api.put(`/api/employees/${profile.employeeId}`, formData, {
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
      await api.put(`/api/employees/remove-profile-picture/${userId}`);
      fetchEmployeeProfile();
    } catch (err) {
      console.error('Remove profile pic failed:', err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/user/${userId}`);
      await api.delete(`/api/employees/${profile.employeeId}`);
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
      <Box p={4} textAlign="center">
        <Typography color="error" variant="h6">Employee profile not found. Please complete your details.</Typography>
      </Box>
    );
  }

  const hasPastExperience = profile?.pastexperience?.trim()?.length > 0;
  const hasLocation = profile?.location?.city || profile?.location?.state || profile?.location?.country;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', p: 2 }}>
      {/* LEFT PANEL */}
      {loading ? (
        <Paper elevation={3} sx={{ width: '30%', p: 2, mr: 2, height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
          <CircularProgress />
        </Paper>
      ) : (
        <EmployeeSidebar
          profile={profile}
          API_URL={API_URL}
          handleFileSelect={handleFileSelect}
          handleRemoveProfilePic={handleRemoveProfilePic}
          setOpenUserDialog={setOpenUserDialog}
          setOpenEmpDialog={setOpenEmpDialog}
          setOpenDeleteConfirm={setOpenDeleteConfirm}
          getDefaultAvatar={getDefaultAvatar}
          getResumeUrl={getResumeUrl}
        />
      )}

      {/* RIGHT PANEL */}
      <Paper elevation={3} sx={{ width: '70%', p: 2, height: '80vh', overflowY: 'auto', backgroundColor: 'rgba(92, 225, 230, 0.29)' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Browse Jobs" />
          <Tab label="My Applications" />
        </Tabs>

        {tabValue === 0 ? (
          <EmployeeBrowseJobs
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredJobs={filteredJobs}
            getApplicationStatus={getApplicationStatus}
            renderStatusChip={renderStatusChip}
            setSelectedJob={setSelectedJob}
            setOpenJobDialog={setOpenJobDialog}
          />
        ) : (
          <EmployeeApplications
            appliedJobs={appliedJobs}
            renderStatusChip={renderStatusChip}
          />
        )}
      </Paper>

      {/* Shared Dialogs */}
      <ImageCropperDialog
        open={openCrop}
        onClose={() => setOpenCrop(false)}
        imageSrc={imageSrc}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        onCropComplete={onCropComplete}
        onSave={showCroppedImage}
      />

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
          fetchEmployeeProfile();
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
