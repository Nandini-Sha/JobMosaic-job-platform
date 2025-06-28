import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton,
  Box, Button, Drawer, List, ListItemButton, ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";

const navItems = [
  { text: 'Jobs', path: '/jobs' },
  { text: 'Company', path: '/company' },
];

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const drawer = (
    <Box onClick={toggleDrawer} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        JobMosaic
      </Typography>
      <List>
        {navItems.map((x) => (
          <ListItemButton key={x.text} component={Link} to={x.path}>
            <ListItemText primary={x.text} />
          </ListItemButton>
        ))}
        <ListItemButton component={Link} to="/login">
          <ListItemText primary="Login" />
        </ListItemButton>
        <ListItemButton component={Link} to="/register">
          <ListItemText primary="Register" />
        </ListItemButton>
      </List>
    </Box>
  );

  const handleBrandClick = () => {
    window.location.href = '/jobs'; // Full reload redirect
  };

  return (
    <>
      <AppBar
        component="nav"
        position="static"
        sx={{
          backgroundColor: 'black',
          px: 0,
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ minHeight: 80, px: { xs: 1, sm: 3 } }}>
          {/* Logo + Brand (Click to go to /jobs with refresh) */}
          <Box
            onClick={handleBrandClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1,
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                height: 50,
                width: 50,
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: 8,
              }}
            />
            <Typography
              variant="h6"
              sx={{ color: 'white', ml: 1.5, fontSize: '2rem', fontWeight: 'bold' }}
            >
              JobMosaic
            </Typography>
          </Box>

          {/* Desktop Navigation Items */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {navItems.map((x) => (
              <Button key={x.text} color="inherit" component={Link} to={x.path}>
                {x.text}
              </Button>
            ))}
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/register"
              sx={{ backgroundColor: "rgb(92, 225, 230)", borderRadius: '50px' }}
            >
              Register
            </Button>
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={toggleDrawer}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile View */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
