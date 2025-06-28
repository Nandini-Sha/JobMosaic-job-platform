const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Import employee controllers
const {
  createOrUpdateEmployee,
  getEmployee,
  getEmployeeByUserId,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  removeProfilePicture
} = require('../controllers/employeeController');

// Ensure upload folders exist
const ensureFoldersExist = () => {
  ['uploads/resumes', 'uploads/profilepics', 'uploads/others'].forEach(folder => {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  });
};
ensureFoldersExist();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resume') cb(null, 'uploads/resumes/');
    else if (file.fieldname === 'profilepicture') cb(null, 'uploads/profilepics/');
    else cb(null, 'uploads/others/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Routes

// Create or update employee (POST /api/employees/)
router.post(
  '/',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profilepicture', maxCount: 1 }
  ]),
  createOrUpdateEmployee
);

// Get all employees (GET /api/employees/)
router.get('/', getAllEmployees);

// Get employee by userId (GET /api/employees/by-user/:userId)
router.get('/by-user/:userId', getEmployeeByUserId);

// Get employee by _id (GET /api/employees/:id)
// Note: This route should come after more specific routes (like /by-user/:userId)
router.get('/:id', getEmployee);

// Update employee by _id (PUT /api/employees/:id)
router.put(
  '/:id',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profilepicture', maxCount: 1 }
  ]),
  updateEmployee
);

// Delete employee by _id (DELETE /api/employees/:id)
router.delete('/:id', deleteEmployee);

router.put('/remove-profile-picture/:userId', removeProfilePicture);


module.exports = router;
