import { UserVote } from '../../../shared/types/common';
import {
  MediaResponse,
  SeasonResponse,
  ShowResponse,
} from '../../../shared/types/models';
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

export const addVoteToMedia = (
  media: MediaResponse,
  newRating: number,
  oldRating?: number
): MediaResponse => ({
  ...media,
  ...recalculateRating(newRating, media.rating, media.voteCount, oldRating),
});

export const addVoteToSeason = (
  media: SeasonResponse,
  newRating: number,
  oldRating?: number
): SeasonResponse => ({
  ...media,
  ...recalculateRating(newRating, media.rating, media.voteCount, oldRating),
});

export const removeVoteFromSeason = (
  media: SeasonResponse,
  oldRating: number
): SeasonResponse => ({
  ...media,
  ...recalculateRating(0, media.rating, media.voteCount, oldRating),
});

export const removeVoteFromMedia = (
  media: MediaResponse,
  oldRating: number
): MediaResponse => ({
  ...media,
  ...recalculateRating(0, media.rating, media.voteCount, oldRating),
});

export const recalculateRating = (
  userRating: number,
  currentRating: number,
  totalVotes: number,
  previousRating: number = 0
): NewMediaRating => {
  if (userRating === 0 && previousRating > 0) {
    if (totalVotes === 1) {
      return {
        rating: 0,
        voteCount: 0,
      };
    }
    const totalSum = currentRating * totalVotes;
    const newTotalVotes = totalVotes - 1;
    return {
      rating: (totalSum - previousRating) / newTotalVotes,
      voteCount: newTotalVotes,
    };
  }

  if (previousRating > 0) {
    const totalSum = currentRating * totalVotes;
    const newSum = totalSum - previousRating + userRating;
    return {
      rating: newSum / totalVotes,
      voteCount: totalVotes,
    };
  }

  const totalSum = currentRating * totalVotes;
  const newTotalVotes = totalVotes + 1;
  return {
    rating: (totalSum + userRating) / newTotalVotes,
    voteCount: newTotalVotes,
  };
};
export const numToVote = (num: number): UserVote => {
  return Math.max(-1, Math.min(num, 10));
};

export const calculateAverage = (
  media: MediaResponse | SeasonResponse
): number => {
  const globalAverage: number =
    media.rating > 0 ? media.rating : media.baseRating;
  return Math.round(globalAverage * 10) / 10;
};

//To create a weighted average for the 'show' as a whole, taking all seasons and
//their individual ratings into consideration
export const calculateShowAverage = (media: ShowResponse): number => {
  const globalAverage: number = calculateAverage(media);

  const SHOW_WEIGHT = 0.4;
  const SEASONS_WEIGHT = 0.6;

  if (!media.seasons || media.seasonCount === 0) {
    return globalAverage;
  }
  let validSeasons: SeasonResponse[] = [];
  media.seasons.map((s: SeasonResponse) =>
    s.baseRating > 0 || s.rating > 0 ? validSeasons.push(s) : null
  );
  const seasonsAverage =
    validSeasons.reduce(
      (sum, season) =>
        sum +
        (season.rating !== null && season.rating > 0
          ? Number(season.rating)
          : Number(season.baseRating)),
      0
    ) / validSeasons.length;
  //if the show itself has not been voted, we return the seasons
  if (seasonsAverage === 0) {
    return seasonsAverage;
  }
  //We round the result to only 1 decimal
  return seasonsAverage > 0
    ? Math.round(
        (globalAverage * SHOW_WEIGHT + seasonsAverage * SEASONS_WEIGHT) * 10
      ) / 10
    : globalAverage;
};
