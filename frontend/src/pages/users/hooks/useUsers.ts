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
