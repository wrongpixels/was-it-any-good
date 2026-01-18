import axios, { AxiosResponse } from 'axios';
import {
  UserReviewData,
  UserReviewResults,
} from '../../../shared/types/models';
import { apiPaths } from '../../../shared/util/url-builder';
import { CreateUserReviewMutationValues } from '../mutations/user-review-mutations';

export const getActiveUserReviewByIndexId = async (indexId: number) => {
  const { data: review }: AxiosResponse<UserReviewData | null> =
    await axios.get(apiPaths.my.userReviews.byIndexId(indexId));
  return review;
};

export const getUserReviewsByIndexId = async (indexId: number) => {
  const { data: reviews }: AxiosResponse<UserReviewResults> = await axios.get(
    apiPaths.userReviews.byIndexId(indexId)
  );
  return reviews;
};

export const createUserReview = async ({
  indexId,
  createUserReviewData,
}: CreateUserReviewMutationValues) => {
  const { data: newUserReview }: AxiosResponse<UserReviewData> =
    await axios.post(
      apiPaths.userReviews.byIndexId(indexId),
      createUserReviewData
    );
  return newUserReview;
};
