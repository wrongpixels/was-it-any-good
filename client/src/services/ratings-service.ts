import axios, { AxiosResponse } from 'axios';
import {
  CheckRating,
  CreateRating,
  RatingData,
  CreateRatingResponse,
} from '../../../shared/types/models';
import { getFromAPI } from './common-service';
import { apiPaths } from '../utils/url-helper';

export const getRatingByMediaId = ({
  mediaId,
  mediaType,
}: CheckRating): Promise<RatingData> => {
  return getFromAPI<RatingData>(apiPaths.ratings.matchById(mediaType, mediaId));
};

export const voteMedia = async (
  rating: CreateRating
): Promise<CreateRatingResponse> => {
  const { data }: AxiosResponse<CreateRatingResponse> = await axios.post(
    apiPaths.ratings.base,
    rating
  );
  return data;
};

export const unvoteMedia = async (ratingId: number): Promise<AxiosResponse> => {
  const { data } = await axios.delete(apiPaths.ratings.byId(ratingId));
  return data;
};
