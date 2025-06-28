import React, { useState } from 'react';
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

import companies from '../data/companies';

const Cardforcompanyies = ({ company }) => {
  return (
    <Card sx={{ maxWidth: 300, m: 1, p: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar src={company.logo} alt={company.name} sx={{ width: 48, height: 48 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {company.name}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {company.info}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          href={company.link.startsWith('http') ? company.link : `https://${company.link}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Website
        </Button>
      </CardContent>
    </Card>
  );
};

const Company = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter((company) =>
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
