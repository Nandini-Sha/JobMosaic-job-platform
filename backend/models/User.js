const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'employer'], required: true },
  gender: { type: String, enum: ['male', 'female', 'prefer not to say'], required: true },
  phone: {
    type: String,
    required: true,
    match: /^[+]?[0-9]{7,15}$/
  },
  location: {
    city: String,
    state: String,
    country: String
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
