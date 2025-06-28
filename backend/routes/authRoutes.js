const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Route for registering user
router.post('/register', registerUser);

// Route for logging in user
router.post('/login', loginUser);

// (Optional) Route for logout / get user / token validation etc.
// router.get('/logout', logoutUser);
// router.get('/me', getCurrentUser);

module.exports = router;
