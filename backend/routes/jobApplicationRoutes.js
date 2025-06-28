// routes/jobApplicationRoutes.js
const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controllers/jobApplicationController');

// Apply to a job
router.post('/', jobApplicationController.applyToJob);

// Get applications by employee
router.get('/employee/:employeeId', jobApplicationController.getApplicationsByEmployee);

// Get applications for a job
router.get('/job/:jobId', jobApplicationController.getApplicationsForJob);

// Update application status
router.put('/:id/status', jobApplicationController.updateApplicationStatus);

// Delete an application
router.delete('/:id', jobApplicationController.deleteApplication);

router.get('/job/:jobId/stats', jobApplicationController.getApplicationStatsByJobId);


module.exports = router;



