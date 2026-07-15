import React from 'react';
import { Paper, Stack, Button, Divider, Typography, Chip } from '@mui/material';
import defaultIndustry from '../../assets/industry.jpg';

const EmployerSidebar = ({
  profile,
  API_URL,
  handleFileSelect,
  setOpenUserDialog,
  setOpenEmployerDialog,
  setOpenDeleteConfirm
}) => {
  const {
    name, email, phone, location, companyName, companyDescription,
    industry, website, position, contactPerson, companyLOGO
  } = profile || {};

  const logoUrl = companyLOGO?.startsWith('http')
    ? companyLOGO
    : companyLOGO
      ? `${API_URL}/uploads/companyLogos/${companyLOGO}?${new Date().getTime()}`
      : defaultIndustry;

  return (
    <Paper elevation={3} sx={{ width: '30%', p: 2, mr: 2, height: '80vh', overflowY: 'auto', backgroundColor: '#000', color: '#fff' }}>
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
  );
};

export default EmployerSidebar;
