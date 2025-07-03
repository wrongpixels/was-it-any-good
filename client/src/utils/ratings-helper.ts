import { UserVote } from '../../../shared/types/common';
import { MediaType } from '../../../shared/types/media';
import { MediaResponse } from '../../../shared/types/models';

export const getRatingKey = (mediaType: string, mediaId: string | number) => [
  'rating',
  `${mediaType.toLowerCase()}-${mediaId}`,
];

export const numToVote = (num: number): UserVote => {
  return Math.max(-1, Math.min(num, 10));
};

//To create a weighted average for the 'show' as a whole, taking all seasons and
//their individual ratings into consideration
export const calculateAverage = (media: MediaResponse): number => {
  const globalAverage: number =
    media.rating > 0 ? media.rating : media.baseRating;

  if (media.mediaType !== MediaType.Show) {
    return globalAverage;
  }

  const SHOW_WEIGHT = 0.4;
  const SEASONS_WEIGHT = 0.6;

  if (!media.seasons || media.seasonCount === 0) {
    return globalAverage;
  }

  const seasonsAverage =
    media.seasons.reduce(
      (sum, season) =>
        sum +
        ((season.rating !== null && season.rating > 0
          ? Number(season.rating)
          : Number(season.baseRating)) || 0),
      0
    ) / media.seasonCount;
  //We round the result to only 1 decimal
  return seasonsAverage > 0
    ? Math.round(
        (globalAverage * SHOW_WEIGHT + seasonsAverage * SEASONS_WEIGHT) * 10
      ) / 10
    : globalAverage;
};
