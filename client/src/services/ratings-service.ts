import { RatingData } from '../../../shared/types/models';
import { getById } from './common-service';

export const getRatingByMediaId = (mediaId: number): Promise<RatingData> =>
  getById<RatingData>('ratings/match', mediaId);
