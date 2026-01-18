import { useMutation } from '@tanstack/react-query';
import { CreateUserReviewData } from '../../../shared/types/models';
import { createUserReview } from '../services/user-review-service';

export interface CreateUserReviewMutationValues {
  indexId: number;
  createUserReviewData: CreateUserReviewData;
}

export const useCreateUserReviewMutation = () => {
  return useMutation({
    mutationFn: (mutationValues: CreateUserReviewMutationValues) =>
      createUserReview(mutationValues),
  });
};
