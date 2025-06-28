// models/Employee.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  issuedBy: { type: String, trim: true },
  date: { type: Date }
}, { _id: false }); // to avoid nested _id for each certificate

const experienceSchema = new mongoose.Schema({
  company: { type: String, trim: true },
  role: { type: String, trim: true },
  duration: { type: String, trim: true }
}, { _id: false }); // avoid nested _id here too

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  skills: {
    type: [String],
    default: []
  },

  pastexperience: {
    type: String,
    trim: true
  },

  experience: {
    type: experienceSchema,
    default: {}
  },

  certificates: {
    type: [certificateSchema],
    default: []
  },

  resume: {
    type: String,
    trim: true,
    default: ''
  },

  appliedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],

  bio: {
    type: String,
    maxlength: 500,
    trim: true
  },

  profilepicture: {
    type: String,
    trim: true,
    default: ''
  }

}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
