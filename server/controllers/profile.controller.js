'use strict';

const userModel = require('../models/user.model');

/** GET /api/profile/me — get own full profile */
async function getMyProfile(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);
    let profile = null;
    if (req.user.role === 'student')  profile = await userModel.getStudentProfile(req.user.id);
    if (req.user.role === 'company')  profile = await userModel.getCompanyProfile(req.user.id);
    if (req.user.role === 'admin')    profile = await userModel.getAdminProfile(req.user.id);
    return res.json({ success: true, data: { ...user, profile } });
  } catch (err) { next(err); }
}

/** PUT /api/profile/me — update own profile */
async function updateMyProfile(req, res, next) {
  try {
    const user = await userModel.updateUser(req.user.id, req.body);
    let profile = null;
    if (req.user.role === 'student')  profile = await userModel.updateStudentProfile(req.user.id, req.body);
    if (req.user.role === 'company')  profile = await userModel.updateCompanyProfile(req.user.id, req.body);
    return res.json({ success: true, data: { ...user, profile } });
  } catch (err) { next(err); }
}

/** GET /api/profile/:id — view any user's public profile */
async function getPublicProfile(req, res, next) {
  try {
    const user = await userModel.findById(Number(req.params.id));
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    let profile = null;
    if (user.role === 'student')  profile = await userModel.getStudentProfile(user.id);
    if (user.role === 'company')  profile = await userModel.getCompanyProfile(user.id);
    if (user.role === 'admin')    profile = await userModel.getAdminProfile(user.id);
    // Remove sensitive fields for public view
    const { ...safeUser } = user;
    return res.json({ success: true, data: { ...safeUser, profile } });
  } catch (err) { next(err); }
}

module.exports = { getMyProfile, updateMyProfile, getPublicProfile };
