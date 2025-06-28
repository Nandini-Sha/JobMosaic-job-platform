// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Smart storage setup based on the field name
const storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    if (file.fieldname === 'resume') {
      cb(null, 'uploads/resumes');
    } else if (file.fieldname === 'profilepicture') {
      cb(null, 'uploads/profilepics');
    } else {
      cb(null, 'uploads/others');
    }
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;
