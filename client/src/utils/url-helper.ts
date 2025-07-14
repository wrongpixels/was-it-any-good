import { MediaType } from '../../../shared/types/media';
import { TMDB_URL } from '../../../shared/constants/url-constants';
import { API_BASE } from '../constants/url-constants';

export const apiPaths = {
  films: {
    base: `${API_BASE}/films`,
    byId: (id: number | string) => `${apiPaths.films.base}/${id}`,
    byTMDBId: (id: number | string) => `${apiPaths.films.base}/tmdb/${id}`,
  },
  shows: {
    base: `${API_BASE}/shows`,
    byId: (id: number | string) => `${apiPaths.shows.base}/${id}`,
    byTMDBId: (id: number | string) => `${apiPaths.shows.base}/tmdb/${id}`,
  },
  people: {
    base: `${API_BASE}/people`,
    byId: (id: number | string) => `${apiPaths.people.base}/${id}`,
  },
  ratings: {
    base: `${API_BASE}/ratings`,
    matchById: (mediaType: MediaType, id: number) =>
      `${apiPaths.ratings.base}/match/${mediaType.toLowerCase()}/${id}}`,
    byId: (id: number | string) => `${apiPaths.ratings.base}/${id}`,
  },
  users: {
    base: `${API_BASE}/users`,
    byId: (id: number | string) => `${apiPaths.users.base}/${id}`,
  },
  auth: {
    base: `${API_BASE}/auth`,
    login: () => `${apiPaths.auth.base}/login`,
    logout: () => `${apiPaths.auth.base}/logout`,
    sessions: {
      base: () => `${apiPaths.auth.base}/sessions`,
      verify: () => `${apiPaths.auth.sessions.base}/verify`,
    },
  },
  suggestions: {
    base: `${API_BASE}/suggest`,
    byInput: (input: string) =>
      `${apiPaths.suggestions.base}?${new URLSearchParams({ query: input })}`,
  },
};

export const buildOwnUrl = (path: string = ''): string =>
  `${window.location.origin}${path}`;

export const buildPathUrl = (path: string = ''): string =>
  `${window.location.pathname}${path}`;

export const buildTMDBUrl = (
  mediaType: MediaType,
  path: string = ''
): string => {
  const url = TMDB_URL;
  const prefix: string = mediaType === MediaType.Show ? 'tv' : 'movie';
  return `${url}/${prefix}/${path}`;
};
