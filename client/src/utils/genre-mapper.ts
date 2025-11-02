import { MediaType } from '../../../shared/types/media';
import { GenreResponse } from '../../../shared/types/models';
import { clientPaths } from '../../../shared/util/url-builder';
import UrlQueryBuilder from './url-query-builder';

export interface GenreUrlMap {
  id: number;
  name: string;
  url: string;
}

const queryBuilder: UrlQueryBuilder = new UrlQueryBuilder();

//converts an array of GenreResponses into a map with populated urls to browse
//for media with said genre. If a mediaType is provided, it'll also filter by it.

export const genreUrlMapper = (
  genres: GenreResponse[],
  mediaType?: MediaType
): GenreUrlMap[] => {
  const map: GenreUrlMap[] = [];

  genres.forEach((g: GenreResponse) => {
    const id: number = g.id || 0;
    const url: string = queryBuilder
      .byGenre(id)
      .byMediaType(mediaType)
      .toString();
    map.push({ id: g.id, name: g.name, url: clientPaths.browse.byQuery(url) });
  });
  return map;
};
