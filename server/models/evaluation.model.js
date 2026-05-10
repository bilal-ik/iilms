'use strict';

const pool = require('../config/db');

/**
 * Create a new evaluation.
 */
async function create({ application_id, evaluator_id, score, feedback }) {
  const [result] = await pool.query(
    'INSERT INTO Evaluations (application_id, evaluator_id, score, feedback) VALUES (?, ?, ?, ?)',
    [application_id, evaluator_id, score, feedback || null]
  );
  const [rows] = await pool.query('SELECT * FROM Evaluations WHERE id = ?', [result.insertId]);
  return rows[0];
}

/**
 * Find all evaluations for an application.
 */
async function findByApplicationId(application_id) {
  const [rows] = await pool.query(
    'SELECT * FROM Evaluations WHERE application_id = ?',
    [application_id]
  );
  return rows;
}

/**
 * Find all evaluations (paginated) with student name and internship title.
 */
async function findAll({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT e.*, u.full_name AS student_name, i.title AS internship_title
     FROM Evaluations e
     JOIN Applications a ON e.application_id = a.id
     JOIN Users u ON a.student_id = u.id
     JOIN Internships i ON a.internship_id = i.id
     ORDER BY e.evaluated_at DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}

/**
 * Find all evaluations for a student's applications.
 */
async function findByStudentApplications(student_id) {
  const [rows] = await pool.query(
    `SELECT e.*
     FROM Evaluations e
     JOIN Applications a ON e.application_id = a.id
     WHERE a.student_id = ?
     ORDER BY e.evaluated_at DESC`,
    [student_id]
  );
  return rows;
}

/**
 * Check for a duplicate evaluation.
 */
async function findDuplicate(application_id, evaluator_id) {
  const [rows] = await pool.query(
    'SELECT id FROM Evaluations WHERE application_id = ? AND evaluator_id = ?',
    [application_id, evaluator_id]
  );
  return rows[0] || null;
}

module.exports = { create, findByApplicationId, findAll, findByStudentApplications, findDuplicate };
