import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi, type CreateUserData } from '../api/usersApi';
import { toastService } from '../../../lib/toast';

const KEY = ['users'];

export const useUsers = () => useQuery({ queryKey: KEY, queryFn: usersApi.list });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserData) => usersApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toastService.success('Usuário criado com sucesso');
    },
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateUserData> }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toastService.success('Usuário atualizado');
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toastService.success('Usuário removido');
    },
  });
};

export const useAddUserSchool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, schoolId }: { id: number; schoolId: number }) =>
      usersApi.addSchool(id, schoolId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toastService.success('Escola vinculada ao usuário');
    },
  });
};

export const useRemoveUserSchool = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, schoolId }: { id: number; schoolId: number }) =>
      usersApi.removeSchool(id, schoolId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toastService.success('Escola removida do usuário');
    },
  });
};
