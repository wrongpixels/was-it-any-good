import { MediaType } from '../../../shared/types/media';
import { GenreResponse } from '../../../shared/types/models';
import { routerPaths } from './url-helper';
import UrlQueryBuilder from './url-query-builder';

const queryBuilder: UrlQueryBuilder = new UrlQueryBuilder();

//converts an array of GenreResponses into a map with populated urls to browse
//for media with said genre. If a mediaType is provided, it'll also filter by it.

export const genreUrlMapper = (
  genres: GenreResponse[],
  mediaType?: MediaType
): Map<number, string> => {
  const map = new Map<number, string>();

  genres.forEach((g: GenreResponse) => {
    const id: number = g.id || 0;
    const url: string = queryBuilder
      .byGenre(id)
      .byMediaType(mediaType)
      .toString();
    map.set(g.id, routerPaths.browse.byQuery(url));
  });
  return map;
};
