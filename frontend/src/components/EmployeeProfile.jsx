import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Stack,
  Divider,
  Chip
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

const EmployeeProfile = ({ employeeId }) => {
  const [employee, setEmployee] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  const userId = searchParams.get('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeRes, userRes] = await Promise.all([
          axios.get(`http://localhost:303/api/employees/${employeeId}`),
          axios.get(`http://localhost:303/api/user/${userId}`)
        ]);

        setEmployee(employeeRes.data);
        setUser(userRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId && userId) fetchData();
  }, [employeeId, userId]);

  const updateStatusAndGoBack = async (status) => {
    try {
      if (applicationId) {
        await axios.put(`http://localhost:303/api/applications/${applicationId}/status`, { status });
      } else {
        console.warn('No applicationId found in URL');
      }
    } catch (err) {
      console.error('Failed to update application status:', err);
    } finally {
      navigate('/employer/dashboard');
    }
  };

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#121212"
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!employee || !user) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#121212"
      >
        <Typography color="error">Employee/User not found</Typography>
      </Box>
    );
  }

  const location = user.location || {};

  return (
    <Box
    minHeight="200px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#121212"
      py={6}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 700,
          width: '100%',
          bgcolor: '#1e1e1e',
          borderRadius: 3,
          color: '#fff',
          boxShadow: '0 0 15px #4dd0e1',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#4dd0e1' }}>
          {user.name || 'Unnamed Employee'}
        </Typography>

        <Divider sx={{ mb: 3, borderColor: '#4dd0e1' }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Email: {user.email || 'N/A'}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Phone: {user.phone || 'N/A'}</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Location: {location.city || 'N/A'}, {location.state || 'N/A'}, {location.country || 'N/A'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, borderColor: '#4dd0e1' }} />

        {employee.pastexperience && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Experience: {employee.pastexperience}
            </Typography>
            {employee.experience && (
              <>
                <Typography variant="subtitle1" fontWeight="bold">
                  Company: {employee.experience.company || 'N/A'}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Role: {employee.experience.role || 'N/A'}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Duration: {employee.experience.duration || 'N/A'}
                </Typography>
              </>
            )}
          </Box>
        )}

        {Array.isArray(employee.skills) && employee.skills.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">Skills</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" mt={1}>
              {employee.skills.map((skill, idx) => (
                <Chip key={idx} label={skill} sx={{ bgcolor: '#4dd0e1', color: '#000' }} />
              ))}
            </Stack>
          </Box>
        )}

        {Array.isArray(employee.certificates) && employee.certificates.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">Certificates</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" mt={1}>
              {employee.certificates.map((cert, idx) => (
                <Chip
                  key={idx}
                  label={`${cert.name}${cert.issuedBy ? ` (${cert.issuedBy})` : ''}`}
                  sx={{ bgcolor: '#4dd0e1', color: '#000', fontSize: '0.8rem' }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {employee.bio && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">Bio : {employee.bio}</Typography>
          </Box>
        )}

        {employee.resume && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              href={employee.resume.startsWith('http')
                ? employee.resume
                : `http://localhost:303/uploads/resumes/${employee.resume}`
              }
              target="_blank"
              sx={{ color: '#4dd0e1', borderColor: '#4dd0e1' }}
            >
              View Resume
            </Button>
          </Box>
        )}

        <Stack direction="row" spacing={3} justifyContent="center" mt={4}>
          <Button
            variant="contained"
            color="success"
            onClick={() => updateStatusAndGoBack('selected')}
            sx={{ minWidth: 120 , borderRadius: 20 }}
          >
            Select
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => updateStatusAndGoBack('rejected')}
            sx={{ minWidth: 120 , borderRadius: 20 }}
          >
            Reject
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => navigate('/employer/dashboard')}
            sx={{ minWidth: 120, borderColor: '#4dd0e1', color: '#4dd0e1', borderRadius: 20 }}
          >
            Cancel
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EmployeeProfile;
