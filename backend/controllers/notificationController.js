const Notification = require('../models/Notification');

// Create a notification
exports.createNotification = async (req, res) => {
  try {
    const { user, userModel, message, type } = req.body;

    if (!user || !message || !type || !userModel) {
      return res.status(400).json({ message: 'User, message, and type are required' });
    }

    const notification = new Notification({
      user,
      message,
      type,
      userModel,
      read: false,
    });

    await notification.save();
    res.status(201).json({ notification });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get notification by ID
exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update notification (e.g., mark as read)
exports.updateNotification = async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(updatedNotification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// List notifications with optional filters (e.g., by user, unread only)
exports.listNotifications = async (req, res) => {
  try {
    const { user, unreadOnly } = req.query;
    const query = {};

    if (user) query.user = user;
    if (unreadOnly === 'true') query.read = false;

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
