'use strict';

const authService = require('../services/auth.service');
const { sendWelcomeEmail } = require('../services/email.service');
const userModel = require('../models/user.model');

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      data: user,
      message: 'Account created! Check your email (or server console in dev) for the verification link.',
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: 'Token is required' });
    const user = await authService.verifyEmail(token);
    // Send welcome email after successful verification
    if (user) {
      const dbUser = await userModel.findByEmail(user.email);
      sendWelcomeEmail(user.email, dbUser?.full_name || 'there').catch(() => {});
    }
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/email-verified`);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

module.exports = { register, verifyEmail, login };
