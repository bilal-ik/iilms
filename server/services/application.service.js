'use strict';

const applicationModel = require('../models/application.model');
const internshipModel = require('../models/internship.model');
const notificationService = require('./notification.service');

/**
 * Apply to an internship.
 */
async function apply(student_id, internship_id) {
  const internship = await internshipModel.findById(internship_id);
  if (!internship) {
    const err = new Error('Internship not found');
    err.status = 404;
    throw err;
  }
  if (internship.status === 'closed') {
    const err = new Error('Internship is closed');
    err.status = 400;
    throw err;
  }
  const duplicate = await applicationModel.findDuplicate(student_id, internship_id);
  if (duplicate) {
    const err = new Error('Already applied');
    err.status = 409;
    throw err;
  }
  return applicationModel.create({ student_id, internship_id });
}

/**
 * Get all applications for a student.
 */
async function getMyApplications(student_id) {
  return applicationModel.findByStudentId(student_id);
}

/**
 * Get all applications for an internship (company must own it).
 */
async function getByInternship(internship_id, company_id) {
  const internship = await internshipModel.findById(internship_id);
  if (!internship) {
    const err = new Error('Internship not found');
    err.status = 404;
    throw err;
  }
  if (internship.company_id !== company_id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return applicationModel.findByInternshipId(internship_id);
}

/**
 * Get all applications (admin, paginated).
 */
async function getAllApplications({ page, limit }) {
  return applicationModel.findAll({ page, limit });
}

/**
 * Update the status of an application (company must own the internship).
 */
async function updateStatus(id, status, company_id) {
  const application = await applicationModel.findById(id);
  if (!application) {
    const err = new Error('Application not found');
    err.status = 404;
    throw err;
  }
  const internship = await internshipModel.findById(application.internship_id);
  if (!internship || internship.company_id !== company_id) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  const updated = await applicationModel.updateStatus(id, status);
  if (status === 'accepted' || status === 'rejected') {
    const message = `Your application for "${internship.title}" has been ${status}.`;
    await notificationService.createNotification(application.student_id, message);
  }
  return updated;
}

module.exports = { apply, getMyApplications, getByInternship, getAllApplications, updateStatus };
