'use strict';

const internshipModel = require('../models/internship.model');

/**
 * Create a new internship for a company.
 */
async function createInternship(company_id, data) {
  return internshipModel.create({ ...data, company_id, status: 'open' });
}

/**
 * Get all open internships (paginated).
 */
async function getAll(query) {
  const { page = 1, limit = 20 } = query || {};
  return internshipModel.findAllOpen({ page: Number(page), limit: Number(limit) });
}

/**
 * Get a single internship by id.
 */
async function getById(id) {
  const internship = await internshipModel.findById(id);
  if (!internship) {
    const err = new Error('Internship not found');
    err.status = 404;
    throw err;
  }
  return internship;
}

/**
 * Update an internship (company must own it).
 */
async function updateInternship(id, company_id, data) {
  const internship = await internshipModel.findById(id);
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
  return internshipModel.update(id, data);
}

/**
 * Delete an internship (company must own it).
 */
async function deleteInternship(id, company_id) {
  const internship = await internshipModel.findById(id);
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
  return internshipModel.deleteById(id);
}

/**
 * Update the status of an internship (company must own it).
 */
async function updateStatus(id, company_id, status) {
  const internship = await internshipModel.findById(id);
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
  return internshipModel.updateStatus(id, status);
}

/**
 * Get all internships for a company.
 */
async function getByCompany(company_id) {
  return internshipModel.findByCompany(company_id);
}

module.exports = { createInternship, getAll, getById, updateInternship, deleteInternship, updateStatus, getByCompany };
