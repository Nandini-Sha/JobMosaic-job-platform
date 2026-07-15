const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Init Express
const app = express();

// Connect to MongoDB
const connectdb = require('./config/db');
connectdb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base API health route
app.get('/', (req, res) => {
  res.send('🌟 JobMosaic API is running');
});

// Health check endpoint for Uptime Robot
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is awake' });
});

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const employerRoutes = require('./routes/employerRoutes');
const jobPostRoutes = require('./routes/jobPostRoutes');
const jobApplicationRoutes = require('./routes/jobApplicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/jobs', jobPostRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/applications', require('./routes/jobApplicationRoutes'));


app.use((req, res) => {
  res.status(404).json({ message: '🔍 Route not found' });
});

// Global Error Handler (optional but clean)
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ message: 'Something broke on the server' });
});

// Start Server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
