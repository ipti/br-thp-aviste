import api from '../../../services/api';

export type UserRole = 'ADMIN' | 'TRIADOR' | 'MEDICO';

export interface User {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  schoolIds: number[];
}

export interface CreateUserData {
  name: string;
  username: string;
  password: string;
  role: UserRole;
}

export const usersApi = {
  list: (): Promise<User[]> => api.get<User[]>('/users').then((r) => r.data),
  create: (data: CreateUserData): Promise<User> => api.post<User>('/users', data).then((r) => r.data),
  update: (id: number, data: Partial<CreateUserData>): Promise<User> =>
    api.put<User>(`/users/${id}`, data).then((r) => r.data),
  addSchool: (id: number, schoolId: number): Promise<User> =>
    api.post<User>(`/users/${id}/schools`, { schoolId }).then((r) => r.data),
  removeSchool: (id: number, schoolId: number): Promise<User> =>
    api.delete<User>(`/users/${id}/schools/${schoolId}`).then((r) => r.data),
  remove: (id: number): Promise<void> => api.delete(`/users/${id}`).then(() => undefined),
};
