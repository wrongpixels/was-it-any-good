import { MediaResponse } from '../../../shared/types/models';
import { MediaType } from '../../../shared/types/media';
import { getFromAPI } from './common-service';
import {
  BASE_IMDB_URL,
  BASE_TMDB_URL,
} from '../../../shared/constants/url-constants';
import { apiPaths } from '../../../shared/util/url-builder';

export const getMediaById = (
  id: string,
  mediaType: MediaType,
  slug?: string
): Promise<MediaResponse> => {
  const path = getMediaPath(mediaType);
  return getFromAPI<MediaResponse>(path.byId(id, slug));
};

export const getMediaByTMDBId = (
  id: string,
  mediaType: MediaType
): Promise<MediaResponse> => {
  const path = getMediaPath(mediaType);
  return getFromAPI<MediaResponse>(path.byTMDBId(id));
};

const getMediaPath = (mediaType: MediaType) => {
  switch (mediaType) {
    case MediaType.Film:
      return apiPaths.films;
    case MediaType.Show:
      return apiPaths.shows;
    default:
      throw new Error(`Unsupported media type: ${mediaType}`);
  }
};

export const buildTMDBorIMDBUrl = (
  mediaType: MediaType,
  tmdb: boolean,
  id: string | number
): string => {
  if (!id) {
    return '';
  }

  if (!tmdb) {
    return `${BASE_IMDB_URL}/${id}`;
  }
  return `${BASE_TMDB_URL}/${mediaType === MediaType.Film ? 'movie' : 'tv'}/${id}`;
};
