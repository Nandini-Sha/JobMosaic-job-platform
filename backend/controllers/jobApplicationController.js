const JobApplication = require('../models/JobApplication');
const Job = require('../models/JobPost');
const mongoose = require('mongoose');

// Apply to a job
exports.applyToJob = async (req, res) => {
  try {
    const { employeeId, jobId, userId } = req.body;

    const existing = await JobApplication.findOne({ employeeId, jobId });
    if (existing) {
      return res.status(409).json({ error: 'You have already applied for this job.' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const application = new JobApplication({
      employeeId,
      jobId,
      employerId: job.employerId,
      userId,
      status: 'pending',
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error('Error applying to job:', err);
    res.status(500).json({ error: 'Failed to apply to job' });
  }
};

// Get applications for a specific job (with employee and user info)
exports.getApplicationsForJob = async (req, res) => {
  try {
    const applications = await JobApplication.find({ jobId: req.params.jobId })
      .populate('employeeId', 'name profile skills')
      .populate('userId', 'name email phone'); // ✅ Ensure userId is available

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get applications by employee
exports.getApplicationsByEmployee = async (req, res) => {
  try {
    const applications = await JobApplication.find({ employeeId: req.params.employeeId })
      .populate({
        path: 'jobId',
        select: 'title category companyName location salaryRange employmentType applicationDeadline description requirements',
      });

    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching employee applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get application stats by job ID
exports.getApplicationStatsByJobId = async (req, res) => {
  const { jobId } = req.params;

  try {
    const stats = await JobApplication.aggregate([
      { $match: { jobId: new mongoose.Types.ObjectId(jobId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = { pending: 0, selected: 0, rejected: 0 };

    stats.forEach(({ _id, count }) => {
      if (result.hasOwnProperty(_id)) {
        result[_id] = count;
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting application stats:', error);
    res.status(500).json({ error: 'Failed to get application stats' });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json({ message: 'Application updated', application: updated });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const deleted = await JobApplication.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json({ message: 'Application deleted' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
