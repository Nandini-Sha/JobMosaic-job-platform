const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      gender,
      phone,
      location = {} // fallback to empty object
    } = req.body;

    // Basic validations
    if (!email || !name || !password || !role || !phone) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Ensure location has all 3 parts
    const finalLocation = {
      city: location.city || '',
      state: location.state || '',
      country: location.country || ''
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      gender,
      phone,
      location: finalLocation
    });

    await user.save();
    res.status(201).json({
      message: 'User created successfully',
      user: {
        ...user.toObject(),
        password: undefined // hide password
      }
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all users
exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get single user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const allowedFields = ['name', 'phone', 'location'];
    const updates = {};

    // Filter only allowed fields from req.body
    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // Ensure location is structured properly if provided
    if (updates.location) {
      updates.location = {
        city: updates.location.city || '',
        state: updates.location.state || '',
        country: updates.location.country || ''
      };
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('User update failed:', err);
    res.status(400).json({ message: err.message });
  }
};


// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
