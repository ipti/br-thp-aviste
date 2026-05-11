import api from '../../../services/api';

export interface ConsultationItem {
  schoolId: number;
  school: string;
  classroomId: number;
  classroom: string;
  studentDataId: number;
  studentName: string;
  birthday: string;
  points: number;
  priority: string;
}

export const consultationsApi = {
  list: (schoolId?: number): Promise<ConsultationItem[]> =>
    api
      .get<ConsultationItem[]>('/consultations', { params: schoolId ? { schoolId } : undefined })
      .then((r) => r.data),
};
