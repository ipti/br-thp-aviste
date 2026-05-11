import { useQuery } from '@tanstack/react-query';
import { consultationsApi } from '../api/consultationsApi';

export const useConsultations = (schoolId?: number) =>
  useQuery({
    queryKey: ['consultations', schoolId],
    queryFn: () => consultationsApi.list(schoolId),
  });
