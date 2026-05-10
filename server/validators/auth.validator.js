'use strict';

const { body } = require('express-validator');

const registerRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'company', 'admin']).withMessage('Role must be student, company, or admin'),
  // full_name is optional at validation level — auth.service.js builds it from role-specific fields
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerRules, loginRules };
