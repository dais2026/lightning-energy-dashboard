-- ============================================================
-- Migration 001: Initial Schema
-- Lightning Energy Dashboard
-- ============================================================

CREATE TABLE IF NOT EXISTS `users` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`       VARCHAR(255) NOT NULL UNIQUE,
  `name`        VARCHAR(255),
  `oauth_id`    VARCHAR(255) UNIQUE,
  `provider`    VARCHAR(50) DEFAULT 'manus',
  `role`        ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `avatar_url`  VARCHAR(512),
  `is_active`   TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email`    (`email`),
  INDEX `idx_oauth_id` (`oauth_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `files` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`       INT UNSIGNED,
  `name`          VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `file_key`      VARCHAR(512) NOT NULL UNIQUE,
  `url`           VARCHAR(512) NOT NULL,
  `mime_type`     VARCHAR(127) NOT NULL,
  `size`          BIGINT UNSIGNED NOT NULL,
  `category`      VARCHAR(100) NOT NULL DEFAULT 'general',
  `uploaded_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id`  (`user_id`),
  INDEX `idx_category` (`category`),
  CONSTRAINT `fk_files_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migration metadata tracking
CREATE TABLE IF NOT EXISTS `schema_migrations` (
  `version`    VARCHAR(255) NOT NULL,
  `applied_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `schema_migrations` (`version`) VALUES ('001_init');
