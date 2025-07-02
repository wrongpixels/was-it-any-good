import axios, { AxiosResponse } from 'axios';
import { CreateRatingData, RatingData } from '../../../shared/types/models';
import { getById } from './common-service';

export const getRatingByMediaId = (mediaId: number): Promise<RatingData> =>
  getById<RatingData>('ratings/match', mediaId);

export const voteMedia = async (
  rating: CreateRatingData
): Promise<RatingData> => {
  const { data }: AxiosResponse<RatingData> = await axios.post('/', rating);
  return data;
};
