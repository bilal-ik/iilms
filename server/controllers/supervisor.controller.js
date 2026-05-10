'use strict';

const supervisorService = require('../services/supervisor.service');

async function assign(req, res, next) {
  try {
    const { application_id, supervisor_id } = req.body;
    const data = await supervisorService.assign(application_id, supervisor_id);
    return res.status(201).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getMyStudents(req, res, next) {
  try {
    const data = await supervisorService.getMyStudents(req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

module.exports = { assign, getMyStudents };
