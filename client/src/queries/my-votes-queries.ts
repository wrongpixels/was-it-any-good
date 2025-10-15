import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getMyVotes } from '../services/my-votes-service';
import { RatingResults } from '../../../shared/types/models';
import { QUERY_KEY_MY_VOTES } from '../constants/query-key-constants';

export const useMyVotesQuery = (
  query: string
): UseQueryResult<RatingResults, Error> => {
  console.log(query);
  return useQuery({
    queryKey: [QUERY_KEY_MY_VOTES, query],
    retry: false,
    queryFn: () => getMyVotes(query),
  });
};
