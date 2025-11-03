import { MediaType } from '../../../shared/types/media';
import { GenreResponse, IndexMediaData } from '../../../shared/types/models';
import { GenreUrlMap, genreUrlMapper } from './genre-mapper';

export interface IndexGenreMap {
  genreUrlMap: GenreUrlMap[];
}

//we extract the genres (if present) from the linked film or show and
//build a map with the browse urls already baked. We'll only use first 3
//for spacing reasons
export const getIndexMediaGenresAsUrlMap = (
  indexMedia: IndexMediaData
): GenreUrlMap[] | null => {
  const genres: GenreResponse[] | null = getIndexMediaGenres(indexMedia);
  if (!genres) {
    return null;
  }
  const urlMap: GenreUrlMap[] = genreUrlMapper(
    //we don't have much space in the cards, so we order by shortest
    //genre name length and take the first 3 results
    genres
      .sort(
        (a: GenreResponse, b: GenreResponse) => a.name.length - b.name.length
      )
      .slice(0, 3),
    indexMedia.mediaType
  );
  return urlMap;
};

export const getIndexMediaGenres = (
  indexMedia: IndexMediaData
): GenreResponse[] | null => {
  if (indexMedia.mediaType === MediaType.Season) {
    return null;
  }
  const isFilm: boolean = indexMedia.mediaType === MediaType.Film;
  const genres: GenreResponse[] | undefined = isFilm
    ? indexMedia.film?.genres
    : indexMedia.show?.genres;
  if (genres === undefined) {
    return null;
  }
  return genres;
};
