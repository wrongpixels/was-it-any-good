import { TMDBGenreData } from '../schemas/tmdb-media-schema';
import { CreateGenreData } from '../types/genres/genre-types';
import { MediaType } from '../types/media/media-types';

export const mapTMDBGenres = (
  orGenres: TMDBGenreData[],
  mediaType: MediaType
): CreateGenreData[] => {
  const genreData: CreateGenreData[] = orGenres.map((g: TMDBGenreData) => ({
    name: g.name === 'Music' ? 'Musical' : g.name,
    mediaId: g.id,
    mediaType,
  }));
  return genreData;
};
