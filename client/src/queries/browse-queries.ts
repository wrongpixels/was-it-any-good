import { useQuery } from '@tanstack/react-query';
import { getBrowseResults } from '../services/browse-service';

export const useBrowseQuery = (query: string) => {
  return useQuery({
    queryKey: ['browse', query],
    queryFn: () => getBrowseResults(query),
  });
};
