-- IILMS Seed Data
-- Run schema.sql first, then this file.
-- Passwords are bcrypt hashes of "password" (cost factor 10).
-- Hash: $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

USE iilms;

-- ─────────────────────────────────────────────
-- Users
-- id 1–2  : admins
-- id 3–5  : students
-- id 6–7  : companies
-- ─────────────────────────────────────────────
INSERT INTO Users (id, email, password_hash, role, full_name, created_at) VALUES
(1, 'admin1@iilms.edu',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',   'Alice Admin',      '2024-01-01 08:00:00'),
(2, 'admin2@iilms.edu',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',   'Bob Supervisor',   '2024-01-02 08:00:00'),
(3, 'student1@uni.edu',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Carol Chen',       '2024-01-10 09:00:00'),
(4, 'student2@uni.edu',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'David Diaz',       '2024-01-11 09:00:00'),
(5, 'student3@uni.edu',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Eva Evans',        '2024-01-12 09:00:00'),
(6, 'hr@techcorp.com',     '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'company', 'TechCorp HR',      '2024-01-05 10:00:00'),
(7, 'recruit@greenco.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'company', 'GreenCo Recruiter','2024-01-06 10:00:00');

-- ─────────────────────────────────────────────
-- Internships
-- id 1–2 : TechCorp (company 6) — 1 open, 1 closed
-- id 3–4 : GreenCo  (company 7) — 1 open, 1 closed
-- ─────────────────────────────────────────────
INSERT INTO Internships (id, company_id, title, description, skills_required, location, duration_weeks, deadline, status, created_at) VALUES
(1, 6, 'Backend Developer Intern',
    'Work on RESTful APIs and database design using Node.js and MySQL.',
    'Node.js, MySQL, REST APIs',
    'Kuala Lumpur', 12, '2025-06-30', 'open',   '2024-02-01 10:00:00'),
(2, 6, 'Frontend Developer Intern',
    'Build responsive UIs with React and Tailwind CSS.',
    'React, Tailwind CSS, JavaScript',
    'Kuala Lumpur', 10, '2024-03-31', 'closed', '2024-01-15 10:00:00'),
(3, 7, 'Data Analyst Intern',
    'Analyse environmental datasets and produce visualisation dashboards.',
    'Python, Pandas, Power BI',
    'Petaling Jaya', 16, '2025-07-15', 'open',   '2024-02-10 11:00:00'),
(4, 7, 'Sustainability Research Intern',
    'Assist in sustainability reporting and carbon footprint analysis.',
    'Excel, Report Writing',
    'Remote', 8, '2024-04-30', 'closed', '2024-01-20 11:00:00');

-- ─────────────────────────────────────────────
-- Applications
-- student 3 → internship 1 (accepted)
-- student 4 → internship 1 (rejected)
-- student 5 → internship 1 (pending)
-- student 3 → internship 3 (accepted)
-- student 4 → internship 3 (pending)
-- ─────────────────────────────────────────────
INSERT INTO Applications (id, student_id, internship_id, status, applied_at) VALUES
(1, 3, 1, 'accepted', '2024-03-01 09:00:00'),
(2, 4, 1, 'rejected', '2024-03-02 09:30:00'),
(3, 5, 1, 'pending',  '2024-03-03 10:00:00'),
(4, 3, 3, 'accepted', '2024-03-05 11:00:00'),
(5, 4, 3, 'pending',  '2024-03-06 11:30:00');

-- ─────────────────────────────────────────────
-- SupervisorAssignments
-- application 1 → supervisor admin 2
-- application 4 → supervisor admin 1
-- ─────────────────────────────────────────────
INSERT INTO SupervisorAssignments (id, application_id, supervisor_id, assigned_at) VALUES
(1, 1, 2, '2024-03-10 08:00:00'),
(2, 4, 1, '2024-03-11 08:00:00');

-- ─────────────────────────────────────────────
-- Evaluations
-- application 1 evaluated by company 6 (score 85)
-- application 4 evaluated by company 7 (score 90)
-- ─────────────────────────────────────────────
INSERT INTO Evaluations (id, application_id, evaluator_id, score, feedback, evaluated_at) VALUES
(1, 1, 6, 85, 'Carol demonstrated strong backend skills and delivered quality work on time.', '2024-05-20 14:00:00'),
(2, 4, 7, 90, 'Excellent analytical thinking and clear data visualisations throughout the internship.', '2024-05-22 14:00:00');

-- ─────────────────────────────────────────────
-- RecommendationLetters
-- one letter for application 1
-- ─────────────────────────────────────────────
INSERT INTO RecommendationLetters (id, application_id, content, generated_at) VALUES
(1, 1,
 'This letter is to recommend Carol Chen for her outstanding performance during the Backend Developer Internship at TechCorp. She consistently demonstrated initiative, technical proficiency, and a collaborative spirit. We highly recommend her for future opportunities.',
 '2024-05-25 10:00:00');

-- ─────────────────────────────────────────────
-- Complaints
-- complaint 1 : student 3, open
-- complaint 2 : student 4, resolved
-- ─────────────────────────────────────────────
INSERT INTO Complaints (id, student_id, subject, status, created_at) VALUES
(1, 3, 'Supervisor not responding to messages', 'open',     '2024-04-15 09:00:00'),
(2, 4, 'Internship description was misleading',  'resolved', '2024-04-10 10:00:00');

-- ComplaintMessages
-- complaint 1 : initial message from student 3, then admin 1 reply
-- complaint 2 : initial message from student 4, admin 1 reply, then resolved
INSERT INTO ComplaintMessages (id, complaint_id, sender_id, message, sent_at) VALUES
(1, 1, 3, 'My assigned supervisor has not replied to any of my messages for two weeks. Please help.', '2024-04-15 09:01:00'),
(2, 1, 1, 'Thank you for raising this. We have contacted the supervisor and will follow up within 48 hours.', '2024-04-16 10:00:00'),
(3, 2, 4, 'The internship posting said Python work but I was only given data entry tasks.', '2024-04-10 10:01:00'),
(4, 2, 1, 'We have reviewed your concern with the company. They have acknowledged the discrepancy and updated the posting. Your complaint is now resolved.', '2024-04-12 09:00:00');

-- ─────────────────────────────────────────────
-- Notifications (5 rows)
-- ─────────────────────────────────────────────
INSERT INTO Notifications (id, user_id, message, is_read, created_at) VALUES
(1, 3, 'Your application for "Backend Developer Intern" has been accepted.',          FALSE, '2024-03-08 08:00:00'),
(2, 4, 'Your application for "Backend Developer Intern" has been rejected.',          TRUE,  '2024-03-08 08:05:00'),
(3, 3, 'A supervisor has been assigned to your application for "Backend Developer Intern".', FALSE, '2024-03-10 08:30:00'),
(4, 3, 'Admin has replied to your complaint: "Supervisor not responding to messages".', FALSE, '2024-04-16 10:01:00'),
(5, 3, 'Your application for "Data Analyst Intern" has been accepted.',               FALSE, '2024-03-07 09:00:00');
