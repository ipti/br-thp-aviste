import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  studentsApi,
  type CreateStudentData,
  type UpdateGlassesDeliveryData,
} from '../api/studentsApi';
import { toastService } from '../../../lib/toast';

const KEY = (params?: { classroomId?: number; schoolId?: number }) =>
  ['students', params?.classroomId, params?.schoolId];

export const useStudents = (params: { classroomId?: number; schoolId?: number } = {}) =>
  useQuery({ queryKey: KEY(params), queryFn: () => studentsApi.list(params) });

export const useStudent = (id: number) =>
  useQuery({
    queryKey: ['students', 'detail', id],
    queryFn: () => studentsApi.get(id),
    enabled: !!id,
  });

export const useCreateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentData) => studentsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toastService.success('Aluno cadastrado com sucesso');
    },
  });
};

export const useUpdateBasic = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => studentsApi.updateBasic(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students', 'detail', id] });
      toastService.success('Dados básicos salvos');
    },
  });
};

export const useUpdateQuestionnaire = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => studentsApi.updateQuestionnaire(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students', 'detail', id] });
      toastService.success('Questionário salvo');
    },
  });
};

export const useUpdateScreening = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => studentsApi.updateScreening(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students', 'detail', id] });
      toastService.success('Triagem salva');
    },
  });
};

export const useUpdatePrescription = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => studentsApi.updatePrescription(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students', 'detail', id] });
      toastService.success('Receita salva');
    },
  });
};

export const useUpdateConsultation = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => studentsApi.updateConsultation(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students', 'detail', id] });
      toastService.success('Consulta salva');
    },
  });
};

export const useMarkGlassesDelivered = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGlassesDeliveryData) => studentsApi.markGlassesDelivered(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students', 'detail', id] });
      toastService.success('Óculos marcados como entregues');
    },
  });
};

export const useDeleteStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toastService.success('Aluno removido');
    },
  });
};
