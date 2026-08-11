import api from '../../../services/api';

export interface SchoolReport {
  schoolId: number;
  school: string;
  countClassroom: number;
  countRegister: number;
  countQuestianarioPais: number;
  countRegisterTriados: number;
  countForwardedConsultation: number;
  countConsultationCompleted: number;
  countReceitaOculosCompleted: number;
  countEntregaOculosCompleted: number;
}

export type ReportFilterField = 'createdAt' | 'data_triagem' | 'data_consulta' | 'data_entrega_oculos';

export interface ReportFilter {
  filterField: ReportFilterField;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export const reportsApi = {
  general: (filter?: ReportFilter): Promise<SchoolReport[]> =>
    api
      .get<SchoolReport[]>('/reports/general', { params: filter })
      .then((r) => r.data),
};
