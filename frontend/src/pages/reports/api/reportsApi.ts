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

export const reportsApi = {
  general: (): Promise<SchoolReport[]> =>
    api.get<SchoolReport[]>('/reports/general').then((r) => r.data),
};
