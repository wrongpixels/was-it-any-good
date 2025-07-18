import { MediaType } from '../../../shared/types/media';
import { TMDBGenreData } from '../schemas/tmdb-media-schema';
import { CreateGenreData } from '../types/genres/genre-types';

export const mapTMDBGenres = (
  orGenres: TMDBGenreData[],
  mediaType: MediaType
): CreateGenreData[] => {
  const genreData: CreateGenreData[] = orGenres.map((g: TMDBGenreData) => ({
    name: g.name === 'Music' ? 'Musical' : g.name,
    tmdbId: mediaType === MediaType.Game ? undefined : g.id,
    gamedbId: mediaType === MediaType.Game ? g.id : undefined,
  }));
  return genreData;
};
