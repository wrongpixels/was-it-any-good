import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getPersonById } from '../services/people-service';
import { PersonResponse } from '../../../shared/types/models';

export const usePersonQuery = (
  id: string | undefined
): UseQueryResult<PersonResponse, Error> =>
  useQuery({
    queryKey: ['people', `${id}`],
    retry: false,
    queryFn: () => getPersonById(id!),
    enabled: !!id,
  });
