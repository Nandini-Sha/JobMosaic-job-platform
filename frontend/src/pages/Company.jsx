import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Button,
  Avatar,
  Card,
  CardContent,
  TextField,
  Paper,
} from '@mui/material';

import axios from 'axios';
import { Cardforcompanyies } from '../components/Jobcard';

const API_URL = import.meta.env.VITE_API_URL;

const Company = () => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/employers`);
        const mappedCompanies = res.data.map(emp => ({
          name: emp.companyName || 'Unknown Company',
          logo: emp.companyLOGO,
          info: emp.companyDescription || 'No description provided.',
          link: emp.website || ''
        }));
        setAllCompanies(mappedCompanies);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = allCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        backgroundColor: '#f7f7f7',
        minHeight: '100vh',
        pb: 8,
        px: 2,
        pt: 8,
      }}
    >
      <Typography variant="h2" textAlign="center" fontWeight="bold" gutterBottom>
        Explore Top Companies
      </Typography>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Discover great places to work and grow your career.
      </Typography>

      {/* Filter Bar Centered */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Paper elevation={3} sx={{ p: 2, width: '100%', maxWidth: 400 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Paper>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={3} justifyContent="center">
        {filteredCompanies.map((company, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Cardforcompanyies company={company} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Company;
