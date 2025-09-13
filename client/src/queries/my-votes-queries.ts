import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getMyVotes } from '../services/my-votes-service';
import { IndexMediaResults } from '../../../shared/types/models';

export const useMyVotesQuery = (
  query: string
): UseQueryResult<IndexMediaResults, Error> => {
  console.log(query);
  return useQuery({
    queryKey: ['myVotes', query],
    queryFn: () => getMyVotes(query),
  });
};
