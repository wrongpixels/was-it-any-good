import { UseQueryResult } from '@tanstack/react-query';

export const combineQueryResults = <TData>(
  results: UseQueryResult<TData, Error>[]
) => ({
  data: results.map((r) => r.data).filter((d): d is TData => d !== undefined),
  isAnyLoading: results.some((r) => r.isLoading),
  isAnyError: results.some((r) => r.isError),
  areAllLoading: results.every((r) => r.isLoading),
  areAllError: results.every((r) => r.isError),
});
