import { Injectable } from '@nestjs/common';
import { student_data } from '@prisma/client';

@Injectable()
export class PointsService {
  /**
   * Calcula a pontuação de risco visual.
   * Pontuação >= 5 indica encaminhamento para consulta oftalmológica.
   * Replicado do algoritmo original (addPointsStudents.ts do Firebase).
   */
  calculate(s: student_data): number {
    let score = 0;

    if (s.filho_oculos === '1') score += 1;

    const hasSintomas =
      (s.dificuldade_quadro && s.olho_torto_momentos) ||
      (s.dificuldade_livro && s.olho_torto_momentos) ||
      (s.dificuldade_quadro && s.rosto_aperta_olhos) ||
      (s.dificuldade_livro && s.rosto_aperta_olhos) ||
      s.olho_torto_constante ||
      (s.olho_torto_momentos && s.rosto_aperta_olhos) ||
      s.tremor_olhos ||
      s.mancha_branca_pupila;
    if (hasSintomas) score += 1;

    if (
      s.olho_preguicoso || s.olho_torto_doenca || s.catarata_infancia ||
      s.glaucoma_congenito || s.tumor_olhos || s.ceratocone_transplante || s.palpebra_caida
    ) score += 1;

    if (
      s.miopia_ambos_pais || s.miopia_um_pai || s.hipermetropia_astigmatismo ||
      s.estrabismo || s.catarata_glaucoma || s.olho_preguicoso_familiar || s.tumor_olho_familiar
    ) score += 1;

    if (
      s.prematuridade || s.sindrome_down || s.paralisia_tumor_cerebral ||
      s.outras_sindromes_geneticas || s.diabetes || s.artrite_artrose || s.alergias_corticoides
    ) score += 1;

    // 4-8h ou >8h de telas (valores 4 e 5)
    if (s.horas_uso_aparelhos_eletronicos === 4 || s.horas_uso_aparelhos_eletronicos === 5) score += 1;

    // <30min ou 30min-1h ao ar livre (valores 1 e 2)
    if (s.horas_atividades_ao_ar_livre === 1 || s.horas_atividades_ao_ar_livre === 2) score += 1;

    if (s.test_cover === '1') score += 1;
    if (s.test_movimento_ocular === '1') score += 1;
    if (s.test_mancha_branca === '1') score += 1;

    // Escala: 1=20/100 2=20/63 3=20/50 4=20/40 5=20/32 6=20/25 7=20/20
    const LOW = ['1', '2', '3', '4'];
    const esq = s.acuidade_triagem_esquerdo ?? '';
    const dir = s.acuidade_triagem_direito ?? '';

    if (LOW.includes(esq)) score += 5; else if (esq === '5' || esq === 'nenhum') score += 2;
    if (LOW.includes(dir)) score += 5; else if (dir === '5' || dir === 'nenhum') score += 2;

    return score;
  }
}
