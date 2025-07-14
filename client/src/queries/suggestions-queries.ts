import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSuggestions } from '../services/suggestions-service';
import { IndexMediaData } from '../../../shared/types/models';

export const useSuggestionsQuery = (
  input: string
): UseQueryResult<IndexMediaData[], Error> =>
  useQuery({
    queryKey: ['suggest', input],
    queryFn: () => getSuggestions(input),
    enabled: !!input,
  });
