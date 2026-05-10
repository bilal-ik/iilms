'use strict';

const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleGuard');
const { handleValidationErrors } = require('../middleware/validate');
const { createRules } = require('../validators/internship.validator');
const {
  getAll,
  getById,
  create,
  update,
  remove,
  updateStatus,
  getMyInternships,
} = require('../controllers/internship.controller');

const router = Router();

// GET /api/internships — public
router.get('/', getAll);

// GET /api/internships/my — company only (must be before /:id)
router.get('/my', verifyToken, requireRole('company'), getMyInternships);

// GET /api/internships/:id — public
router.get('/:id', getById);

// POST /api/internships — company only
router.post('/', verifyToken, requireRole('company'), createRules, handleValidationErrors, create);

// PUT /api/internships/:id — company only
router.put('/:id', verifyToken, requireRole('company'), update);

// DELETE /api/internships/:id — company only
router.delete('/:id', verifyToken, requireRole('company'), remove);

// PATCH /api/internships/:id/status — company only
router.patch('/:id/status', verifyToken, requireRole('company'), updateStatus);

module.exports = router;
