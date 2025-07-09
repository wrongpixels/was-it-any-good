import { QueryClient } from '@tanstack/react-query';
import { MediaType } from '../../../shared/types/media';
import {
  CreateRating,
  CreateRatingMutation,
  MediaResponse,
  RatingData,
  SeasonResponse,
  ShowResponse,
} from '../../../shared/types/models';
import {
  getMediaKey,
  getRatingKey,
  getTmdbMediaKey,
} from '../utils/ratings-helper';
import { addOrReplaceSeason } from './media-helper';

export interface MediaQueryManager {
  rating: RatingData | undefined;
  media: MediaResponse | undefined;
  seasonMedia: SeasonResponse | undefined;
  ratingQueryKey: string[];
  mediaQueryKey: string[];
  isSeason: boolean;
  setMedia: (media: MediaResponse) => void;
  setRating: (rating: CreateRating | null) => void;
  setSeason: (media: SeasonResponse) => void;
  invalidateRating: VoidFunction;
  invalidateMedia: VoidFunction;
}

interface RatingQueryValues {
  queryClient: QueryClient;
  rating: CreateRatingMutation;
}

interface MediaQueryValues {
  queryClient: QueryClient;
  mediaType: MediaType;
  mediaId: number | string;
  seasonId?: number | string;
}

export const createRatingQueryManager = ({
  queryClient,
  rating,
}: RatingQueryValues): MediaQueryManager =>
  createMediaQueryManager({
    queryClient,
    mediaId: rating.mediaId,
    seasonId: rating.seasonId,
    mediaType: rating.mediaType,
  });

export const createMediaQueryManager = ({
  queryClient,
  mediaType,
  mediaId,
  seasonId,
}: MediaQueryValues): MediaQueryManager => {
  const isSeason: boolean =
    mediaType === MediaType.Season && seasonId !== undefined;

  const ratingQueryKey: string[] = getRatingKey(
    mediaType,
    isSeason ? seasonId! : mediaId
  );
  const rating: RatingData | undefined =
    queryClient.getQueryData(ratingQueryKey);

  const mediaQueryKey: string[] = getMediaKey(
    isSeason ? MediaType.Show : mediaType,
    mediaId
  );

  const media: MediaResponse | undefined =
    queryClient.getQueryData(mediaQueryKey);

  const seasonMedia: SeasonResponse | undefined =
    isSeason && media?.mediaType === MediaType.Show
      ? media.seasons?.find((s: SeasonResponse) => s.id === Number(seasonId))
      : undefined;

  const tmdbMediaQueryKey: string[] | undefined =
    media !== undefined
      ? getTmdbMediaKey(isSeason ? MediaType.Show : mediaType, media.tmdbId)
      : undefined;

  const setRating = (rating: CreateRating | null) =>
    queryClient.setQueryData(ratingQueryKey, rating);

  const setMedia = (media: MediaResponse) => {
    queryClient.setQueryData(mediaQueryKey, { ...media });
    if (tmdbMediaQueryKey) {
      queryClient.setQueryData(tmdbMediaQueryKey, { ...media });
    }
  };

  const setSeason = (season: SeasonResponse) => {
    if (!season || media?.mediaType !== MediaType.Show) {
      return;
    }
    const updatedMedia: ShowResponse = addOrReplaceSeason(season, media);
    setMedia(updatedMedia);
  };

  const invalidateRating = () =>
    queryClient.invalidateQueries({ queryKey: ratingQueryKey });
  const invalidateMedia = () =>
    queryClient.invalidateQueries({
      queryKey: [mediaQueryKey, tmdbMediaQueryKey],
    });

  return {
    rating,
    media,
    setMedia,
    setRating,
    setSeason,
    ratingQueryKey,
    mediaQueryKey,
    seasonMedia,
    isSeason,
    invalidateMedia,
    invalidateRating,
  };
};
