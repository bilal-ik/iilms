'use strict';

const { Router } = require('express');
const { registerRules, loginRules } = require('../validators/auth.validator');
const { handleValidationErrors } = require('../middleware/validate');
const { register, login } = require('../controllers/auth.controller');
const { verifyEmail } = require('../controllers/auth.controller');

const router = Router();

router.post('/register', registerRules, handleValidationErrors, register);
router.post('/login', loginRules, handleValidationErrors, login);
router.get('/verify-email', verifyEmail);

module.exports = router;
