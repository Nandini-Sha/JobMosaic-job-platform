const Employee = require('../models/Employee');
const fs = require('fs');
const path = require('path');


// Create or update employee by userId (POST /api/employees)
exports.createOrUpdateEmployee = async (req, res) => {
  try {
    let { userId, skills, pastexperience, experience, certificates, bio } = req.body;

    if (typeof skills === 'string') {
      skills = skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (typeof certificates === 'string') {
      try {
        certificates = JSON.parse(certificates);
      } catch {
        certificates = [];
      }
    }

    if (typeof experience === 'string') {
      try {
        experience = JSON.parse(experience);
      } catch {
        experience = null;
      }
    }

    const data = {
      userId,
      skills,
      pastexperience,
      certificates,
      bio
    };

    if (experience) data.experience = experience;

    if (req.files?.profilepicture?.[0]) {
      data.profilepicture = req.files.profilepicture[0].filename;
    }

    if (req.files?.resume?.[0]) {
      data.resume = req.files.resume[0].filename;
    }

    const existing = await Employee.findOne({ userId });

    if (existing) {
      const updated = await Employee.findByIdAndUpdate(existing._id, data, { new: true });
      return res.status(200).json({
        message: 'Employee updated successfully',
        employee: updated
      });
    }

    const newEmployee = new Employee(data);
    await newEmployee.save();

    res.status(201).json({
      message: 'Employee created successfully',
      employee: newEmployee
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error during employee creation' });
  }
};

// Get all employees (GET /api/employees)
exports.getAllEmployees = async (_req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get employee by _id (GET /api/employees/:id)
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get employee by userId (GET /api/employees/by-user/:userId)
exports.getEmployeeByUserId = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.params.userId });
    if (!employee) return res.status(404).json({ message: 'Employee not found with this userId' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update employee by _id (PUT /api/employees/:id)
exports.updateEmployee = async (req, res) => {
  try {
    let updates = req.body;

    if (typeof updates.skills === 'string') {
  try {
    updates.skills = JSON.parse(updates.skills);
  } catch {
    updates.skills = [];
  }
}


    if (typeof updates.certificates === 'string') {
      try {
        updates.certificates = JSON.parse(updates.certificates);
      } catch {
        updates.certificates = [];
      }
    }

    if (typeof updates.experience === 'string') {
      try {
        updates.experience = JSON.parse(updates.experience);
      } catch {
        delete updates.experience;
      }
    }

    if (req.files?.profilepicture?.[0]) {
      updates.profilepicture = req.files.profilepicture[0].filename;
    }

    if (req.files?.resume?.[0]) {
      updates.resume = req.files.resume[0].filename;
    }

    // Find employee by userId and update
    const updatedEmployee = await Employee.findOneAndUpdate(
      { userId: req.params.id },
      updates,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Delete employee by _id (DELETE /api/employees/:id)
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove profile picture (PUT /api/employees/remove-profile-picture/:userId)
exports.removeProfilePicture = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.params.userId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.profilepicture) {
      const imagePath = path.join(__dirname, '../uploads/profilepics', employee.profilepicture);

      // Delete file from disk if it exists
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      employee.profilepicture = null;
      await employee.save();
    }

    res.json({ message: 'Profile picture removed successfully' });
  } catch (err) {
    console.error('Error removing profile picture:', err);
    res.status(500).json({ message: 'Error removing profile picture' });
  }
};

