'use strict';

const evaluationModel = require('../models/evaluation.model');

/**
 * Submit an evaluation.
 */
async function submit({ application_id, evaluator_id, score, feedback }) {
  const duplicate = await evaluationModel.findDuplicate(application_id, evaluator_id);
  if (duplicate) {
    const err = new Error('Evaluation already submitted');
    err.status = 409;
    throw err;
  }
  return evaluationModel.create({ application_id, evaluator_id, score, feedback });
}

/**
 * Get all evaluations for a student's applications.
 */
async function getMyEvaluations(student_id) {
  return evaluationModel.findByStudentApplications(student_id);
}

/**
 * Get all evaluations (admin, paginated).
 */
async function getAllEvaluations({ page, limit }) {
  return evaluationModel.findAll({ page, limit });
}

module.exports = { submit, getMyEvaluations, getAllEvaluations };
