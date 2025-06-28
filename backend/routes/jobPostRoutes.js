const express = require('express');
const router = express.Router();
const jobPostController = require('../controllers/jobPostController');

// ✅ Create a new job post
router.post('/', jobPostController.createJobPost);

// ✅ Get all job posts
router.get('/', jobPostController.getAllJobPosts);

// ✅ Get all jobs posted by a specific employer (move above `/:id`)
router.get('/employer/:employerId', jobPostController.getJobsByEmployer);

// ✅ Get a single job post by ID
router.get('/:id', jobPostController.getJobPostById);

// ✅ Update a job post by ID
router.put('/:id', jobPostController.updateJobPost);

// ✅ Delete a job post by ID
router.delete('/:id', jobPostController.deleteJobPost);

module.exports = router;
