'use strict';

const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const { generate, getAllLetters, getByApplication } = require('../controllers/recommendation.controller');

const router = Router();

// POST /api/recommendations — admin only (idempotent generate)
router.post('/', verifyToken, requireRole('admin'), generate);

// GET /api/recommendations — admin only
router.get('/', verifyToken, requireRole('admin'), getAllLetters);

// GET /api/recommendations/:application_id — student only
router.get('/:application_id', verifyToken, requireRole('student'), getByApplication);

module.exports = router;
