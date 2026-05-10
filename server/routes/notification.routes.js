'use strict';

const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { getUnread, markRead, markAllRead } = require('../controllers/notification.controller');

const router = Router();

// GET /api/notifications — any authenticated user
router.get('/', verifyToken, getUnread);

// PATCH /api/notifications/read-all — must be before /:id/read
router.patch('/read-all', verifyToken, markAllRead);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', verifyToken, markRead);

module.exports = router;
