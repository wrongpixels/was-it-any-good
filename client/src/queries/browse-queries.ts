import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getBrowseResults } from '../services/browse-service';
import { IndexMediaResults } from '../../../shared/types/models';
import { QUERY_KEY_BROWSE } from '../constants/tanstack-key-constants';

export const useBrowseQuery = (
  query: string
): UseQueryResult<IndexMediaResults, Error> => {
  return useQuery({
    queryKey: [QUERY_KEY_BROWSE, query],
    queryFn: () => getBrowseResults(query),
  });
};
