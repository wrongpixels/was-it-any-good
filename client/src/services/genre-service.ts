import { GenreResponse } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { getFromAPI } from './common-service';

export const getGenreById = async (genreId: number) =>
  getFromAPI<GenreResponse>(apiPaths.genres.byId(genreId));
