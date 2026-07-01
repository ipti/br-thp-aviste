import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { schoolsApi } from '../api/schoolsApi';
import { toastService } from '../../../lib/toast';

const KEY = ['schools'];

export const useSchools = () =>
  useQuery({ queryKey: KEY, queryFn: schoolsApi.list });

export const useSchool = (id: number) =>
  useQuery({ queryKey: [...KEY, id], queryFn: () => schoolsApi.get(id), enabled: !!id });

export const useCreateSchool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: schoolsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toastService.success('Escola criada com sucesso');
    },
  });
};

export const useUpdateSchool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => schoolsApi.update(id, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toastService.success('Escola atualizada');
    },
  });
};

export const useSchoolStats = (id: number) =>
  useQuery({
    queryKey: [...KEY, id, 'stats'],
    queryFn: () => schoolsApi.getStats(id),
    enabled: !!id,
  });

export const useDeleteSchool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: schoolsApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toastService.success('Escola removida');
    },
  });
};
