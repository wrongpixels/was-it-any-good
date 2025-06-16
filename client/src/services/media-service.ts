import axios, { AxiosResponse } from 'axios';
import { MediaResponse } from '../../../shared/types/models';
import { MediaType } from '../../../shared/types/media';

const BASE_API_URL: string = '/api';

const getMediaApiURL = (mediaType: MediaType): string => {
  switch (mediaType) {
    case MediaType.Film:
      return `${BASE_API_URL}/films`;
    case MediaType.Show:
      return `${BASE_API_URL}/shows`;
    case MediaType.Game:
      return `${BASE_API_URL}/games`;
    default:
      throw new Error(`Unsupported media type: ${mediaType}`);
  }
};
const buildAPIMediaURL = (
  mediaType: MediaType,
  id: string,
  path: string = '/'
): string => `${getMediaApiURL(mediaType)}${path}${id}`;

const getMediaURL = (mediaType: MediaType, tmdb: boolean = false): string => {
  const path: string = tmdb ? '/tmdb' : '';
  switch (mediaType) {
    case MediaType.Film:
      return `${path}/film`;
    case MediaType.Show:
      return `${path}/show`;
    case MediaType.Game:
      return `${path}/game`;
    default:
      throw new Error(`Unsupported media type: ${mediaType}`);
  }
};

export const buildMediaURL = (
  mediaType: MediaType,
  tmdb: boolean = false
): string => getMediaURL(mediaType, tmdb);

export const getById = async (
  id: string,
  mediaType: MediaType
): Promise<MediaResponse | null> => {
  try {
    const response: AxiosResponse<MediaResponse> =
      await axios.get<MediaResponse>(buildAPIMediaURL(mediaType, id));
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${mediaType} with id ${id}:`, error);
    return null;
  }
};

export const getByTMDBId = async (
  id: string,
  mediaType: MediaType
): Promise<MediaResponse | null> => {
  try {
    const response: AxiosResponse<MediaResponse> =
      await axios.get<MediaResponse>(buildAPIMediaURL(mediaType, id, '/tmdb/'));
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${mediaType} with TMDBId ${id}:`, error);
    return null;
  }
};
