'use strict';

const { body } = require('express-validator');

const createRules = [
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
];

const replyRules = [
  body('message').notEmpty().withMessage('Message is required'),
];

module.exports = { createRules, replyRules };
