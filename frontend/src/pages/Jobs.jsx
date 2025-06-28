import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  TextField,
  Grid,
} from '@mui/material';
import { JobcardforJobs } from '../components/Jobcard';
import jobs from '../data/job';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm]);

  const handleViewDetails = (job) => {
    window.open(job.link, '_blank'); 
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f7f7f7', // light neutral background
        minHeight: '100vh',
        pb: 8,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 2,
          pt: 8,
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          gutterBottom
          sx={{ textAlign: 'center', color: '#1b1b1b' }}
        >
          Paint Your Future
        </Typography>
        <Typography
          variant="h2"
          fontWeight="bold"
          gutterBottom
          sx={{ textAlign: 'center', color: '#1b1b1b' }}
        >
          Start Here!!
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
          Whether you're stepping into the job market for the first time
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
          or looking to take your career to the next level — JobMosaic is your partner in progress,
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
          connecting you with opportunities that truly align with your goals and potential.
        </Typography>

        {/* Search Bar */}
        <Box sx={{ p: 2, mt: 4 }}>
          <TextField
            placeholder="Search jobs..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: { xs: '90%', sm: '600px' },
              borderRadius: '800px',
              backgroundColor: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              '& .MuiOutlinedInput-root': {
                borderRadius: '800px',
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
            InputProps={{
              sx: {
                fontWeight: 'bold',
                color: 'black',
              },
            }}
          />
        </Box>

        {/* Job Cards Grid */}
        <Grid container spacing={3} justifyContent="center" mt={1}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Grid item key={job.id}>
                <JobcardforJobs job={job} onView={handleViewDetails} />
              </Grid>
            ))
          ) : (
            <Typography variant="h6" color="text.secondary" mt={4}>
              No jobs found matching your search.
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Jobs;
