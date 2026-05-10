'use strict';

const pool = require('../config/db');

/**
 * Create a supervisor assignment.
 */
async function create({ application_id, supervisor_id }) {
  const [result] = await pool.query(
    'INSERT INTO SupervisorAssignments (application_id, supervisor_id) VALUES (?, ?)',
    [application_id, supervisor_id]
  );
  const [rows] = await pool.query('SELECT * FROM SupervisorAssignments WHERE id = ?', [result.insertId]);
  return rows[0];
}

/**
 * Find a supervisor assignment by application id.
 */
async function findByApplicationId(application_id) {
  const [rows] = await pool.query(
    'SELECT * FROM SupervisorAssignments WHERE application_id = ?',
    [application_id]
  );
  return rows[0] || null;
}

/**
 * Find all assignments for a supervisor, with student name and internship title.
 */
async function findBySupervisorId(supervisor_id) {
  const [rows] = await pool.query(
    `SELECT sa.*, u.full_name AS student_name, i.title AS internship_title
     FROM SupervisorAssignments sa
     JOIN Applications a ON sa.application_id = a.id
     JOIN Users u ON a.student_id = u.id
     JOIN Internships i ON a.internship_id = i.id
     WHERE sa.supervisor_id = ?`,
    [supervisor_id]
  );
  return rows;
}

module.exports = { create, findByApplicationId, findBySupervisorId };
