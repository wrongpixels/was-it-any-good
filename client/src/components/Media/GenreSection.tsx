import { JSX, useMemo } from 'react';
import { GenreResponse } from '../../../../shared/types/models';
import { MediaType } from '../../../../shared/types/media';
import IconForMediaType from '../common/icons/IconForMediaType';
import { Link } from 'react-router-dom';
import UrlQueryBuilder from '../../utils/url-query-builder';
import { mediaTypeToDisplayName, routerPaths } from '../../utils/url-helper';
import { styles } from '../../constants/tailwind-styles';
import { GenreUrlMap, genreUrlMapper } from '../../utils/genre-mapper';
import Bubble from '../common/Bubble';

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
  const genreUrlMap: GenreUrlMap[] = useMemo(
    () => genreUrlMapper(genres, mediaType),
    [genres, mediaType]
  );

  return (
    <div className="flex items-center text-gray-400 gap-2 relative ml-1">
      <Link
        to={routerPaths.browse.byQuery(mediaIconUrl)}
        className={`${styles.animations.zoomOnHover} border-r border-gray-300 pr-2`}
      >
        <IconForMediaType mediaType={mediaType} className={'text-gray-600'} />
      </Link>
      <span className="flex flex-row gap-1.5 -translate-y-0.25">
        {genreUrlMap.map((g: GenreUrlMap) => (
          <Link
            key={g.id}
            to={g.url}
            title={`Show more '${g.name}' ${mediaTypeToDisplayName(mediaType)}s`}
            className={`${styles.animations.zoomLessOnHover}`}
          >
            <Bubble text={g.name} className="pt-0.5 pb-0.75" />
          </Link>
        ))}
      </span>
    </div>
  );
};

export default GenreSection;
