const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ✅ Create a new user
router.post('/', userController.createUser);

// ✅ Get all users
router.get('/', userController.getAllUsers);

// ✅ Get user by ID
router.get('/:id', userController.getUser);

// ✅ Update user by ID
router.put('/:id', userController.updateUser);

// ✅ Delete user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
