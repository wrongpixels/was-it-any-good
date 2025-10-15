import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSuggestions } from '../services/suggestions-service';
import { IndexMediaData } from '../../../shared/types/models';
import { QUERY_KEY_SUGGESTIONS } from '../constants/tanstack-key-constants';

export const useSuggestionsQuery = (
  input: string
): UseQueryResult<IndexMediaData[], Error> =>
  useQuery({
    queryKey: [QUERY_KEY_SUGGESTIONS, input],
    queryFn: () => getSuggestions(input),
    enabled: !!input,
  });
