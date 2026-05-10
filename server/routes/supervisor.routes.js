'use strict';

const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const { assign, getMyStudents } = require('../controllers/supervisor.controller');

const router = Router();

// POST /api/supervisors/assign — admin only
router.post('/assign', verifyToken, requireRole('admin'), assign);

// GET /api/supervisors/my-students — admin only
router.get('/my-students', verifyToken, requireRole('admin'), getMyStudents);

module.exports = router;
