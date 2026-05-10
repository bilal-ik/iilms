'use strict';

const { body } = require('express-validator');

const createRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('duration_weeks').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('deadline').isISO8601().withMessage('Deadline must be a valid ISO 8601 date'),
];

module.exports = { createRules };
