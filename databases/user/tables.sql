CREATE TABLE `user` (
  `id`             INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `email`          VARCHAR(255) UNIQUE NOT NULL,
  `created_at`     TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at`     TIMESTAMP,
  `last_accessed`  TIMESTAMP
);

-- CREATE TABLE `profile` (
--   `id`             INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
--   `user_id`        INT UNSIGNED UNIQUE NOT NULL,
--   `first_name`     VARCHAR(255) NOT NULL,
--   `last_name`      VARCHAR(255) NOT NULL,
--   `dp_url`         VARCHAR(255),

--   FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
-- );

CREATE TABLE `password` (
  `id`             INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `user_id`        INT UNSIGNED UNIQUE NOT NULL,
  `hash`           CHAR(97) NOT NULL,
  `previous`       CHAR(97),
  `bad_attempt`    TINYINT UNSIGNED DEFAULT 0,
  `locked_until`   TIMESTAMP,
  `created_at`     TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at`     TIMESTAMP,

  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);

CREATE TABLE `oauth` (
  `id`             INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  `user_id`        INT UNSIGNED NOT NULL,
  `provider`       VARCHAR(255) NOT NULL,
  `identifier`     VARCHAR(255) NOT NULL,
  `created_at`     TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at`     TIMESTAMP,
  `last_accessed`  TIMESTAMP,

  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
