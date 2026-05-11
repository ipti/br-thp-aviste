-- Rename status columns to portuguese naming
ALTER TABLE `student_data`
  CHANGE COLUMN `questionario_pais_completed` `questionario_pais_concluido` BOOLEAN NOT NULL DEFAULT false,
  CHANGE COLUMN `triagem_completed` `triagem_concluida` BOOLEAN NOT NULL DEFAULT false,
  CHANGE COLUMN `receita_oculos_completed` `receita_oculos_concluida` BOOLEAN NOT NULL DEFAULT false,
  CHANGE COLUMN `consulta_completed` `consulta_concluida` BOOLEAN NOT NULL DEFAULT false,
  CHANGE COLUMN `entrega_oculos_completed` `entrega_oculos_concluida` BOOLEAN NOT NULL DEFAULT false;
