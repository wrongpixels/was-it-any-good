import { QueryClient } from '@tanstack/react-query';

let queryClient: QueryClient | undefined = undefined;

export const createQueryClient = (): QueryClient => {
  queryClient = new QueryClient();
  return queryClient;
};

export const getQueryClient = (): QueryClient =>
  queryClient ?? createQueryClient();
