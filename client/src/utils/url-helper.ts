import { MediaType } from '../../../shared/types/media';
import { TMDB_URL } from '../../../shared/constants/url-constants';

export const buildOwnUrl = (path: string = ''): string =>
  `${window.location.origin}${path}`;

export const buildTMDBUrl = (
  mediaType: MediaType,
  path: string = ''
): string => {
  const url = TMDB_URL;
  const prefix: string = mediaType === MediaType.Show ? 'tv' : 'movie';
  return `${url}/${prefix}/${path}`;
};
