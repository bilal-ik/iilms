'use strict';

const internshipService = require('../services/internship.service');

async function getAll(req, res, next) {
  try {
    const data = await internshipService.getAll(req.query);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const data = await internshipService.getById(Number(req.params.id));
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = await internshipService.createInternship(req.user.id, req.body);
    return res.status(201).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = await internshipService.updateInternship(Number(req.params.id), req.user.id, req.body);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await internshipService.deleteInternship(Number(req.params.id), req.user.id);
    return res.status(200).json({ success: true, data: null });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const data = await internshipService.updateStatus(Number(req.params.id), req.user.id, req.body.status);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getMyInternships(req, res, next) {
  try {
    const data = await internshipService.getByCompany(req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove, updateStatus, getMyInternships };
