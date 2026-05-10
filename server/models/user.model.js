'use strict';

const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, email, role, full_name, phone, address, bio, photo_url, is_verified, created_at FROM Users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function createUser({ email, password_hash, full_name, role, phone, address, verify_token }) {
  const [result] = await pool.query(
    'INSERT INTO Users (email, password_hash, full_name, role, phone, address, verify_token, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)',
    [email, password_hash, full_name, role, phone || null, address || null, verify_token || null]
  );
  return { id: result.insertId, email, full_name, role };
}

async function updateUser(id, data) {
  const allowed = ['full_name', 'phone', 'address', 'bio', 'photo_url'];
  const fields = [];
  const values = [];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (!fields.length) return findById(id);
  values.push(id);
  await pool.query(`UPDATE Users SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
}

async function verifyEmail(token) {
  const [rows] = await pool.query('SELECT * FROM Users WHERE verify_token = ?', [token]);
  if (!rows[0]) return null;
  await pool.query('UPDATE Users SET is_verified = TRUE, verify_token = NULL WHERE id = ?', [rows[0].id]);
  return rows[0];
}

// ── Student profile ──────────────────────────────────────────────────────────
async function createStudentProfile(user_id, data) {
  const { first_name, last_name, university_id, university, sex, date_of_birth, gpa, skills, linkedin_url } = data;
  await pool.query(
    `INSERT INTO StudentProfiles (user_id, first_name, last_name, university_id, university, sex, date_of_birth, gpa, skills, linkedin_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       first_name=VALUES(first_name), last_name=VALUES(last_name),
       university_id=VALUES(university_id), university=VALUES(university),
       sex=VALUES(sex), date_of_birth=VALUES(date_of_birth),
       gpa=VALUES(gpa), skills=VALUES(skills), linkedin_url=VALUES(linkedin_url)`,
    [user_id, first_name, last_name, university_id || null, university || null,
     sex || null, date_of_birth || null, gpa || null, skills || null, linkedin_url || null]
  );
}

async function getStudentProfile(user_id) {
  const [rows] = await pool.query('SELECT * FROM StudentProfiles WHERE user_id = ?', [user_id]);
  return rows[0] || null;
}

async function updateStudentProfile(user_id, data) {
  const allowed = ['first_name','last_name','university_id','university','sex','date_of_birth','gpa','skills','linkedin_url','testimonial'];
  const fields = [];
  const values = [];
  for (const key of allowed) {
    if (data[key] !== undefined) { fields.push(`${key} = ?`); values.push(data[key]); }
  }
  if (!fields.length) return getStudentProfile(user_id);
  values.push(user_id);
  await pool.query(`UPDATE StudentProfiles SET ${fields.join(', ')} WHERE user_id = ?`, values);
  return getStudentProfile(user_id);
}

// ── Company profile ──────────────────────────────────────────────────────────
async function createCompanyProfile(user_id, data) {
  const { company_name, industry, company_size, website, contact_person, contact_email, contact_phone, company_address, description } = data;
  await pool.query(
    `INSERT INTO CompanyProfiles (user_id, company_name, industry, company_size, website, contact_person, contact_email, contact_phone, company_address, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       company_name=VALUES(company_name), industry=VALUES(industry),
       company_size=VALUES(company_size), website=VALUES(website),
       contact_person=VALUES(contact_person), contact_email=VALUES(contact_email),
       contact_phone=VALUES(contact_phone), company_address=VALUES(company_address),
       description=VALUES(description)`,
    [user_id, company_name, industry || null, company_size || null, website || null,
     contact_person || null, contact_email || null, contact_phone || null, company_address || null, description || null]
  );
}

async function getCompanyProfile(user_id) {
  const [rows] = await pool.query('SELECT * FROM CompanyProfiles WHERE user_id = ?', [user_id]);
  return rows[0] || null;
}

async function updateCompanyProfile(user_id, data) {
  const allowed = ['company_name','industry','company_size','website','contact_person','contact_email','contact_phone','company_address','description','testimonial'];
  const fields = [];
  const values = [];
  for (const key of allowed) {
    if (data[key] !== undefined) { fields.push(`${key} = ?`); values.push(data[key]); }
  }
  if (!fields.length) return getCompanyProfile(user_id);
  values.push(user_id);
  await pool.query(`UPDATE CompanyProfiles SET ${fields.join(', ')} WHERE user_id = ?`, values);
  return getCompanyProfile(user_id);
}

// ── Admin profile ─────────────────────────────────────────────────────────────
async function createAdminProfile(user_id, data) {
  const { department, university, staff_id } = data;
  await pool.query(
    `INSERT INTO AdminProfiles (user_id, department, university, staff_id)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE department=VALUES(department), university=VALUES(university), staff_id=VALUES(staff_id)`,
    [user_id, department || null, university || null, staff_id || null]
  );
}

async function getAdminProfile(user_id) {
  const [rows] = await pool.query('SELECT * FROM AdminProfiles WHERE user_id = ?', [user_id]);
  return rows[0] || null;
}

module.exports = {
  findByEmail, findById, createUser, updateUser, verifyEmail,
  createStudentProfile, getStudentProfile, updateStudentProfile,
  createCompanyProfile, getCompanyProfile, updateCompanyProfile,
  createAdminProfile, getAdminProfile,
};
