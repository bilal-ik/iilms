'use strict';

const pool = require('../config/db');

/**
 * Create a new internship.
 */
async function create({ company_id, title, description, skills_required, location, duration_weeks, deadline, status }) {
  const [result] = await pool.query(
    `INSERT INTO Internships (company_id, title, description, skills_required, location, duration_weeks, deadline, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [company_id, title, description, skills_required || null, location, duration_weeks, deadline, status || 'open']
  );
  const [rows] = await pool.query('SELECT * FROM Internships WHERE id = ?', [result.insertId]);
  return rows[0];
}

/**
 * Find an internship by id, including company name.
 */
async function findById(id) {
  const [rows] = await pool.query(
    `SELECT i.*, u.full_name AS company_name
     FROM Internships i
     JOIN Users u ON i.company_id = u.id
     WHERE i.id = ?`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Find all open internships with pagination.
 */
async function findAllOpen({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT i.*, u.full_name AS company_name
     FROM Internships i
     JOIN Users u ON i.company_id = u.id
     WHERE i.status = 'open'
     ORDER BY i.created_at DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}

/**
 * Find all internships for a specific company.
 */
async function findByCompany(company_id) {
  const [rows] = await pool.query(
    'SELECT * FROM Internships WHERE company_id = ? ORDER BY created_at DESC',
    [company_id]
  );
  return rows;
}

/**
 * Update an internship by id.
 */
async function update(id, data) {
  const fields = [];
  const values = [];

  const allowed = ['title', 'description', 'skills_required', 'location', 'duration_weeks', 'deadline', 'status'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  await pool.query(`UPDATE Internships SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
}

/**
 * Delete an internship by id.
 */
async function deleteById(id) {
  await pool.query('DELETE FROM Internships WHERE id = ?', [id]);
}

/**
 * Update the status of an internship.
 */
async function updateStatus(id, status) {
  await pool.query('UPDATE Internships SET status = ? WHERE id = ?', [status, id]);
  return findById(id);
}

module.exports = { create, findById, findAllOpen, findByCompany, update, deleteById, updateStatus };
