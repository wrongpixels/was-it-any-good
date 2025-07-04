import { QueryClient } from '@tanstack/react-query';
import { MediaType } from '../../../shared/types/media';
import {
  CreateRating,
  MediaResponse,
  RatingData,
  SeasonResponse,
} from '../../../shared/types/models';
import {
  getMediaKey,
  getRatingKey,
  getTmdbMediaKey,
} from '../utils/ratings-helper';

export interface MediaQueryManager {
  rating: RatingData | undefined;
  media: MediaResponse | undefined;
  seasonMedia: SeasonResponse | undefined;
  ratingQueryKey: string[];
  mediaQueryKey: string[];
  setMedia: (media: MediaResponse) => void;
  setRating: (media: CreateRating) => void;
}
export const useMediaQueryManager = (
  queryClient: QueryClient,
  mediaType: MediaType,
  mediaId: number | string,
  seasonId?: number | string
): MediaQueryManager => {
  const isSeason: boolean =
    mediaType === MediaType.Season && seasonId !== undefined;
  const ratingQueryKey: string[] = getRatingKey(mediaType, mediaId);
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
  const setMedia = (media: MediaResponse) => {
    queryClient.setQueryData(mediaQueryKey, { ...media });
    queryClient.setQueryData(tmdbMediaQueryKey, { ...media });
    console.log('setting ', media.rating);
  };
  const setRating = (rating: CreateRating) =>
    queryClient.setQueryData(ratingQueryKey, rating);

  return {
    rating,
    media,
    setMedia,
    setRating,
    ratingQueryKey,
    mediaQueryKey,
    seasonMedia,
  };
};
