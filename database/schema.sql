-- ============================================================
--  NORIA Creative Film Studio — Schema MySQL v2
-- ============================================================

CREATE DATABASE IF NOT EXISTS noria_films
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE noria_films;

-- ────────────────────────────────────────────────────────────
-- 1. USERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT           NOT NULL AUTO_INCREMENT,
  full_name     VARCHAR(120)  NOT NULL,
  email         VARCHAR(180)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  phone         VARCHAR(30)   DEFAULT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  status        ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_users       PRIMARY KEY (id),
  CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- 2. SERVICES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(120)  NOT NULL,
  description TEXT          NOT NULL,
  base_price  DECIMAL(10,2) DEFAULT NULL,
  icon        VARCHAR(10)   DEFAULT NULL,
  image_url   VARCHAR(500)  DEFAULT NULL,
  active      TINYINT(1)    NOT NULL DEFAULT 1,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_services PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- 3. QUOTES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id                   INT           NOT NULL AUTO_INCREMENT,
  user_id              INT           NOT NULL,
  service_id           INT           NOT NULL,
  shooting_duration    VARCHAR(20)   DEFAULT NULL,
  needs_drone          TINYINT(1)    NOT NULL DEFAULT 0,
  delivery_time        VARCHAR(20)   DEFAULT NULL,
  project_type         VARCHAR(120)  DEFAULT NULL,
  extra_notes          TEXT          DEFAULT NULL,
  production_cost      DECIMAL(10,2) NOT NULL DEFAULT 0,
  equipment_cost       DECIMAL(10,2) NOT NULL DEFAULT 0,
  postproduction_cost  DECIMAL(10,2) NOT NULL DEFAULT 0,
  extras_cost          DECIMAL(10,2) NOT NULL DEFAULT 0,
  estimated_price      DECIMAL(10,2) DEFAULT NULL,
  status               ENUM('draft','generated','cancelled') NOT NULL DEFAULT 'draft',
  created_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_quotes          PRIMARY KEY (id),
  CONSTRAINT fk_quotes_user     FOREIGN KEY (user_id)    REFERENCES users(id),
  CONSTRAINT fk_quotes_service  FOREIGN KEY (service_id) REFERENCES services(id)
) ENGINE=InnoDB;

-- ────────────────────────────────────────────────────────────
-- 4. CONTACT_MESSAGES
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT          NOT NULL AUTO_INCREMENT,
  full_name  VARCHAR(120) NOT NULL,
  email      VARCHAR(180) NOT NULL,
  phone      VARCHAR(30)  DEFAULT NULL,
  subject    VARCHAR(200) NOT NULL,
  message    TEXT         NOT NULL,
  status     ENUM('new','read','archived') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_contacts PRIMARY KEY (id)
) ENGINE=InnoDB;
