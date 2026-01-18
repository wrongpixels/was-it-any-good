import axios, { AxiosResponse } from 'axios';
import { UserReviewData } from '../../../shared/types/models';
import { apiPaths } from '../../../shared/util/url-builder';
import { CreateUserReviewMutationValues } from '../mutations/user-review-mutations';

export const createUserReview = async ({
  indexId,
  createUserReviewData,
}: CreateUserReviewMutationValues) => {
  const { data: newUserReview }: AxiosResponse<UserReviewData> =
    await axios.post(
      apiPaths.userReviews.createByIndexId(indexId),
      createUserReviewData
    );
  return newUserReview;
};
