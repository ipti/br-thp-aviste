-- Migra a escala de acuidade visual da triagem:
--   1: 20/200 -> 20/100   2: 20/100 -> 20/63   3: 20/80 -> 20/50   4: 20/60 -> 20/40
--   5: 20/50  -> 20/32    6: 20/40  -> 20/25   7: 20/30 -> 20/20
-- A opção "8" (antigo 20/20) é removida da escala; registros existentes com "8"
-- são reatribuídos para "7", que agora representa 20/20 (mesmo significado clínico).
UPDATE `student_data` SET `acuidade_triagem_direito` = '7' WHERE `acuidade_triagem_direito` = '8';
UPDATE `student_data` SET `acuidade_triagem_esquerdo` = '7' WHERE `acuidade_triagem_esquerdo` = '8';
