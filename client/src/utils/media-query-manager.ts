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
}

export interface RatingQueryValues {
  queryClient: QueryClient;
  rating: CreateRatingMutation;
}

export interface MediaQueryValues {
  queryClient: QueryClient;
  mediaType: MediaType;
  mediaId: number | string;
  seasonId?: number | string;
}

export const useRatingQueryManager = ({
  queryClient,
  rating,
}: RatingQueryValues): MediaQueryManager =>
  useMediaQueryManager({
    queryClient,
    mediaId: rating.mediaId,
    seasonId: rating.seasonId,
    mediaType: rating.mediaType,
  });

export const useMediaQueryManager = ({
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

  const tmdbMediaQueryKey: string[] =
    media !== undefined
      ? getTmdbMediaKey(isSeason ? MediaType.Show : mediaType, media.tmdbId)
      : [''];

  const setRating = (rating: CreateRating | null) =>
    queryClient.setQueryData(ratingQueryKey, rating);

  const setMedia = (media: MediaResponse) => {
    queryClient.setQueryData(mediaQueryKey, { ...media });
    queryClient.setQueryData(tmdbMediaQueryKey, { ...media });
    console.log('setting ', media.rating);
  };

  const setSeason = (season: SeasonResponse) => {
    if (!season || media?.mediaType !== MediaType.Show) {
      return;
    }
    const updatedMedia: ShowResponse = addOrReplaceSeason(season, media);
    setMedia(updatedMedia);
  };

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
  };
};
