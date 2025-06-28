const mongoose = require('mongoose');//importing mongoose library

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel',  // allows referencing either Employee or Employer dynamically
    required: true,
  },
  userModel: {
    type: String,
    required: true,
    enum: ['Employee', 'Employer'],
  },
  type: {
    type: String,
    enum: [
      'Job Application Status',
      'New Job Posting',
      'Job Alert',
      'New Application Received',
      'Interview Scheduled',
      'Message',
    ],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
