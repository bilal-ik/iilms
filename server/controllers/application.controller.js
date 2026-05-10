'use strict';

const applicationService = require('../services/application.service');

async function apply(req, res, next) {
  try {
    const data = await applicationService.apply(req.user.id, req.body.internship_id);
    return res.status(201).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getMyApplications(req, res, next) {
  try {
    const data = await applicationService.getMyApplications(req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getByInternship(req, res, next) {
  try {
    const data = await applicationService.getByInternship(Number(req.params.id), req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getAllApplications(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const data = await applicationService.getAllApplications({ page: Number(page), limit: Number(limit) });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const data = await applicationService.updateStatus(Number(req.params.id), req.body.status, req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

module.exports = { apply, getMyApplications, getByInternship, getAllApplications, updateStatus };
