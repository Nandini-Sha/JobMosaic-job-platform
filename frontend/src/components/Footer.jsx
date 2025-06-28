import React from 'react';
import { Box, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

import company1 from '../assets/friendlogos/Alvioni.png';
import company2 from '../assets/friendlogos/Fauget.png';
import company3 from '../assets/friendlogos/Licera.png';
import company4 from '../assets/friendlogos/Otieno.png';
import company5 from '../assets/friendlogos/Samira.png';
import company6 from '../assets/friendlogos/master.png';
import company7 from '../assets/friendlogos/marceline.png';

const logos = [company1, company2, company3, company4, company5, company6, company7];

const Footer = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 3,
        px: 4,
        flexWrap: 'wrap',
        backgroundColor: 'rgba(92, 225, 230, 0.29)',
      }}
    >
      {/* Left side - Company name and slogan */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          JobMosaic
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(28, 51, 53, 0.75)',
            fontWeight: 'bold',
          }}
        >
          "Your personalized career canvas"
          <br />
          "Another details"
        </Typography>
      </Box>

      {/* Right side - Label followed by carousel (same row) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(28, 51, 53, 0.75)',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          Our businesses:
        </Typography>
        <Box sx={{ width: 320 }}>
          <Carousel
            autoPlay
            animation="fade"
            indicators={false}
            navButtonsAlwaysInvisible
            interval={2000}
            duration={600}
            swipe
          >
            {logos.map((_, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {[0, 1, 2].map((j) => {
                  const logo = logos[(i + j) % logos.length];
                  return (
                    <img
                      key={j}
                      src={logo}
                      alt={`Partner ${i}-${j}`}
                      style={{ height: 90, width: 90, objectFit: 'contain' }}
                      loading="lazy"
                    />
                  );
                })}
              </Box>
            ))}
          </Carousel>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
