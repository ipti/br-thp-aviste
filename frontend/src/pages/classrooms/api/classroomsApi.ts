import api from '../../../services/api';

export interface Classroom {
  id: number;
  name: string;
  year?: string;
  school_fk: number;
  school?: { id: number; name: string };
}

export interface CreateClassroomData {
  name: string;
  school_fk: number;
  year?: string;
}

export interface MigrationProject {
  id: number;
  name: string;
}

export interface SendMigrationPayload {
  id: number;
  project: number;
  name: string;
  year: number;
}

export const classroomsApi = {
  list: (schoolId?: number): Promise<Classroom[]> =>
    api.get<Classroom[]>('/classrooms', { params: schoolId ? { schoolId } : undefined }).then((r) => r.data),

  get: (id: number): Promise<Classroom> =>
    api.get<Classroom>(`/classrooms/${id}`).then((r) => r.data),

  create: (data: CreateClassroomData): Promise<Classroom> =>
    api.post<Classroom>('/classrooms', data).then((r) => r.data),

  update: (id: number, data: Partial<CreateClassroomData>): Promise<Classroom> =>
    api.put<Classroom>(`/classrooms/${id}`, data).then((r) => r.data),

  remove: (id: number): Promise<void> =>
    api.delete(`/classrooms/${id}`).then(() => undefined),

  getMigrationProjects: (): Promise<MigrationProject[]> =>
    api.get<MigrationProject[]>('/migration/projects').then((r) => r.data),

  sendMigration: (payload: SendMigrationPayload): Promise<unknown> =>
    api.post('/migration/send', payload).then((r) => r.data),
};
