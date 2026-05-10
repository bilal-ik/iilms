'use strict';

const recommendationService = require('../services/recommendation.service');

async function generate(req, res, next) {
  try {
    const { application_id } = req.body;
    const { letter, created } = await recommendationService.generate(application_id);
    return res.status(created ? 201 : 200).json({ success: true, data: letter });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getAllLetters(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const data = await recommendationService.getAllLetters({ page: Number(page), limit: Number(limit) });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getByApplication(req, res, next) {
  try {
    const data = await recommendationService.getByApplication(
      Number(req.params.application_id),
      req.user.id
    );
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

module.exports = { generate, getAllLetters, getByApplication };
