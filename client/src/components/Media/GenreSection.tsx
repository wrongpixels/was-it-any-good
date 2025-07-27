import { JSX, useMemo } from 'react';
import { GenreResponse } from '../../../../shared/types/models';
import React from 'react';
import { MediaType } from '../../../../shared/types/media';
import IconForMediaType from '../Header/Search/icons/IconForMediaType';
import { Link } from 'react-router-dom';
import SearchUrlBuilder from '../../utils/search-url-builder';
import { routerPaths } from '../../utils/url-helper';
import { styles } from '../../constants/tailwind-styles';

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
  const mediaIconUrl: string = searchUrl.byMediaType(mediaType).toString();
  const genreLinkMap = useMemo(() => {
    const map = new Map<number, string>();
    genres.forEach((g: GenreResponse) => {
      const id: number = g.tmdbId || 0;
      const url: string = searchUrl
        .byGenre(id)
        .byMediaType(mediaType)
        .toString();
      map.set(g.id, routerPaths.search.byQuery(url));
    });
    console.log(map);
    return map;
  }, [genres, mediaType]);

  return (
    <div className="flex items-center text-gray-400 gap-2 relative ml-1">
      <Link
        to={routerPaths.search.byQuery(mediaIconUrl)}
        className={`${styles.animations.zoomOnHover}`}
      >
        <IconForMediaType mediaType={mediaType} className={'text-gray-600'} />
      </Link>
      <div className="text-sm">
        {genres.map((g: GenreResponse, i: number) => (
          <React.Fragment key={g.id}>
            {i > 0 && ' | '}
            <Link
              to={genreLinkMap.get(g.id) || routerPaths.search.base}
              className={'hover:underline cursor-pointer'}
              title={g.name}
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
