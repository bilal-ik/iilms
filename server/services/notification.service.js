'use strict';

const notificationModel = require('../models/notification.model');

/**
 * Create a notification for a user.
 */
async function createNotification(user_id, message) {
  return notificationModel.create({ user_id, message });
}

/**
 * Get all unread notifications for a user.
 */
async function getUnread(user_id) {
  return notificationModel.findUnreadByUserId(user_id);
}

/**
 * Mark a single notification as read (verifies ownership).
 */
async function markRead(id, requesting_user_id) {
  const notification = await notificationModel.findById(id);
  if (!notification) {
    const err = new Error('Notification not found');
    err.status = 404;
    throw err;
  }
  if (notification.user_id !== requesting_user_id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return notificationModel.markAsRead(id);
}

/**
 * Mark all notifications for a user as read.
 */
async function markAllRead(user_id) {
  return notificationModel.markAllAsRead(user_id);
}

module.exports = { createNotification, getUnread, markRead, markAllRead };
