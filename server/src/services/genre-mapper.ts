import { TMDBGenreData } from '../schemas/film-schema';
import { CreateGenreData } from '../types/genres/genre-types';

export const mapTMDBGenres = (orGenres: TMDBGenreData[]): CreateGenreData[] => {
  const genreData: CreateGenreData[] = orGenres.map((g: TMDBGenreData) => ({
    name: g.name === 'Music' ? 'Musical' : g.name,
    tmdbId: g.id,
  }));
  return genreData;
};
