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

export interface MigrationStudentError {
  student_id: number;
  name: string;
  missing_or_invalid_fields: string[];
}

export interface SavedMigrationErrors {
  classroomId: number;
  timestamp: string;
  students: MigrationStudentError[];
}

const MIGRATION_ERRORS_KEY = (classroomId: number) => `migration_errors_${classroomId}`;

export const migrationErrorsStorage = {
  save(classroomId: number, students: MigrationStudentError[]): SavedMigrationErrors {
    const data: SavedMigrationErrors = { classroomId, timestamp: new Date().toISOString(), students };
    localStorage.setItem(MIGRATION_ERRORS_KEY(classroomId), JSON.stringify(data));
    return data;
  },
  load(classroomId: number): SavedMigrationErrors | null {
    try {
      const raw = localStorage.getItem(MIGRATION_ERRORS_KEY(classroomId));
      return raw ? (JSON.parse(raw) as SavedMigrationErrors) : null;
    } catch { return null; }
  },
  clear(classroomId: number): void {
    localStorage.removeItem(MIGRATION_ERRORS_KEY(classroomId));
  },
};

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
