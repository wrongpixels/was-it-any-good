import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getMyVotes } from '../services/my-votes-service';
import { RatingResults } from '../../../shared/types/models';

export const useMyVotesQuery = (
  query: string
): UseQueryResult<RatingResults, Error> => {
  console.log(query);
  return useQuery({
    queryKey: ['myVotes', query],
    queryFn: () => getMyVotes(query),
  });
};
