import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  classroomsApi,
  type CreateClassroomData,
  type SendMigrationPayload,
} from '../api/classroomsApi';
import { toastService } from '../../../lib/toast';

const KEY = (schoolId?: number) => ['classrooms', schoolId];

export const useClassrooms = (schoolId?: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: KEY(schoolId),
    queryFn: () => classroomsApi.list(schoolId),
    enabled: options?.enabled ?? true,
  });

export const useClassroom = (id: number) =>
  useQuery({
    queryKey: ['classrooms', 'detail', id],
    queryFn: () => classroomsApi.get(id),
    enabled: !!id,
  });

export const useCreateClassroom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClassroomData) => classroomsApi.create(data),
    onSuccess: (_r, vars) => {
      qc.invalidateQueries({ queryKey: KEY(vars.school_fk) });
      qc.invalidateQueries({ queryKey: KEY() });
      toastService.success('Turma criada com sucesso');
    },
  });
};

export const useUpdateClassroom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateClassroomData> }) =>
      classroomsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classrooms'] });
      toastService.success('Turma atualizada');
    },
  });
};

export const useDeleteClassroom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: classroomsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classrooms'] });
      toastService.success('Turma removida');
    },
  });
};

export const useMigrationProjects = (enabled: boolean) =>
  useQuery({
    queryKey: ['migration', 'projects'],
    queryFn: classroomsApi.getMigrationProjects,
    enabled,
  });

export const useSendMigration = () =>
  useMutation({
    mutationFn: (payload: SendMigrationPayload) => classroomsApi.sendMigration(payload),
    onSuccess: () => {
      toastService.success('Turma migrada com sucesso para o MeuBen');
    },
  });
