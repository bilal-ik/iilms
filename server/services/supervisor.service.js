'use strict';

const supervisorModel = require('../models/supervisor.model');
const applicationModel = require('../models/application.model');
const notificationService = require('./notification.service');

/**
 * Assign a supervisor to an accepted application.
 */
async function assign(application_id, supervisor_id) {
  const application = await applicationModel.findById(application_id);
  if (!application) {
    const err = new Error('Application not found');
    err.status = 404;
    throw err;
  }
  if (application.status !== 'accepted') {
    const err = new Error('Application must be accepted before assigning supervisor');
    err.status = 400;
    throw err;
  }
  const existing = await supervisorModel.findByApplicationId(application_id);
  if (existing) {
    const err = new Error('Supervisor already assigned');
    err.status = 409;
    throw err;
  }
  const assignment = await supervisorModel.create({ application_id, supervisor_id });
  await notificationService.createNotification(
    application.student_id,
    'A supervisor has been assigned to your internship application.'
  );
  return assignment;
}

/**
 * Get all students assigned to a supervisor.
 */
async function getMyStudents(supervisor_id) {
  return supervisorModel.findBySupervisorId(supervisor_id);
}

module.exports = { assign, getMyStudents };
