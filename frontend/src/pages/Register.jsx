import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import registerImg from '../assets/bg.png';

const Register = () => {
  const [form, setForm] = useState({
    name: "", email: "", role: "", gender: "", phone: "",
    password: "", confirmPassword: "", city: "", state: "", country: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const hc = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const hs = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setSuccessMessage('');
      return;
    }

    const { confirmPassword, city, state, country, ...rest } = form;

    const userData = {
      ...rest,
      location: {
        city,
        state,
        country
      }
    };

    try {
      const res = await axios.post("http://localhost:303/api/auth/register", userData);

      const user = res.data.user;
      const token = res.data.token;

      if (!user || !user._id) {
        setErrorMessage("Registration failed: Missing user data.");
        setSuccessMessage('');
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("role", user.role);

      console.log("User registered:", user);

      setSuccessMessage("Registration successful!");
      setErrorMessage('');

      setTimeout(() => {
        if (user.role === 'employee') {
          navigate('/employee/details', { state: user });
        } else if (user.role === 'employer') {
          navigate('/employer/details', { state: user });
        } else {
          setErrorMessage("Invalid role selected");
          setSuccessMessage('');
        }
      }, 1000);

    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed');
      setSuccessMessage('');
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px', marginBottom: '12px',
    borderRadius: '8px', border: '1px solid #ccc',
    fontSize: '15px', outline: 'none', backgroundColor: '#ffffffcc'
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '4px',
    fontSize: '14px',
    textAlign: 'left'
  };

  const renderPasswordInput = (label, name, value, show, setShow) => (
    <Box>
      <label style={labelStyle}>{label} *</label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={hc}
          required
          style={inputStyle}
        />
        <IconButton
          onClick={() => setShow(!show)}
          style={{ position: 'absolute', top: '6px', right: '6px' }}
        >
          {show ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </div>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundImage: `url(${registerImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2
      }}
    >
      <Box sx={{
        bgcolor: 'rgba(255, 255, 255, 0.25)',
        p: 4,
        borderRadius: 3,
        boxShadow: 5,
        width: '340px',
        backdropFilter: 'blur(6px)',
        textAlign: 'center',
        my: 8
      }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Register</Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={hs} style={{ textAlign: 'left' }}>
          <Box><label style={labelStyle}>Name *</label><input type='text' name='name' onChange={hc} required style={inputStyle} /></Box>
          <Box><label style={labelStyle}>Email *</label><input type='email' name='email' onChange={hc} required style={inputStyle} /></Box>

          <Box>
            <label style={labelStyle}>Role *</label>
            <select name="role" onChange={hc} required style={inputStyle}>
              <option value="">Select</option>
              <option value="employee">Employee</option>
              <option value="employer">Employer</option>
            </select>
          </Box>

          <Box>
            <label style={labelStyle}>Gender *</label>
            <select name="gender" onChange={hc} required style={inputStyle}>
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="prefer not to say">Prefer not to say</option>
            </select>
          </Box>

          <Box><label style={labelStyle}>Phone *</label><input type='tel' name='phone' onChange={hc} required style={inputStyle} /></Box>

          {renderPasswordInput("Password", "password", form.password, showPassword, setShowPassword)}
          {renderPasswordInput("Confirm Password", "confirmPassword", form.confirmPassword, showConfirm, setShowConfirm)}

          <Box><label style={labelStyle}>City</label><input type='text' name='city' onChange={hc} style={inputStyle} /></Box>
          <Box><label style={labelStyle}>State</label><input type='text' name='state' onChange={hc} style={inputStyle} /></Box>
          <Box><label style={labelStyle}>Country</label><input type='text' name='country' onChange={hc} style={inputStyle} /></Box>

          <Button type="submit" sx={{
            backgroundColor: "rgb(92, 225, 230)",
            borderRadius: '30px',
            width: '100%',
            py: 1,
            mt: 1,
            color: 'white',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: 'rgb(65, 195, 200)' },
          }}>
            Register
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Register;
9