import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSuggestions } from '../services/suggestions-service';
import { IndexMediaData } from '../../../shared/types/models';
import { QUERY_KEY_SUGGESTIONS } from '../constants/query-key-constants';

export const useSuggestionsQuery = (
  input: string,
  disabled: boolean = false
): UseQueryResult<IndexMediaData[], Error> => {
  return useQuery({
    queryKey: [QUERY_KEY_SUGGESTIONS, input],
    queryFn: () => getSuggestions(input),
    enabled: !!input && input !== '' && !disabled,
  });
};
