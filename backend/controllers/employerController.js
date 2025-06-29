const Employer = require('../models/Employer');
const fs = require('fs');
const path = require('path');

// ✅ Create or update employer by userId
exports.createOrUpdateEmployer = async (req, res) => {
  try {
    const {
      userId,
      companyName,
      position,
      companyDescription,
      website,
      industry,
      contactPerson
    } = req.body;

    const data = {
      userId,
      companyName,
      position,
      companyDescription,
      website,
      industry,
      contactPerson
    };

    if (req.file) {
      data.companyLOGO = req.file.filename;
    }

    const existing = await Employer.findOne({ userId });

    if (existing) {
      const updated = await Employer.findByIdAndUpdate(existing._id, data, { new: true });
      return res.status(200).json({
        message: 'Employer updated successfully',
        employer: updated
      });
    }

    const newEmployer = new Employer(data);
    await newEmployer.save();

    res.status(201).json({
      message: 'Employer created successfully',
      employer: newEmployer
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Server error during employer creation'
    });
  }
};

// ✅ Get all employers
exports.getAllEmployers = async (_req, res) => {
  try {
    const employers = await Employer.find();
    res.status(200).json(employers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get employer by _id
exports.getEmployer = async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    if (!employer) return res.status(404).json({ message: 'Employer not found' });
    res.json(employer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get employer by userId
exports.getEmployerByUserId = async (req, res) => {
  try {
    const employer = await Employer.findOne({ userId: req.params.userId });
    if (!employer) return res.status(404).json({ message: 'Employer not found with this userId' });
    res.json(employer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update employer by userId (used in PUT /api/employers/:id)
exports.updateEmployer = async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) {
      updates.companyLOGO = req.file.filename;
    }

    const updatedEmployer = await Employer.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updatedEmployer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    res.json({ message: 'Employer updated successfully', employer: updatedEmployer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Delete employer by _id
exports.deleteEmployer = async (req, res) => {
  try {
    const deleted = await Employer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Employer not found' });

    // Optional: Delete uploaded logo file from disk
    if (deleted.companyLOGO) {
      const logoPath = path.join(__dirname, '../uploads/companyLogos', deleted.companyLOGO);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    res.json({ message: 'Employer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

