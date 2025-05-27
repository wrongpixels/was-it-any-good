import { CreateGenreData } from '../types/genres/genre-types';
import { TMDBGenreData } from '../types/media/tmdb-types';
import { TVDBGenreData } from '../types/media/tvdb-types';

export const mapTMDBGenres = (orGenres: TMDBGenreData[]): CreateGenreData[] => {
  const genreData: CreateGenreData[] = orGenres.map((g: TMDBGenreData) => ({
    name: g.name === 'Music' ? 'Musical' : g.name,
    tmdbId: g.id,
  }));
  console.log(genreData);
  return genreData;
};

export const mapTVDBGenres = (orGenres: TVDBGenreData[]): CreateGenreData[] => {
  const genreData: CreateGenreData[] = orGenres.map((g: TVDBGenreData) => ({
    name: g.name,
    tvdbId: g.id,
  }));
  return genreData;
};
