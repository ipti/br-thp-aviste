import api from '../../../services/api';

export interface School {
  id: number;
  name: string;
  createdAt: string;
}

export const schoolsApi = {
  list: (): Promise<School[]> =>
    api.get<School[]>('/schools').then((r) => r.data),

  get: (id: number): Promise<School> =>
    api.get<School>(`/schools/${id}`).then((r) => r.data),

  create: (name: string): Promise<School> =>
    api.post<School>('/schools', { name }).then((r) => r.data),

  update: (id: number, name: string): Promise<School> =>
    api.put<School>(`/schools/${id}`, { name }).then((r) => r.data),

  remove: (id: number): Promise<void> =>
    api.delete(`/schools/${id}`).then(() => undefined),
};
