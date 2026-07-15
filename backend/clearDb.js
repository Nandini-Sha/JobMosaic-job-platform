require('dotenv').config();
const mongoose = require('mongoose');

// Import your models
const User = require('./models/User');
const Employee = require('./models/Employee');
const Employer = require('./models/Employer');
const JobPost = require('./models/JobPost');
const JobApplication = require('./models/JobApplication');
const Notification = require('./models/Notification');

const clearDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    console.log('Clearing old data...');
    // Drop all collections by deleting many (this is safer than dropping the whole DB in case of other users)
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Employer.deleteMany({});
    await JobPost.deleteMany({});
    await JobApplication.deleteMany({});
    await Notification.deleteMany({});

    console.log('✅ All old data successfully cleared from the database!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
