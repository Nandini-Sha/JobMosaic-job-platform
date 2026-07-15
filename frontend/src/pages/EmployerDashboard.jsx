import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import {
  Box, Typography, Paper, Stack, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, Tabs, Tab
} from '@mui/material';
import getCroppedImg from '../utils/cropImage';
import UpdateUserDialog from '../components/UpdateUserDialog';
import UpdateEmployerDialog from '../components/UpdateEmployerDialog';
import JobPostFormDialog from '../components/JobPostFormDialog';
import EmployerSidebar from '../components/dashboard/EmployerSidebar';
import EmployerJobManagement from '../components/dashboard/EmployerJobManagement';
import EmployerApplications from '../components/dashboard/EmployerApplications';
import { ApplicationsListDialog, SingleApplicationDialog } from '../components/dashboard/EmployerApplicationDialogs';
import ImageCropperDialog from '../components/dashboard/ImageCropperDialog';
import defaultIndustry from '../assets/industry.jpg';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

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

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const fetchEmployerProfile = async () => {
    try {
      if (!userId) return;
      const userRes = await api.get(`/api/user/${userId}`);
      const empRes = await api.get(`/api/employers/by-user/${userId}`);
      setProfile({ ...userRes.data, ...empRes.data, userId, employerId: empRes.data._id });
    } catch (error) {
      console.error('Error fetching employer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobStats = async (jobId) => {
    try {
      const res = await api.get(`/api/applications/job/${jobId}/stats`);
      const stats = res.data;
    const total = (stats.pending || 0) + (stats.selected || 0) + (stats.rejected || 0);
    setJobStats(prev => ({ ...prev, [jobId]: { ...stats, total } }));
    } catch (err) {
      console.error(`Error fetching stats for job ${jobId}:`, err);
    }
  };

  const fetchJobs = async () => {
  try {
    if (!profile?.employerId) return;
    const res = await api.get(`/api/jobs/employer/${profile.employerId}`);
    setJobs(res.data);

    // Wait for all stats to be fetched
    const updatedStats = await Promise.all(
      res.data.map(async (job) => {
        const statsRes = await api.get(`/api/applications/job/${job._id}/stats`);
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
    const res = await api.get(`/api/applications/job/${jobId}?populateUser=true`);
    setSelectedJobApplications(res.data);
    setOpenApplicationsDialog(true);
    
  } catch (err) {
    console.error('Error fetching applications:', err);
  }
};


  const fetchApplicationDetails = async (applicationId) => {
    try {
      const res = await api.get(`/api/applications/${applicationId}`);
      setSelectedApplication(res.data);
      setOpenApplicationDialog(true);
    } catch (err) {
      console.error('Error fetching application:', err);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await api.put(`/api/applications/${applicationId}`, { status });
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
    if (userId) {
      fetchEmployerProfile();
    }
  }, [userId]);

  useEffect(() => {
    if (profile?.employerId) {
      fetchJobs();
      const intervalId = setInterval(() => {
        fetchJobs();
      }, 10000); // Poll every 10 seconds
      return () => clearInterval(intervalId);
    }
  }, [profile?.employerId]);

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

    const formData = new FormData();
    formData.append('companyLOGO', blob);

    // Optionally re-send other fields to preserve them (some backends replace instead of merging)
    formData.append('companyName', profile?.companyName || '');
    formData.append('position', profile?.position || '');
    formData.append('companyDescription', profile?.companyDescription || '');
    formData.append('website', profile?.website || '');
    formData.append('industry', profile?.industry || '');
    formData.append('contactPerson', profile?.contactPerson || '');

    await api.put(`/api/employers/${profile.employerId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setOpenCrop(false);
    fetchEmployerProfile(); // 🔄 Refresh
  } catch (error) {
    console.error('Crop/upload failed:', error);
  }
};

  const handleDeleteJob = async (jobId) => {
    try {
      await api.delete(`/api/jobs/${jobId}`);
      fetchJobs();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/user/${userId}`);
      await api.delete(`/api/employers/${profile.employerId}`);
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
      ? `${API_URL}/uploads/companyLogos/${companyLOGO}?${new Date().getTime()}`
      : defaultIndustry;

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
      {loading ? (
        <Paper elevation={3} sx={{ width: '30%', p: 2, mr: 2, height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
          <CircularProgress />
        </Paper>
      ) : (
        <EmployerSidebar
          profile={profile}
          API_URL={API_URL}
          handleFileSelect={handleFileSelect}
          setOpenUserDialog={setOpenUserDialog}
          setOpenEmployerDialog={setOpenEmployerDialog}
          setOpenDeleteConfirm={setOpenDeleteConfirm}
        />
      )}

      {/* RIGHT PANEL - JOB MANAGEMENT */}
      <Paper elevation={3} sx={{ width: '70%', p: 2, height: '80vh', overflowY: 'auto', backgroundColor: 'rgba(92, 225, 230, 0.2)' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Job Management" />
          <Tab label="Applications" />
        </Tabs>

        {tabValue === 0 ? (
          <EmployerJobManagement
            jobs={jobs}
            jobStats={jobStats}
            setEditingJob={setEditingJob}
            setOpenJobForm={setOpenJobForm}
            fetchApplicationsForJob={fetchApplicationsForJob}
            handleEditJob={handleEditJob}
            handleDeleteJob={handleDeleteJob}
          />
        ) : (
          <EmployerApplications
            jobs={jobs}
            jobStats={jobStats}
            fetchApplicationsForJob={fetchApplicationsForJob}
          />
        )}

        {/* JOB POST FORM DIALOG */}
        <JobPostFormDialog
          open={openJobForm}
          onClose={handleJobFormClose}
          employerId={profile?.employerId}
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
          employerId={profile?.employerId}
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

        {/* APPLICATIONS LIST DIALOG */}
        <ApplicationsListDialog
          open={openApplicationsDialog}
          onClose={() => setOpenApplicationsDialog(false)}
          selectedJobApplications={selectedJobApplications}
          navigate={navigate}
        />

        {/* SINGLE APPLICATION DIALOG */}
        <SingleApplicationDialog
          open={openApplicationDialog}
          onClose={() => setOpenApplicationDialog(false)}
          selectedApplication={selectedApplication}
          handleUpdateApplicationStatus={handleUpdateApplicationStatus}
          API_URL={API_URL}
        />
      </Paper>
    </Box>
  );
};

export default EmployerDashboard;
