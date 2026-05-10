'use strict';

const pool = require('../config/db');

/**
 * Create a new notification.
 */
async function create({ user_id, message }) {
  const [result] = await pool.query(
    'INSERT INTO Notifications (user_id, message) VALUES (?, ?)',
    [user_id, message]
  );
  const [rows] = await pool.query('SELECT * FROM Notifications WHERE id = ?', [result.insertId]);
  return rows[0];
}

/**
 * Find all unread notifications for a user, newest first.
 */
async function findUnreadByUserId(user_id) {
  const [rows] = await pool.query(
    'SELECT * FROM Notifications WHERE user_id = ? AND is_read = false ORDER BY created_at DESC',
    [user_id]
  );
  return rows;
}

/**
 * Mark a single notification as read.
 */
async function markAsRead(id) {
  await pool.query('UPDATE Notifications SET is_read = true WHERE id = ?', [id]);
  const [rows] = await pool.query('SELECT * FROM Notifications WHERE id = ?', [id]);
  return rows[0];
}

/**
 * Mark all notifications for a user as read.
 */
async function markAllAsRead(user_id) {
  await pool.query('UPDATE Notifications SET is_read = true WHERE user_id = ?', [user_id]);
}

/**
 * Find a notification by id.
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM Notifications WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = { create, findUnreadByUserId, markAsRead, markAllAsRead, findById };
