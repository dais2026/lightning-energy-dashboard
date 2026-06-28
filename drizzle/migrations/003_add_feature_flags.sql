-- ============================================================
-- Migration 003: Feature Flags Persistence
-- Lightning Energy Dashboard
-- ============================================================

CREATE TABLE IF NOT EXISTS `feature_flags` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL UNIQUE,
  `enabled`     TINYINT(1) NOT NULL DEFAULT 0,
  `rollout`     TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '0-100 percentage',
  `roles`       JSON COMMENT 'Array of role strings, null = all roles',
  `users`       JSON COMMENT 'Array of user IDs, null = no user targeting',
  `date_start`  DATETIME,
  `date_end`    DATETIME,
  `description` VARCHAR(512),
  `created_by`  INT UNSIGNED,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default flags
INSERT IGNORE INTO `feature_flags` (`name`, `enabled`, `rollout`, `description`) VALUES
  ('admin_dashboard',    1, 100, 'Admin dashboard interface'),
  ('analytics_module',   1,  80, 'Analytics module features'),
  ('dark_mode',          1, 100, 'Dark theme support'),
  ('export_reports',     1, 100, 'Report export functionality'),
  ('advanced_charts',    0,   0, 'Advanced visualization charts'),
  ('api_v2',             0,   0, 'New API v2 endpoints'),
  ('ai_recommendations', 0,   0, 'AI-powered recommendations'),
  ('batch_operations',   0,   0, 'Batch file operations'),
  ('webhook_integration',0,   0, 'Webhook event integration'),
  ('custom_themes',      0,   0, 'Custom theme configuration');

CREATE TABLE IF NOT EXISTS `feature_flag_overrides` (
  `id`      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `flag_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `enabled` TINYINT(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_flag_user` (`flag_id`, `user_id`),
  CONSTRAINT `fk_override_flag` FOREIGN KEY (`flag_id`) REFERENCES `feature_flags` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_override_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `schema_migrations` (`version`) VALUES ('003_add_feature_flags');
