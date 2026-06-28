-- ============================================================
-- Migration 002: Analytics Tables
-- Lightning Energy Dashboard
-- ============================================================

CREATE TABLE IF NOT EXISTS `page_views` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id`   VARCHAR(64) NOT NULL,
  `user_id`      INT UNSIGNED,
  `path`         VARCHAR(512) NOT NULL,
  `referrer`     VARCHAR(512),
  `user_agent`   VARCHAR(512),
  `ip_hash`      VARCHAR(64),           -- SHA-256 hash, not raw IP
  `duration_ms`  INT UNSIGNED,          -- Time on page in milliseconds
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_session`    (`session_id`),
  INDEX `idx_user_id`    (`user_id`),
  INDEX `idx_path`       (`path`(191)),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `events` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` VARCHAR(64) NOT NULL,
  `user_id`    INT UNSIGNED,
  `event_name` VARCHAR(100) NOT NULL,
  `properties` JSON,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_event_name`  (`event_name`),
  INDEX `idx_session`     (`session_id`),
  INDEX `idx_created_at`  (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `daily_stats` (
  `date`              DATE NOT NULL,
  `unique_users`      INT UNSIGNED NOT NULL DEFAULT 0,
  `total_sessions`    INT UNSIGNED NOT NULL DEFAULT 0,
  `total_page_views`  INT UNSIGNED NOT NULL DEFAULT 0,
  `avg_duration_ms`   INT UNSIGNED NOT NULL DEFAULT 0,
  `bounce_count`      INT UNSIGNED NOT NULL DEFAULT 0,
  `updated_at`        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `schema_migrations` (`version`) VALUES ('002_add_analytics');
