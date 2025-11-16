import { formatRatingDate } from '../../../shared/helpers/format-helper';
import { UserVote } from '../../../shared/types/common';
import { MediaType } from '../../../shared/types/media';
import {
  IndexMediaData,
  MediaResponse,
  RatingData,
  SeasonResponse,
} from '../../../shared/types/models';
import {
  getRatingInMedia,
  getAnyMediaRating,
} from '../../../shared/util/rating-average-calculator';
import {
  QUERY_KEY_MEDIA,
  QUERY_KEY_RATING,
  QUERY_KEY_TMDB_MEDIA,
} from '../constants/query-key-constants';
import { NO_RATINGS, NOT_RELEASED } from '../constants/ratings-constants';
import { buildPathUrl } from './url-helper';
import { isUnreleased } from '../../../shared/helpers/media-helper';

export const getRatingKey = (mediaType: string, mediaId: string | number) => [
  QUERY_KEY_RATING,
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
): string[] => {
  const isTmdb: boolean =
    tmdb === undefined
      ? buildPathUrl().includes(`tmdb/${mediaType.toLowerCase()}/${mediaId}`)
      : tmdb;
  return [
    isTmdb ? QUERY_KEY_TMDB_MEDIA : QUERY_KEY_MEDIA,
    mediaType,
    String(mediaId),
  ];
};

export const getMediaKey = (mediaType: string, mediaId: string | number) => [
  QUERY_KEY_MEDIA,
  mediaType,
  String(mediaId),
];

export const getTmdbMediaKey = (
  mediaType: string,
  tmdbId: string | number = -1
): string[] => [QUERY_KEY_TMDB_MEDIA, mediaType, String(tmdbId)];

export const addVoteToMedia = (
  media: MediaResponse,
  newRating: number,
  removeFromWatchlist?: boolean
): MediaResponse => ({
  ...media,
  userWatchlist: removeFromWatchlist ? undefined : media.userWatchlist,
  ...recalculateRating(
    newRating,
    getRatingInMedia(media),
    media.voteCount,
    media.userRating?.userScore
  ),
  userRating: updateUserRating(media.userRating, newRating, media),
});

export const addVoteToSeason = (
  media: SeasonResponse,
  newRating: number,
  removeFromWatchlist?: boolean
): SeasonResponse => ({
  ...media,
  userWatchlist: removeFromWatchlist ? undefined : media.userWatchlist,

  ...recalculateRating(
    newRating,
    getRatingInMedia(media),
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
      indexId: media.indexId,
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
    getRatingInMedia(media),
    media.voteCount,
    media.userRating?.userScore
  ),
  userRating: null,
});

export const removeVoteFromMedia = (media: MediaResponse): MediaResponse => ({
  ...media,
  ...recalculateRating(
    0,
    getRatingInMedia(media),
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
  console.log(
    'User voted a',
    userRating,
    '\ncurrent rating is',
    currentRating,
    '\nprevious rating was rating is',
    previousRating,
    '\ntotal votes are',
    totalVotes
  );
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
      rating: roundToServerDecimals(
        (totalSum - previousRating) / newTotalVotes
      ),
      voteCount: newTotalVotes,
    };
  }

  if (previousRating > 0) {
    const totalSum = currentRating * totalVotes;
    const newSum = totalSum - previousRating + userRating;

    return {
      rating: roundToServerDecimals(newSum / totalVotes),
      voteCount: totalVotes,
    };
  }
  console.log('previous rating ', currentRating);
  const totalSum = currentRating * totalVotes;
  const newTotalVotes = firstVote ? 1 : totalVotes + 1;
  // console.log(totalSum, firstVote, newTotalVotes, totalVotes);
  console.log('Votes are ', newTotalVotes);

  return {
    rating: roundToServerDecimals((totalSum + userRating) / newTotalVotes),
    voteCount: newTotalVotes,
  };
};
export const numToVote = (num: number): UserVote => {
  return Math.max(-1, Math.min(num, 10));
};

//for the final display with only one decimal
export const roundToOneDecimal = (value: number) => Math.round(value * 10) / 10;

//the server stores a max of 4 decimals, so we round our calculation to match what we should receive
//from the server
export const roundToServerDecimals = (value: number) =>
  Math.round(value * 10000) / 10000;

//the final rounded version to display on the client
export const getAnyMediaDisplayRating = (
  media: MediaResponse | SeasonResponse | IndexMediaData
): number => roundToOneDecimal(getAnyMediaRating(media));

export const getIndexMediaUserRating = (
  indexMedia: IndexMediaData
): RatingData | undefined =>
  indexMedia.mediaType === MediaType.Film
    ? (indexMedia.film?.userRating ?? undefined)
    : (indexMedia.show?.userRating ?? undefined);

export interface CardRatingData {
  hasRatingText: boolean;
  unreleased: boolean;
  ratingText: string;
  ratingTitle: string;
}
//to get the appropriate placeholder text when a media is not released or not voted
export const getCardRatingData = (
  mediaReleaseDate: string | null,
  rating: number,
  userRating?: RatingData | null,
  isVote: boolean = false
): CardRatingData => {
  const releaseDate: Date | null = !mediaReleaseDate
    ? null
    : new Date(mediaReleaseDate);
  const unreleased: boolean = isUnreleased(mediaReleaseDate);
  const hasRatingText: boolean = rating <= 0 || unreleased;
  const ratingText: string = unreleased
    ? !releaseDate
      ? NOT_RELEASED
      : `Coming ${formatRatingDate(releaseDate)}`
    : NO_RATINGS;

  const ratingTitle: string = isVote
    ? `You voted: ${rating}`
    : `WIAG score: ${rating}`;
  const userRatingTitle: string = userRating
    ? `\nYour rating: ${userRating.userScore}`
    : '';
  return {
    hasRatingText,
    unreleased,
    ratingText,
    ratingTitle: `${ratingTitle}${userRatingTitle}`,
  };
};
