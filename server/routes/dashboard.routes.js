'use strict';

const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const { summary, applicationsBreakdown, evaluationStats } = require('../controllers/dashboard.controller');

const router = Router();

// GET /api/dashboard/summary — admin only
router.get('/summary', verifyToken, requireRole('admin'), summary);

// GET /api/dashboard/applications-breakdown — admin only
router.get('/applications-breakdown', verifyToken, requireRole('admin'), applicationsBreakdown);

// GET /api/dashboard/evaluation-stats — admin only
router.get('/evaluation-stats', verifyToken, requireRole('admin'), evaluationStats);

module.exports = router;
