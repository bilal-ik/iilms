'use strict';

const pool = require('../config/db');

/**
 * Create a new application with status='pending'.
 */
async function create({ student_id, internship_id }) {
  const [result] = await pool.query(
    `INSERT INTO Applications (student_id, internship_id, status) VALUES (?, ?, 'pending')`,
    [student_id, internship_id]
  );
  const [rows] = await pool.query('SELECT * FROM Applications WHERE id = ?', [result.insertId]);
  return rows[0];
}

/**
 * Find all applications for a student, with internship title and company name.
 */
async function findByStudentId(student_id) {
  const [rows] = await pool.query(
    `SELECT a.*, i.title AS internship_title, u.full_name AS company_name
     FROM Applications a
     JOIN Internships i ON a.internship_id = i.id
     JOIN Users u ON i.company_id = u.id
     WHERE a.student_id = ?
     ORDER BY a.applied_at DESC`,
    [student_id]
  );
  return rows;
}

/**
 * Find all applications for an internship, with student name.
 */
async function findByInternshipId(internship_id) {
  const [rows] = await pool.query(
    `SELECT a.*, u.full_name AS student_name
     FROM Applications a
     JOIN Users u ON a.student_id = u.id
     WHERE a.internship_id = ?
     ORDER BY a.applied_at DESC`,
    [internship_id]
  );
  return rows;
}

/**
 * Find all applications (paginated) with student name and internship title.
 */
async function findAll({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT a.*, u.full_name AS student_name, i.title AS internship_title
     FROM Applications a
     JOIN Users u ON a.student_id = u.id
     JOIN Internships i ON a.internship_id = i.id
     ORDER BY a.applied_at DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}

/**
 * Find an application by id.
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM Applications WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Update the status of an application.
 */
async function updateStatus(id, status) {
  await pool.query('UPDATE Applications SET status = ? WHERE id = ?', [status, id]);
  const [rows] = await pool.query('SELECT * FROM Applications WHERE id = ?', [id]);
  return rows[0];
}

/**
 * Check for a duplicate application.
 */
async function findDuplicate(student_id, internship_id) {
  const [rows] = await pool.query(
    'SELECT id FROM Applications WHERE student_id = ? AND internship_id = ?',
    [student_id, internship_id]
  );
  return rows[0] || null;
}

module.exports = { create, findByStudentId, findByInternshipId, findAll, findById, updateStatus, findDuplicate };
