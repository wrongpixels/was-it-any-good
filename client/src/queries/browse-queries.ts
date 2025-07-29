import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getBrowseResults } from '../services/browse-service';
import { BrowseResponse } from '../../../shared/types/models';

export const useBrowseQuery = (
  query: string
): UseQueryResult<BrowseResponse, Error> => {
  return useQuery({
    queryKey: ['browse', query],
    queryFn: () => getBrowseResults(query),
  });
};
