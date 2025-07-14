import { useQuery } from '@tanstack/react-query';

export const useSuggestionsQuery = (input: string) =>
  useQuery({
    queryKey: ['suggest', input],
  });
