'use strict';

const notificationService = require('../services/notification.service');

async function getUnread(req, res, next) {
  try {
    const data = await notificationService.getUnread(req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    const data = await notificationService.markRead(Number(req.params.id), req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function markAllRead(req, res, next) {
  try {
    await notificationService.markAllRead(req.user.id);
    return res.status(200).json({ success: true, data: { message: 'All notifications marked as read' } });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

module.exports = { getUnread, markRead, markAllRead };
