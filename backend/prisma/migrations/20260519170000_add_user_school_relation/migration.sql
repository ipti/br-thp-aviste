CREATE TABLE `user_school` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_fk` INT NOT NULL,
  `school_fk` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  INDEX `user_school_school_fk_idx`(`school_fk`),
  UNIQUE INDEX `user_school_user_fk_school_fk_key`(`user_fk`, `school_fk`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `user_school`
  ADD CONSTRAINT `user_school_user_fk_fkey`
  FOREIGN KEY (`user_fk`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_school`
  ADD CONSTRAINT `user_school_school_fk_fkey`
  FOREIGN KEY (`school_fk`) REFERENCES `school`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
