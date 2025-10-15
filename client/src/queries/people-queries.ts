import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getPersonById } from '../services/people-service';
import { PersonResponse } from '../../../shared/types/models';
import { QUERY_KEY_PEOPLE } from '../constants/query-key-constants';

export const usePersonQuery = (
  id: string | undefined
): UseQueryResult<PersonResponse, Error> =>
  useQuery({
    queryKey: [QUERY_KEY_PEOPLE, `${id}`],
    retry: false,
    queryFn: () => getPersonById(id!),
    enabled: !!id,
  });
