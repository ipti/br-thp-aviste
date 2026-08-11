-- Convert data_consulta from DD/MM/YYYY VARCHAR to DateTime
ALTER TABLE `student_data` ADD COLUMN `data_consulta_dt` DATETIME(3) NULL;
UPDATE `student_data`
  SET `data_consulta_dt` = STR_TO_DATE(`data_consulta`, '%d/%m/%Y')
  WHERE `data_consulta` IS NOT NULL AND `data_consulta` != '';
ALTER TABLE `student_data` DROP COLUMN `data_consulta`;
ALTER TABLE `student_data` CHANGE `data_consulta_dt` `data_consulta` DATETIME(3) NULL;

-- Convert data_entrega_oculos from DD/MM/YYYY VARCHAR to DateTime
ALTER TABLE `student_data` ADD COLUMN `data_entrega_oculos_dt` DATETIME(3) NULL;
UPDATE `student_data`
  SET `data_entrega_oculos_dt` = STR_TO_DATE(`data_entrega_oculos`, '%d/%m/%Y')
  WHERE `data_entrega_oculos` IS NOT NULL AND `data_entrega_oculos` != '';
ALTER TABLE `student_data` DROP COLUMN `data_entrega_oculos`;
ALTER TABLE `student_data` CHANGE `data_entrega_oculos_dt` `data_entrega_oculos` DATETIME(3) NULL;
