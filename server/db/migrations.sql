-- IILMS Migrations — Additional Features
-- Run this AFTER schema.sql is already applied
USE iilms;

-- ─────────────────────────────────────────────
-- Extend Users table with common profile fields
-- ─────────────────────────────────────────────
ALTER TABLE Users
  ADD COLUMN phone        VARCHAR(30)  DEFAULT NULL,
  ADD COLUMN address      VARCHAR(500) DEFAULT NULL,
  ADD COLUMN bio          TEXT         DEFAULT NULL,
  ADD COLUMN photo_url    VARCHAR(500) DEFAULT NULL,
  ADD COLUMN is_verified  BOOLEAN      NOT NULL DEFAULT FALSE,
  ADD COLUMN verify_token VARCHAR(64)  DEFAULT NULL,
  ADD COLUMN updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- ─────────────────────────────────────────────
-- StudentProfiles — extra student fields
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS StudentProfiles (
    user_id        INT          NOT NULL,
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    university_id  VARCHAR(50)  DEFAULT NULL,
    university     VARCHAR(255) DEFAULT NULL,
    sex            ENUM('male','female','other','prefer_not_to_say') DEFAULT NULL,
    date_of_birth  DATE         DEFAULT NULL,
    gpa            DECIMAL(3,2) DEFAULT NULL,
    skills         TEXT         DEFAULT NULL,
    linkedin_url   VARCHAR(500) DEFAULT NULL,
    testimonial    TEXT         DEFAULT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_student_profiles_user
        FOREIGN KEY (user_id) REFERENCES Users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- CompanyProfiles — extra company fields
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS CompanyProfiles (
    user_id          INT          NOT NULL,
    company_name     VARCHAR(255) NOT NULL,
    industry         VARCHAR(100) DEFAULT NULL,
    company_size     ENUM('1-10','11-50','51-200','201-500','500+') DEFAULT NULL,
    website          VARCHAR(500) DEFAULT NULL,
    contact_person   VARCHAR(255) DEFAULT NULL,
    contact_email    VARCHAR(255) DEFAULT NULL,
    contact_phone    VARCHAR(30)  DEFAULT NULL,
    company_address  VARCHAR(500) DEFAULT NULL,
    description      TEXT         DEFAULT NULL,
    testimonial      TEXT         DEFAULT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_company_profiles_user
        FOREIGN KEY (user_id) REFERENCES Users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- AdminProfiles — extra admin/university fields
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS AdminProfiles (
    user_id        INT          NOT NULL,
    department     VARCHAR(255) DEFAULT NULL,
    university     VARCHAR(255) DEFAULT NULL,
    staff_id       VARCHAR(50)  DEFAULT NULL,
    testimonial    TEXT         DEFAULT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_admin_profiles_user
        FOREIGN KEY (user_id) REFERENCES Users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────
-- ChatMessages — chatbot conversation history
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ChatMessages (
    id         INT      NOT NULL AUTO_INCREMENT,
    user_id    INT      DEFAULT NULL,
    session_id VARCHAR(64) NOT NULL,
    sender     ENUM('user','bot') NOT NULL,
    message    TEXT     NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_chat_messages_user
        FOREIGN KEY (user_id) REFERENCES Users (id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
