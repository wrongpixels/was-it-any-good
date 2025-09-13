import { MediaType } from '../../../shared/types/media';
import { GenreResponse, IndexMediaData } from '../../../shared/types/models';
import { GenreUrlMap, genreUrlMapper } from './genre-mapper';

export const getMediaId = (indexMedia: IndexMediaData): number | null => {
  if (!indexMedia.addedToMedia) {
    return null;
  }
  switch (indexMedia.mediaType) {
    case MediaType.Film:
      return indexMedia.film?.id ?? null;

    case MediaType.Show:
      return indexMedia.show?.id ?? null;
    default:
      return null;
  }
};

export interface IndexGenreMap {
  genreUrlMap: GenreUrlMap[];
}

//we extract the genres (if present) from the linked film or show and
//build a map with the browse urls already baked. We only use first 3
//for spacing reasons
export const getMediaGenres = (
  indexMedia: IndexMediaData
): GenreUrlMap[] | null => {
  if (indexMedia.mediaType === MediaType.Season) {
    return null;
  }
  const isFilm: boolean = indexMedia.mediaType === MediaType.Film;
  const genres: GenreResponse[] | undefined = isFilm
    ? indexMedia.film?.genres?.slice(0, 2)
    : indexMedia.show?.genres?.slice(0, 2);
  if (genres === undefined) {
    return null;
  }
  const urlMap: GenreUrlMap[] = genreUrlMapper(genres, indexMedia.mediaType);
  return urlMap;
};
