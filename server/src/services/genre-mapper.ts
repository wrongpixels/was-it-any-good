import { TMDBGenreData } from '../schemas/tmdb-media-schema';
import { CreateGenreData } from '../types/genres/genre-types';

export const mapTMDBGenres = (
  orGenres: TMDBGenreData[]
  // mediaType: MediaType
): CreateGenreData[] => {
  const genreData: CreateGenreData[] = orGenres.map((g: TMDBGenreData) => ({
    name: g.name === 'Music' ? 'Musical' : g.name,
    tmdbId: g.id,
    gamedbId: undefined,
  }));
  return genreData;
};
