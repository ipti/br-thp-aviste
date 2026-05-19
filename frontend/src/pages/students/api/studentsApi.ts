import api from '../../../services/api';

export interface Student {
  id: number;
  name: string;
  birthday: string;
  cpf?: string;
  sex: number;
  color_race: number;
  zone: number;
  deficiency: boolean;
  turno?: string;
  permission: boolean;
  classroom_fk: number;
  school_fk: number;
  points: number;
  questionario_pais_concluido: boolean;
  triagem_concluida: boolean;
  receita_oculos_concluida: boolean;
  consulta_concluida: boolean;
  entrega_oculos_concluida: boolean;
  // questionário
  filho_oculos?: string;
  horas_uso_aparelhos_eletronicos?: number;
  horas_atividades_ao_ar_livre?: number;
  dificuldade_quadro?: boolean;
  dificuldade_livro?: boolean;
  olho_torto_constante?: boolean;
  olho_torto_momentos?: boolean;
  rosto_aperta_olhos?: boolean;
  tremor_olhos?: boolean;
  mancha_branca_pupila?: boolean;
  olho_preguicoso?: boolean;
  olho_torto_doenca?: boolean;
  catarata_infancia?: boolean;
  glaucoma_congenito?: boolean;
  tumor_olhos?: boolean;
  ceratocone_transplante?: boolean;
  palpebra_caida?: boolean;
  miopia_ambos_pais?: boolean;
  miopia_um_pai?: boolean;
  hipermetropia_astigmatismo?: boolean;
  estrabismo?: boolean;
  catarata_glaucoma?: boolean;
  olho_preguicoso_familiar?: boolean;
  tumor_olho_familiar?: boolean;
  prematuridade?: boolean;
  sindrome_down?: boolean;
  paralisia_tumor_cerebral?: boolean;
  outras_sindromes_geneticas?: boolean;
  diabetes?: boolean;
  artrite_artrose?: boolean;
  alergias_corticoides?: boolean;
  // triagem
  acuidade_triagem_direito?: string;
  acuidade_triagem_esquerdo?: string;
  test_cover?: string;
  test_movimento_ocular?: string;
  test_mancha_branca?: string;
  atendimento_oftalmologico_previo?: string;
  // receita
  receita_esferico_od?: string;
  receita_cilindrico_od?: string;
  receita_eixo_od?: string;
  receita_esferico_oe?: string;
  receita_cilindrico_oe?: string;
  receita_eixo_oe?: string;
  receita_adicao?: string;
  receita_dp?: string;
  // consulta
  data_consulta?: string;
  crm_medico?: string;
  nome_medico?: string;
  data_entrega_oculos?: string;
  responsavel_entrega_oculos?: string;
}

export interface CreateStudentData {
  name: string;
  birthday: string;
  cpf?: string;
  sex: number;
  color_race: number;
  zone: number;
  deficiency: boolean;
  turno?: string;
  permission: boolean;
  classroom_fk: number;
  school_fk: number;
}

export interface UpdateGlassesDeliveryData {
  data_entrega_oculos: string;
  responsavel_entrega_oculos: string;
  entrega_oculos_confirmada: boolean;
}

export const studentsApi = {
  list: (params: { classroomId?: number; schoolId?: number }): Promise<Student[]> =>
    api.get<Student[]>('/students', { params: { classroomId: params.classroomId, schoolId: params.schoolId } }).then((r) => r.data),

  get: (id: number): Promise<Student> =>
    api.get<Student>(`/students/${id}`).then((r) => r.data),

  create: (data: CreateStudentData): Promise<Student> =>
    api.post<Student>('/students', data).then((r) => r.data),

  updateBasic: (id: number, data: Record<string, unknown>): Promise<Student> =>
    api.put<Student>(`/students/${id}`, data).then((r) => r.data),

  updateQuestionnaire: (id: number, data: Record<string, unknown>): Promise<Student> =>
    api.put<Student>(`/students/${id}/questionnaire`, data).then((r) => r.data),

  updateScreening: (id: number, data: Record<string, unknown>): Promise<Student> =>
    api.put<Student>(`/students/${id}/screening`, data).then((r) => r.data),

  updatePrescription: (id: number, data: Record<string, unknown>): Promise<Student> =>
    api.put<Student>(`/students/${id}/prescription`, data).then((r) => r.data),

  updateConsultation: (id: number, data: Record<string, unknown>): Promise<Student> =>
    api.put<Student>(`/students/${id}/consultation`, data).then((r) => r.data),

  markGlassesDelivered: (id: number, data: UpdateGlassesDeliveryData): Promise<Student> =>
    api.put<Student>(`/students/${id}/glasses-delivered`, data).then((r) => r.data),

  remove: (id: number): Promise<void> =>
    api.delete(`/students/${id}`).then(() => undefined),
};
