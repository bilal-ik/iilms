'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userModel = require('../models/user.model');
const { sendVerificationEmail, sendWelcomeEmail } = require('./email.service');

async function register(body) {
  const { email, password, role } = body;

  // Check duplicate
  const existing = await userModel.findByEmail(email);
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  // Hash password
  const costFactor = parseInt(process.env.BCRYPT_COST_FACTOR) || 10;
  const password_hash = await bcrypt.hash(password, costFactor);

  // Generate email verification token
  const verify_token = crypto.randomBytes(32).toString('hex');

  // Determine full_name from role-specific fields
  let full_name = body.full_name || '';
  if (role === 'student') {
    full_name = `${body.first_name || ''} ${body.last_name || ''}`.trim() || body.full_name || '';
  } else if (role === 'company') {
    full_name = body.company_name || body.full_name || '';
  } else if (role === 'admin') {
    full_name = body.first_name || body.full_name || '';
  }

  // Create base user
  const user = await userModel.createUser({
    email,
    password_hash,
    full_name,
    role,
    phone: body.phone || null,
    address: body.address || null,
    verify_token,
  });

  // Create role-specific profile
  if (role === 'student') {
    await userModel.createStudentProfile(user.id, {
      first_name: body.first_name || '',
      last_name: body.last_name || '',
      university_id: body.university_id || null,
      university: body.university || null,
      sex: body.sex || null,
      date_of_birth: body.date_of_birth || null,
      gpa: body.gpa || null,
      skills: body.skills || null,
      linkedin_url: body.linkedin_url || null,
    });
  } else if (role === 'company') {
    await userModel.createCompanyProfile(user.id, {
      company_name: body.company_name || full_name,
      industry: body.industry || null,
      company_size: body.company_size || null,
      website: body.website || null,
      contact_person: body.contact_person || null,
      contact_email: body.contact_email || email,
      contact_phone: body.contact_phone || body.phone || null,
      company_address: body.company_address || body.address || null,
      description: body.description || null,
    });
  } else if (role === 'admin') {
    await userModel.createAdminProfile(user.id, {
      department: body.department || null,
      university: body.university || null,
      staff_id: body.staff_id || null,
    });
  }

  // Send verification email
  await sendVerificationEmail(email, verify_token, full_name);

  return { id: user.id, email: user.email, role: user.role, full_name: user.full_name };
}

async function verifyEmail(token) {
  const user = await userModel.verifyEmail(token);
  if (!user) {
    const err = new Error('Invalid or expired verification token');
    err.status = 400;
    throw err;
  }
  // Send welcome email
  await sendWelcomeEmail(user.email, user.full_name, user.role);
  return { message: 'Email verified successfully' };
}

async function login({ email, password }) {
  const user = await userModel.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  // Warn if not verified (but still allow login for dev convenience)
  // In production: uncomment the block below to enforce verification
  // if (!user.is_verified) {
  //   const err = new Error('Please verify your email before logging in');
  //   err.status = 403;
  //   throw err;
  // }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      is_verified: user.is_verified,
    },
  };
}

module.exports = { register, verifyEmail, login };
