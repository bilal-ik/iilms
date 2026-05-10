'use strict';

const dashboardService = require('../services/dashboard.service');

async function summary(req, res, next) {
  try {
    const data = await dashboardService.getSummary();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function applicationsBreakdown(req, res, next) {
  try {
    const data = await dashboardService.getApplicationsBreakdown();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function evaluationStats(req, res, next) {
  try {
    const data = await dashboardService.getEvaluationStats();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = { summary, applicationsBreakdown, evaluationStats };
