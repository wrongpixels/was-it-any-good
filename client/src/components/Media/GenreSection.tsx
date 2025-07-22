import { JSX, useMemo } from 'react';
import { GenreResponse } from '../../../../shared/types/models';
import React from 'react';
import { MediaType } from '../../../../shared/types/media';
import IconForMediaType from '../Header/Search/icons/IconForMediaType';
import { Link } from 'react-router-dom';
import SearchUrlBuilder from '../../utils/search-url-builder';
import { routerPaths } from '../../utils/url-helper';

interface GenreSectionProps {
  genres: GenreResponse[];
  mediaType: MediaType;
}

const GenreSection = ({
  genres,
  mediaType,
}: GenreSectionProps): JSX.Element | null => {
  if (!genres || genres.length < 1) {
    return null;
  }
  const searchUrl: SearchUrlBuilder = new SearchUrlBuilder();
  const genreLinkMap = useMemo(() => {
    const map = new Map<number, string>();
    genres.forEach((g: GenreResponse) => {
      const id: number = g.tmdbId || 0;
      const url: string = searchUrl
        .byGenre(id)
        .byMediaType(mediaType)
        .toString();
      map.set(g.id, url);
    });
    return map;
  }, [genres, mediaType]);

  return (
    <div className="flex items-center text-gray-400 gap-2 relative ml-1">
      <IconForMediaType mediaType={mediaType} className="text-gray-600" />
      <div className="text-sm">
        {genres.map((g: GenreResponse, i: number) => (
          <React.Fragment key={g.id}>
            {i > 0 && ' | '}
            <Link
              to={genreLinkMap.get(g.id) || routerPaths.search.base}
              className="hover:underline cursor-pointer"
            >
              {g.name}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GenreSection;
