'use strict';

const pool = require('../config/db');

async function getSummaryCounts() {
  const [[students]] = await pool.query(
    "SELECT COUNT(*) AS count FROM Users WHERE role = 'student'"
  );
  const [[companies]] = await pool.query(
    "SELECT COUNT(*) AS count FROM Users WHERE role = 'company'"
  );
  const [[openInternships]] = await pool.query(
    "SELECT COUNT(*) AS count FROM Internships WHERE status = 'open'"
  );
  const [[pendingApplications]] = await pool.query(
    "SELECT COUNT(*) AS count FROM Applications WHERE status = 'pending'"
  );
  const [[unresolvedComplaints]] = await pool.query(
    "SELECT COUNT(*) AS count FROM Complaints WHERE status = 'open'"
  );
  return {
    students: students.count,
    companies: companies.count,
    open_internships: openInternships.count,
    pending_applications: pendingApplications.count,
    unresolved_complaints: unresolvedComplaints.count,
  };
}

async function getApplicationsBreakdown() {
  const [rows] = await pool.query(
    `SELECT
       i.id,
       i.title,
       SUM(CASE WHEN a.status = 'pending'  THEN 1 ELSE 0 END) AS pending,
       SUM(CASE WHEN a.status = 'accepted' THEN 1 ELSE 0 END) AS accepted,
       SUM(CASE WHEN a.status = 'rejected' THEN 1 ELSE 0 END) AS rejected
     FROM Internships i
     LEFT JOIN Applications a ON i.id = a.internship_id
     GROUP BY i.id, i.title
     ORDER BY i.created_at DESC`
  );
  return rows;
}

async function getEvaluationStats() {
  const [rows] = await pool.query(
    `SELECT
       i.id,
       i.title,
       ROUND(AVG(e.score), 2) AS avg_score,
       COUNT(e.id) AS total_evaluations
     FROM Internships i
     LEFT JOIN Applications a ON i.id = a.internship_id
     LEFT JOIN Evaluations e ON a.id = e.application_id
     GROUP BY i.id, i.title
     ORDER BY i.created_at DESC`
  );
  return rows;
}

module.exports = { getSummaryCounts, getApplicationsBreakdown, getEvaluationStats };
