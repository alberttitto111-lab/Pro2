const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Public route for contact form submissions
router.post('/', notificationController.createNotification);

// Protected routes (admin only)
router.get('/', notificationController.getAllNotifications);
router.get('/:id', notificationController.getNotificationById);
router.put('/:id/read', notificationController.markAsRead);
router.put('/:id/replied', notificationController.markAsReplied);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;