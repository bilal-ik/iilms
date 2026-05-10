'use strict';

const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const { handleValidationErrors } = require('../middleware/validate');
const { createRules, replyRules } = require('../validators/complaint.validator');
const { submit, getMyComplaints, getAllComplaints, reply, resolve } = require('../controllers/complaint.controller');

const router = Router();

// POST /api/complaints — student only
router.post('/', verifyToken, requireRole('student'), createRules, handleValidationErrors, submit);

// GET /api/complaints/my — student only (before /:id)
router.get('/my', verifyToken, requireRole('student'), getMyComplaints);

// GET /api/complaints — admin only
router.get('/', verifyToken, requireRole('admin'), getAllComplaints);

// POST /api/complaints/:id/reply — admin only
router.post('/:id/reply', verifyToken, requireRole('admin'), replyRules, handleValidationErrors, reply);

// PATCH /api/complaints/:id/resolve — admin only
router.patch('/:id/resolve', verifyToken, requireRole('admin'), resolve);

module.exports = router;
