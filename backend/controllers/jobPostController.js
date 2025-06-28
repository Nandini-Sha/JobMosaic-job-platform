const JobPost = require('../models/JobPost');

// ✅ Create a new job post
exports.createJobPost = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      salaryRange,
      employmentType,
      category,
      employerId,
      applicationDeadline,
    } = req.body;

    // Basic validation
    if (!title || !description || !requirements || !employmentType || !category || !employerId) {
      return res.status(400).json({ message: 'Missing required job fields.' });
    }

    const newJob = new JobPost({
      title,
      description,
      requirements,
      location,
      salaryRange,
      employmentType,
      category,
      employerId,
      applicationDeadline,
    });

    const savedJob = await newJob.save();
    console.log('✅ Job created by employerId:', employerId);
    res.status(201).json({ message: 'Job created successfully', job: savedJob });
  } catch (error) {
    console.error('❌ Error creating job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Get all job posts (with employer info)
exports.getAllJobPosts = async (req, res) => {
  try {
    const jobs = await JobPost.find()
      .populate('employerId', 'companyName industry');
    res.status(200).json(jobs);
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Get a single job post by ID (with employer info)
exports.getJobPostById = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id)
      .populate('employerId', 'companyName industry');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error('❌ Error fetching job by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Update a job post by ID
exports.updateJobPost = async (req, res) => {
  try {
    const updatedJob = await JobPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
  } catch (error) {
    console.error('❌ Error updating job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Delete a job post by ID
exports.deleteJobPost = async (req, res) => {
  try {
    const deleted = await JobPost.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Get all jobs posted by a specific employer
exports.getJobsByEmployer = async (req, res) => {
  try {
    const jobs = await JobPost.find({ employerId: req.params.employerId })
      .populate('employerId', 'companyName industry');
    res.status(200).json(jobs);
  } catch (error) {
    console.error('❌ Error fetching jobs by employer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
