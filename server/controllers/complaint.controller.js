'use strict';

const complaintService = require('../services/complaint.service');

async function submit(req, res, next) {
  try {
    const { subject, message } = req.body;
    const data = await complaintService.submit({ student_id: req.user.id, subject, message });
    return res.status(201).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getMyComplaints(req, res, next) {
  try {
    const data = await complaintService.getMyComplaints(req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getAllComplaints(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const data = await complaintService.getAllComplaints({ page: Number(page), limit: Number(limit) });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function reply(req, res, next) {
  try {
    const { message } = req.body;
    const data = await complaintService.reply(Number(req.params.id), req.user.id, message);
    return res.status(201).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function resolve(req, res, next) {
  try {
    const data = await complaintService.resolve(Number(req.params.id));
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

module.exports = { submit, getMyComplaints, getAllComplaints, reply, resolve };
