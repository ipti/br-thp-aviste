ALTER TABLE `student_data`
  ADD COLUMN `diagnostico_miopia`        BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `diagnostico_hipermetropia` BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN `diagnostico_astigmatismo`  BOOLEAN NOT NULL DEFAULT false;
