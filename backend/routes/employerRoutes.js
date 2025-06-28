const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  createOrUpdateEmployer,
  getEmployer,
  getEmployerByUserId,
  getAllEmployers,
  updateEmployer,
  deleteEmployer
} = require('../controllers/employerController');

// Ensure upload folders exist
const ensureFoldersExist = () => {
  const folders = ['uploads/companyLogos', 'uploads/others'];
  folders.forEach(folder => {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  });
};
ensureFoldersExist();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'companyLOGO') cb(null, 'uploads/companyLogos/');
    else cb(null, 'uploads/others/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// ================= Routes ================= //

// ✅ Create or update employer (with optional logo)
router.post(
  '/',
  upload.single('companyLOGO'),
  createOrUpdateEmployer
);

// ✅ Get all employers
router.get('/', getAllEmployers);

// ✅ Get employer by userId (e.g. for linking frontend login user → employer)
router.get('/by-user/:userId', getEmployerByUserId);

// ✅ Get employer by Mongo _id
// Note: This should come after /by-user/:userId
router.get('/:id', getEmployer);

// ✅ Update employer
router.put(
  '/:id',
  upload.single('companyLOGO'),
  updateEmployer
);

// ✅ Delete employer
router.delete('/:id', deleteEmployer);



module.exports = router;
