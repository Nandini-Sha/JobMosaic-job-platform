const User = require('../models/User');
const Employee = require('../models/Employee');
const Employer = require('../models/Employer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, gender, phone, location } = req.body;

    if (!email || !password || !name || !role || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      gender,
      phone,
      location,
    });

    await user.save();

    let profile = null;
    if (role === 'employee') {
      profile = new Employee({ userId: user._id });
      await profile.save();
    } else if (role === 'employer') {
      profile = new Employer({ userId: user._id }); 
      await profile.save();
    }

    const { password: _, ...userData } = user._doc;

    res.status(201).json({
      message: 'User registered successfully',
      user: userData,
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  console.log("Login request body:", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'No user found, please register' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    const { password: _, ...userData } = user._doc;
    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logoutUser = async (req, res) => {
  // Token-based logout is handled on the frontend (by deleting token)
  // But for completeness:
  res.status(200).json({ message: 'Logged out successfully' });
};
