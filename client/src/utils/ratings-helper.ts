import { UserVote } from '../../../shared/types/common';
import { MediaType } from '../../../shared/types/media';
import { MediaResponse } from '../../../shared/types/models';
import { buildPathUrl } from './url-helper';

export const getRatingKey = (mediaType: string, mediaId: string | number) => [
  'rating',
  `${mediaType.toLowerCase()}-${mediaId}`,
];

export interface NewMediaRating {
  rating: number;
  voteCount: number;
}

export const getActiveMediaKey = (
  mediaType: string,
  mediaId: string | number,
  tmdb?: boolean
) => {
  const isTmdb: boolean =
    tmdb === undefined
      ? buildPathUrl().includes(`tmdb/${mediaType.toLowerCase()}/${mediaId}`)
      : tmdb;
  return [isTmdb ? 'tmdbMedia' : 'media', mediaType, String(mediaId)];
};

export const getMediaKey = (mediaType: string, mediaId: string | number) => [
  'media',
  mediaType,
  String(mediaId),
];

export const getTmdbMediaKey = (
  mediaType: string,
  tmdbId: string | number = -1
) => ['tmdbMedia', mediaType, String(tmdbId)];

export const recalculateRating = (
  userRating: number,
  currentRating: number,
  totalVotes: number,
  previousRating: number = 0
): NewMediaRating => {
  if (previousRating > 0) {
    const totalSum = currentRating * totalVotes;
    const newSum = totalSum - previousRating + userRating;
    return {
      rating: newSum / totalVotes,
      voteCount: totalVotes,
    };
  } else {
    const totalSum = currentRating * totalVotes;
    const newTotalVotes = totalVotes + 1;
    return {
      rating: (totalSum + userRating) / newTotalVotes,
      voteCount: newTotalVotes,
    };
  }
};
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
