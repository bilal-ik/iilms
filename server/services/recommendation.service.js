'use strict';

const recommendationModel = require('../models/recommendation.model');
const evaluationModel = require('../models/evaluation.model');
const applicationModel = require('../models/application.model');

/**
 * Generate (or return existing) recommendation letter for an application.
 * Idempotent — returns existing record if one already exists.
 */
async function generate(application_id) {
  // Return existing letter if already generated
  const existing = await recommendationModel.findByApplicationId(application_id);
  if (existing) {
    return { letter: existing, created: false };
  }

  // Require at least one evaluation
  const evaluations = await evaluationModel.findByApplicationId(application_id);
  if (!evaluations || evaluations.length === 0) {
    const err = new Error('No evaluation found for this application');
    err.status = 400;
    throw err;
  }

  // Get application details for letter content
  const application = await applicationModel.findById(application_id);
  if (!application) {
    const err = new Error('Application not found');
    err.status = 404;
    throw err;
  }

  const content =
    `This letter is to formally recommend ${application.student_name || 'the student'} ` +
    `for their internship "${application.internship_title || 'the internship'}". ` +
    `They demonstrated professionalism, dedication, and strong performance throughout the placement. ` +
    `We highly recommend them for future opportunities.`;

  const letter = await recommendationModel.create({ application_id, content });
  return { letter, created: true };
}

async function getAllLetters({ page = 1, limit = 20 } = {}) {
  return recommendationModel.findAll({ page, limit });
}

async function getByApplication(application_id, student_id) {
  const application = await applicationModel.findById(application_id);
  if (!application) {
    const err = new Error('Application not found');
    err.status = 404;
    throw err;
  }
  if (application.student_id !== student_id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  const letter = await recommendationModel.findByApplicationId(application_id);
  if (!letter) {
    const err = new Error('Recommendation letter not found');
    err.status = 404;
    throw err;
  }
  return letter;
}

module.exports = { generate, getAllLetters, getByApplication };
