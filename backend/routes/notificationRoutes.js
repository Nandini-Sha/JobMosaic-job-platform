const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create notification
router.post('/', notificationController.createNotification);

// Get notification by ID
router.get('/:id', notificationController.getNotification);

// Update notification by ID
router.put('/:id', notificationController.updateNotification);

// Delete notification by ID
router.delete('/:id', notificationController.deleteNotification);

// List notifications with optional filters
router.get('/', notificationController.listNotifications);

module.exports = router;
