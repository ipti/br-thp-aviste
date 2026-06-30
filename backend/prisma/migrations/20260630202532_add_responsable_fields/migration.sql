-- AlterTable
ALTER TABLE `student_data`
  ADD COLUMN `telephone` VARCHAR(20) NULL,
  ADD COLUMN `responsable_name` VARCHAR(200) NULL,
  ADD COLUMN `responsable_cpf` VARCHAR(14) NULL,
  ADD COLUMN `responsable_telephone` VARCHAR(20) NULL,
  ADD COLUMN `responsable_email` VARCHAR(200) NULL,
  ADD COLUMN `is_legal_responsible` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `image_sharing_not_authorized` BOOLEAN NOT NULL DEFAULT false;
