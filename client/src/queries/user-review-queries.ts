import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  QUERY_KEY_ACTIVE_USER_REVIEW,
  QUERY_KEY_USER_REVIEWS,
} from '../constants/query-key-constants';
import {
  getActiveUserReviewByIndexId,
  getUserReviewsByIndexId,
} from '../services/user-review-service';
import {
  UserReviewData,
  UserReviewResults,
} from '../../../shared/types/models';

export const useUserReviewsByIndexIdQuery = (
  indexId: number
): UseQueryResult<UserReviewResults, Error> => {
  return useQuery({
    queryKey: [QUERY_KEY_USER_REVIEWS, indexId],
    queryFn: () => getUserReviewsByIndexId(indexId),
    enabled: !!indexId,
  });
};

export const useActiveUserReviewByIndexIdQuery = (
  indexId: number
): UseQueryResult<UserReviewData | null, Error> => {
  return useQuery({
    queryKey: [QUERY_KEY_ACTIVE_USER_REVIEW, indexId],
    queryFn: () => getActiveUserReviewByIndexId(indexId),
    enabled: !!indexId,
  });
};
