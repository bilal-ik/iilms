'use strict';

const { body } = require('express-validator');

const createRules = [
  body('application_id').notEmpty().isInt().withMessage('application_id must be an integer'),
  body('score').isInt({ min: 0, max: 100 }).withMessage('Score must be between 0 and 100'),
  body('feedback').optional(),
];

module.exports = { createRules };
