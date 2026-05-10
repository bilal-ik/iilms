-- IILMS Database Schema
-- MySQL 8.x
-- All tables in 3NF with proper FK constraints, ENUM types, and DEFAULT values.

CREATE DATABASE IF NOT EXISTS iilms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE iilms;

-- ─────────────────────────────────────────────
-- 1. Users
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Users (
    id            INT          NOT NULL AUTO_INCREMENT,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('admin','student','company') NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- 2. Internships
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Internships (
    id             INT          NOT NULL AUTO_INCREMENT,
    company_id     INT          NOT NULL,
    title          VARCHAR(255) NOT NULL,
    description    TEXT         NOT NULL,
    skills_required TEXT,
    location       VARCHAR(255) NOT NULL,
    duration_weeks INT          NOT NULL,
    deadline       DATE         NOT NULL,
    status         ENUM('open','closed') NOT NULL DEFAULT 'open',
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_internships_company
        FOREIGN KEY (company_id) REFERENCES Users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- 3. Applications
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Applications (
    id            INT      NOT NULL AUTO_INCREMENT,
    student_id    INT      NOT NULL,
    internship_id INT      NOT NULL,
    status        ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
    applied_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_applications_student_internship (student_id, internship_id),
    CONSTRAINT fk_applications_student
        FOREIGN KEY (student_id) REFERENCES Users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_applications_internship
        FOREIGN KEY (internship_id) REFERENCES Internships (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- 4. SupervisorAssignments
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS SupervisorAssignments (
    id             INT      NOT NULL AUTO_INCREMENT,
    application_id INT      NOT NULL,
    supervisor_id  INT      NOT NULL,
    assigned_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_supervisor_assignments_application (application_id),
    CONSTRAINT fk_supervisor_assignments_application
        FOREIGN KEY (application_id) REFERENCES Applications (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_supervisor_assignments_supervisor
        FOREIGN KEY (supervisor_id) REFERENCES Users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- 5. Evaluations
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Evaluations (
    id             INT      NOT NULL AUTO_INCREMENT,
    application_id INT      NOT NULL,
    evaluator_id   INT      NOT NULL,
    score          INT      NOT NULL,
    feedback       TEXT,
    evaluated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_evaluations_application_evaluator (application_id, evaluator_id),
    CONSTRAINT chk_evaluations_score CHECK (score >= 0 AND score <= 100),
    CONSTRAINT fk_evaluations_application
        FOREIGN KEY (application_id) REFERENCES Applications (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_evaluations_evaluator
        FOREIGN KEY (evaluator_id) REFERENCES Users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- 6. RecommendationLetters
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS RecommendationLetters (
    id             INT      NOT NULL AUTO_INCREMENT,
    application_id INT      NOT NULL,
    content        TEXT     NOT NULL,
    generated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_recommendation_letters_application (application_id),
    CONSTRAINT fk_recommendation_letters_application
        FOREIGN KEY (application_id) REFERENCES Applications (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- 7. Complaints
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Complaints (
    id         INT          NOT NULL AUTO_INCREMENT,
    student_id INT          NOT NULL,
    subject    VARCHAR(500) NOT NULL,
    status     ENUM('open','resolved') NOT NULL DEFAULT 'open',
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_complaints_student
        FOREIGN KEY (student_id) REFERENCES Users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- 8. ComplaintMessages
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ComplaintMessages (
    id           INT      NOT NULL AUTO_INCREMENT,
    complaint_id INT      NOT NULL,
    sender_id    INT      NOT NULL,
    message      TEXT     NOT NULL,
    sent_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_complaint_messages_complaint
        FOREIGN KEY (complaint_id) REFERENCES Complaints (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_complaint_messages_sender
        FOREIGN KEY (sender_id) REFERENCES Users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- 9. Notifications
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS Notifications (
    id         INT          NOT NULL AUTO_INCREMENT,
    user_id    INT          NOT NULL,
    message    VARCHAR(1000) NOT NULL,
    is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id) REFERENCES Users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
