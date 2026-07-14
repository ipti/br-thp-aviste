import api from '../../../services/api';

export interface School {
  id: number;
  name: string;
  total_alunos_escola?: number | null;
  createdAt: string;
}

export interface SchoolStats {
  total_classrooms: number;
  total_students: number;
  total_consultations: number;
  students_5_to_12: number;
}

export const schoolsApi = {
  list: (): Promise<School[]> =>
    api.get<School[]>('/schools').then((r) => r.data),

  get: (id: number): Promise<School> =>
    api.get<School>(`/schools/${id}`).then((r) => r.data),

  create: (name: string): Promise<School> =>
    api.post<School>('/schools', { name }).then((r) => r.data),

  update: (id: number, data: { name?: string; total_alunos_escola?: number | null }): Promise<School> =>
    api.put<School>(`/schools/${id}`, data).then((r) => r.data),

  remove: (id: number): Promise<void> =>
    api.delete(`/schools/${id}`).then(() => undefined),

  getStats: (id: number): Promise<SchoolStats> =>
    api.get<SchoolStats>(`/schools/${id}/stats`).then((r) => r.data),
};
