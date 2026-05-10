'use strict';

const pool = require('../config/db');

async function create({ student_id, subject }) {
  const [result] = await pool.query(
    "INSERT INTO Complaints (student_id, subject, status) VALUES (?, ?, 'open')",
    [student_id, subject]
  );
  const [rows] = await pool.query('SELECT * FROM Complaints WHERE id = ?', [result.insertId]);
  return rows[0];
}

async function createMessage({ complaint_id, sender_id, message }) {
  const [result] = await pool.query(
    'INSERT INTO ComplaintMessages (complaint_id, sender_id, message) VALUES (?, ?, ?)',
    [complaint_id, sender_id, message]
  );
  const [rows] = await pool.query('SELECT * FROM ComplaintMessages WHERE id = ?', [result.insertId]);
  return rows[0];
}

async function findByStudentId(student_id) {
  const [complaints] = await pool.query(
    'SELECT * FROM Complaints WHERE student_id = ? ORDER BY created_at DESC',
    [student_id]
  );
  // Attach messages to each complaint
  for (const complaint of complaints) {
    const [messages] = await pool.query(
      'SELECT * FROM ComplaintMessages WHERE complaint_id = ? ORDER BY sent_at ASC',
      [complaint.id]
    );
    complaint.messages = messages;
  }
  return complaints;
}

async function findAll({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT c.*, u.full_name AS student_name
     FROM Complaints c
     JOIN Users u ON c.student_id = u.id
     ORDER BY c.created_at DESC
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(offset)]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM Complaints WHERE id = ?', [id]);
  return rows[0] || null;
}

async function updateStatus(id, status) {
  await pool.query('UPDATE Complaints SET status = ? WHERE id = ?', [status, id]);
  const [rows] = await pool.query('SELECT * FROM Complaints WHERE id = ?', [id]);
  return rows[0];
}

async function countMessages(complaint_id) {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS count FROM ComplaintMessages WHERE complaint_id = ?',
    [complaint_id]
  );
  return rows[0].count;
}

module.exports = { create, createMessage, findByStudentId, findAll, findById, updateStatus, countMessages };
