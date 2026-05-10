'use strict';

const dashboardModel = require('../models/dashboard.model');

async function getSummary() {
  return dashboardModel.getSummaryCounts();
}

async function getApplicationsBreakdown() {
  return dashboardModel.getApplicationsBreakdown();
}

async function getEvaluationStats() {
  return dashboardModel.getEvaluationStats();
}

module.exports = { getSummary, getApplicationsBreakdown, getEvaluationStats };
