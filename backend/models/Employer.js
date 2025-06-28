const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  companyName: { type: String, required:false },
  position: {type: String, required:false},
  companyDescription: { type: String },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: v => /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(v) || v === '',
      message: props => `${props.value} is not a valid URL!`
    },
    default: ''
  },
  industry: {
    type: String,
    enum: [
      'Information Technology', 'Healthcare', 'Education',
      'Finance', 'Manufacturing', 'Retail',
      'Construction', 'Marketing', 'Other'
    ],
    required: false,
  },
  postedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  contactPerson: {
    type: String,
    match: /^[+]?[0-9]{7,15}$/
  },
  companyLOGO: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Employer', employerSchema);
