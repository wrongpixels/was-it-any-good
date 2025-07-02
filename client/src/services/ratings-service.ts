import axios, { AxiosResponse } from 'axios';
import {
  CheckRating,
  CreateRating,
  RatingData,
} from '../../../shared/types/models';
import { getById } from './common-service';

export const getRatingByMediaId = ({
  mediaId,
  mediaType,
}: CheckRating): Promise<RatingData> => {
  return getById<RatingData>(
    `ratings/match/${mediaType.toLowerCase()}`,
    mediaId
  );
};

export const voteMedia = async (rating: CreateRating): Promise<RatingData> => {
  const { data }: AxiosResponse<RatingData> = await axios.post(
    `/api/ratings`,
    rating
  );
  return data;
};

export const unvoteMedia = async (ratingId: number): Promise<AxiosResponse> => {
  return await axios.delete(`/api/ratings/${ratingId}`);
};
