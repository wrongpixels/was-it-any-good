import { useQuery } from '@tanstack/react-query';

export const useSearchQuery = (searchQuery: string) => {
  useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => {},
    enabled: !!searchQuery,
  });
};
