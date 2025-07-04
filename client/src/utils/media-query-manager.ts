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
  id: number | string,
  seasonId?: number | string
): MediaQueryManager => {
  const ratingQueryKey: string[] = getRatingKey(mediaType, id);
  const rating: RatingData | undefined =
    queryClient.getQueryData(ratingQueryKey);
  const mediaQueryKey: string[] = getMediaKey(mediaType, id);
  const media: MediaResponse | undefined =
    queryClient.getQueryData(mediaQueryKey);
  if (mediaType === MediaType.Season) {
    console.log(media);
  }
  const tmdbMediaQueryKey: string[] =
    media !== undefined ? getTmdbMediaKey(mediaType, media.tmdbId) : [''];
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
    seasonMedia: undefined,
  };
};
