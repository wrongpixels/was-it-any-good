import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getBrowseResults } from '../services/browse-service';
import { IndexMediaResponse } from '../../../shared/types/models';

export const useBrowseQuery = (
  query: string
): UseQueryResult<IndexMediaResponse, Error> => {
  return useQuery({
    queryKey: ['browse', query],
    queryFn: () => getBrowseResults(query),
  });
};
