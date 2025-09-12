import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getBrowseResults } from '../services/browse-service';
import { IndexMediaResults } from '../../../shared/types/models';

export const useBrowseQuery = (
  query: string
): UseQueryResult<IndexMediaResults, Error> => {
  return useQuery({
    queryKey: ['browse', query],
    queryFn: () => getBrowseResults(query),
  });
};
