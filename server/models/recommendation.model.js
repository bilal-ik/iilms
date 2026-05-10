'use strict';

const pool = require('../config/db');

/**
 * Find a recommendation letter by application id.
 */
async function findByApplicationId(application_id) {
  const [rows] = await pool.query(
    'SELECT * FROM RecommendationLetters WHERE application_id = ?',
    [application_id]
  );
  return rows[0] || null;
}

/**
 * Create a new recommendation letter.
 */
async function create({ application_id, content }) {
  const [result] = await pool.query(
    'INSERT INTO RecommendationLetters (application_id, content) VALUES (?, ?)',
    [application_id, content]
  );
  const [rows] = await pool.query('SELECT * FROM RecommendationLetters WHERE id = ?', [result.insertId]);
  return rows[0];
}

/**
 * Find all recommendation letters (paginated) with student name and internship title.
 */
async function findAll({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT rl.*, u.full_name AS student_name, i.title AS internship_title
     FROM RecommendationLetters rl
     JOIN Applications a ON rl.application_id = a.id
     JOIN Users u ON a.student_id = u.id
     JOIN Internships i ON a.internship_id = i.id
     ORDER BY rl.generated_at DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}

module.exports = { findByApplicationId, create, findAll };
