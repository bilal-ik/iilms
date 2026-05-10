'use strict';

const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const { handleValidationErrors } = require('../middleware/validate');
const { createRules } = require('../validators/evaluation.validator');
const { submit, getMyEvaluations, getAllEvaluations } = require('../controllers/evaluation.controller');

const router = Router();

// POST /api/evaluations — admin or company
router.post('/', verifyToken, requireRole('admin', 'company'), createRules, handleValidationErrors, submit);

// GET /api/evaluations/my — student only (must be before /)
router.get('/my', verifyToken, requireRole('student'), getMyEvaluations);

// GET /api/evaluations — admin only
router.get('/', verifyToken, requireRole('admin'), getAllEvaluations);

module.exports = router;
