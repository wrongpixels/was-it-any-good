import { UserVote } from '../../../shared/types/common';
import {
  IndexMediaData,
  MediaResponse,
  RatingData,
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
  newRating: number
): MediaResponse => ({
  ...media,
  ...recalculateRating(
    newRating,
    getMediaCurrentRating(media),
    media.voteCount,
    media.userRating?.userScore
  ),
  userRating: updateUserRating(media.userRating, newRating, media),
});

export const addVoteToSeason = (
  media: SeasonResponse,
  newRating: number
): SeasonResponse => ({
  ...media,
  ...recalculateRating(
    newRating,
    getMediaCurrentRating(media),
    media.voteCount,
    media.userRating?.userScore
  ),
  userRating: updateUserRating(media.userRating, newRating, media),
});

const updateUserRating = (
  rating: RatingData | null | undefined,
  newScore: number,
  media: SeasonResponse | MediaResponse
): RatingData | null => {
  //if no rating yet, we create a temporary one until the server returns the
  //real one
  if (!rating) {
    rating = {
      id: -1,
      userId: -1,
      userScore: newScore,
      mediaId: media.id,
      mediaType: media.mediaType,
    };
  }
  return { ...rating, userScore: newScore };
};

export const removeVoteFromSeason = (
  media: SeasonResponse
): SeasonResponse => ({
  ...media,
  ...recalculateRating(
    0,
    getMediaCurrentRating(media),
    media.voteCount,
    media.userRating?.userScore
  ),
  userRating: null,
});

export const removeVoteFromMedia = (media: MediaResponse): MediaResponse => ({
  ...media,
  ...recalculateRating(
    0,
    getMediaCurrentRating(media),
    media.voteCount,
    media.userRating?.userScore
  ),
  userRating: null,
});

export const recalculateRating = (
  userRating: number,
  currentRating: number,
  totalVotes: number,
  previousRating: number = 0
): NewMediaRating => {
  console.log(1);
  console.log(userRating, currentRating, previousRating, totalVotes);
  const firstVote: boolean = totalVotes === 0;

  if (userRating === 0 && previousRating > 0) {
    console.log('Should not be here');
    if (totalVotes === 1) {
      return {
        rating: 0,
        voteCount: 0,
      };
    }
    const totalSum = currentRating * totalVotes;
    const newTotalVotes = totalVotes - 1;
    console.log(totalSum, newTotalVotes, previousRating);
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
  console.log('previous rating ', currentRating);
  const totalSum = currentRating * totalVotes;
  const newTotalVotes = firstVote ? 1 : totalVotes + 1;
  // console.log(totalSum, firstVote, newTotalVotes, totalVotes);
  console.log('Votes are ', newTotalVotes);

  return {
    rating: (totalSum + userRating) / newTotalVotes,
    voteCount: newTotalVotes,
  };
};
export const numToVote = (num: number): UserVote => {
  return Math.max(-1, Math.min(num, 10));
};

export const isIndexMedia = (
  media: MediaResponse | SeasonResponse | IndexMediaData
): media is IndexMediaData => 'addedToMedia' in media;

export const isShow = (
  media: MediaResponse | SeasonResponse | IndexMediaData
): media is ShowResponse => 'seasonCount' in media;

export const getMediaAverageRating = (
  media: MediaResponse | SeasonResponse | IndexMediaData
): number => {
  if (isShow(media)) {
    return calculateShowAverage(media);
  }
  return calculateAverage(media);
};

export const getMediaCurrentRating = (
  media: MediaResponse | SeasonResponse | IndexMediaData
): number => (media.rating > 0 ? media.rating : media.baseRating);

export const calculateAverage = (
  media: MediaResponse | SeasonResponse | IndexMediaData
): number => {
  const globalAverage: number = getMediaCurrentRating(media);
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
  if (globalAverage === 0 && seasonsAverage) {
    return Math.round(seasonsAverage * 10) / 10;
  }

  //We round the result to only 1 decimal
  return seasonsAverage > 0
    ? Math.round(
        (globalAverage * SHOW_WEIGHT + seasonsAverage * SEASONS_WEIGHT) * 10
      ) / 10
    : globalAverage;
};
