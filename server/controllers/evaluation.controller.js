'use strict';

const evaluationService = require('../services/evaluation.service');

async function submit(req, res, next) {
  try {
    const { application_id, score, feedback } = req.body;
    const data = await evaluationService.submit({
      application_id,
      evaluator_id: req.user.id,
      score,
      feedback,
    });
    return res.status(201).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getMyEvaluations(req, res, next) {
  try {
    const data = await evaluationService.getMyEvaluations(req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

async function getAllEvaluations(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const data = await evaluationService.getAllEvaluations({ page: Number(page), limit: Number(limit) });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, message: err.message });
    next(err);
  }
}

module.exports = { submit, getMyEvaluations, getAllEvaluations };
