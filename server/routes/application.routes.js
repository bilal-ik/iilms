'use strict';

const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const {
  apply,
  getMyApplications,
  getByInternship,
  getAllApplications,
  updateStatus,
} = require('../controllers/application.controller');

const router = Router();

// POST /api/applications — student only
router.post('/', verifyToken, requireRole('student'), apply);

// GET /api/applications/my — student only (must be before /:id)
router.get('/my', verifyToken, requireRole('student'), getMyApplications);

// GET /api/applications — admin only
router.get('/', verifyToken, requireRole('admin'), getAllApplications);

// GET /api/applications/internship/:id — company only
router.get('/internship/:id', verifyToken, requireRole('company'), getByInternship);

// PATCH /api/applications/:id/status — company only
router.patch('/:id/status', verifyToken, requireRole('company'), updateStatus);

module.exports = router;
