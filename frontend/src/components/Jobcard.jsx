import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
} from '@mui/material';

const API_URL = import.meta.env.VITE_API_URL;

// Job Card
export const JobcardforJobs = ({ job, onView }) => {
  const logoUrl = job.logo?.startsWith('http') || job.logo?.startsWith('data:') 
    ? job.logo 
    : job.logo 
      ? `${API_URL}/uploads/companyLogos/${job.logo}` 
      : undefined;

  return (
    <Card sx={{ maxWidth: 300, m: 1, p: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar src={logoUrl} alt={job.company} sx={{ width: 48, height: 48 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {job.company}
          </Typography>
        </Box>

        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {job.description}
        </Typography>
        <Typography variant="body2">{job.location}</Typography>
        <Typography variant="body2">{job.type}</Typography>
        <Typography variant="body2">Posted: {job.postedOn}</Typography>

        {onView && (
          <Box mt={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => onView(job)}
              sx={{
                color: 'rgb(92, 225, 230)',
                borderColor: 'rgb(92, 225, 230)',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(92, 225, 230, 0.08)',
                  borderColor: 'rgb(92, 225, 230)',
                },
              }}
            >
              View Job
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export const Cardforcompanyies = ({ company }) => {
  const logoUrl = company.logo?.startsWith('http') || company.logo?.startsWith('data:')
    ? company.logo
    : company.logo
      ? `${API_URL}/uploads/companyLogos/${company.logo}`
      : undefined;

  const hasLink = company.link && company.link.trim() !== '' && company.link !== '#';

  return (
    <Card sx={{ maxWidth: 300, m: 1, p: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar src={logoUrl} alt={company.name} sx={{ width: 48, height: 48 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {company.name}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {company.info}
        </Typography>

        <Box mt={2}>
          <Button
            variant="outlined"
            fullWidth
            disabled={!hasLink}
            sx={{
              color: hasLink ? 'rgb(92, 225, 230)' : 'text.disabled',
              borderColor: hasLink ? 'rgb(92, 225, 230)' : 'action.disabledBackground',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              '&:hover': hasLink ? {
                backgroundColor: 'rgba(92, 225, 230, 0.08)',
                borderColor: 'rgb(92, 225, 230)',
              } : {},
            }}
            href={hasLink ? (company.link.startsWith('http') ? company.link : `https://${company.link}`) : undefined}
            target={hasLink ? "_blank" : undefined}
            rel={hasLink ? "noopener noreferrer" : undefined}
          >
            {hasLink ? "Visit Website" : "No Website Provided"}
          </Button>
          
        </Box>
      </CardContent>
    </Card>
  );
};
