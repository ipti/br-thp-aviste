-- Add data_triagem column to student_data
ALTER TABLE `student_data` ADD COLUMN `data_triagem` DATETIME(3) NULL;

-- Backfill: students already screened get data_triagem = createdAt
UPDATE `student_data` SET `data_triagem` = `createdAt` WHERE `triagem_concluida` = 1;
