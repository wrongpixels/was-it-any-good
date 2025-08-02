import { JSX, useMemo } from 'react';
import { GenreResponse } from '../../../../shared/types/models';
import React from 'react';
import { MediaType } from '../../../../shared/types/media';
import IconForMediaType from '../common/icons/IconForMediaType';
import { Link } from 'react-router-dom';
import UrlQueryBuilder from '../../utils/url-query-builder';
import { routerPaths } from '../../utils/url-helper';
import { styles } from '../../constants/tailwind-styles';
import { genreUrlMapper } from '../../utils/genre-mapper';

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
  const searchUrl: UrlQueryBuilder = new UrlQueryBuilder();
  const mediaIconUrl: string = searchUrl.byMediaType(mediaType).toString();
  const genreLinkMap: Map<number, string> = useMemo(
    () => genreUrlMapper(genres, mediaType),
    [genres, mediaType]
  );
  return (
    <div className="flex items-center text-gray-400 gap-2 relative ml-1">
      <Link
        to={routerPaths.browse.byQuery(mediaIconUrl)}
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
