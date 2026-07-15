import React from 'react';
import { Paper, Stack, Button, Divider, Typography, Chip } from '@mui/material';

const EmployeeSidebar = ({
  profile,
  API_URL,
  handleFileSelect,
  handleRemoveProfilePic,
  setOpenUserDialog,
  setOpenEmpDialog,
  setOpenDeleteConfirm,
  getDefaultAvatar,
  getResumeUrl
}) => {
  const hasPastExperience = profile?.pastexperience?.trim()?.length > 0;
  const hasLocation = profile?.location?.city || profile?.location?.state || profile?.location?.country;

  return (
    <Paper elevation={3} sx={{ width: '30%', p: 2, mr: 2, height: '80vh', overflowY: 'auto', backgroundColor: '#000', color: '#fff' }}>
      <Stack alignItems="center">
        <img
          src={profile.profilepicture ? `${API_URL}/uploads/profilepics/${profile.profilepicture}?${Date.now()}` : getDefaultAvatar(profile.gender)}
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
    </Paper>
  );
};

export default EmployeeSidebar;
