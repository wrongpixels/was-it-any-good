import { JSX, useMemo } from 'react';
import { GenreResponse } from '../../../../../shared/types/models';
import { MediaType } from '../../../../../shared/types/media';

import { Link } from 'react-router-dom';
import UrlQueryBuilder from '../../../utils/url-query-builder';
import { mediaTypeToDisplayName, routerPaths } from '../../../utils/url-helper';
import { styles } from '../../../constants/tailwind-styles';
import { GenreUrlMap, genreUrlMapper } from '../../../utils/genre-mapper';
import Bubble from '../../Common/Custom/Bubble';
import IconForMediaType from '../../Common/Icons/Media/IconForMediaType';

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
    <div className="flex flex-row items-center text-gray-400 gap-2 relative ml-1">
      <Link
        to={routerPaths.browse.byQuery(mediaIconUrl)}
        className={`text-gray-600 ${styles.animations.zoomOnHover}`}
      >
        <IconForMediaType mediaType={mediaType} />
      </Link>
      <span className=" border-l border-gray-300 h-4 w-0" />
      <span className="flex flex-row gap-1.5 items-center -translate-y-0.5 h-5">
        {genreUrlMap.map((g: GenreUrlMap) => (
          <Link
            key={g.id}
            to={g.url}
            title={`Show more '${g.name}' ${mediaTypeToDisplayName(mediaType)}s`}
            className={`${styles.animations.zoomLessOnHover}`}
          >
            <Bubble text={g.name} type="media" className="pt-0.25 pb-0.5" />
          </Link>
        ))}
      </span>
    </div>
  );
};

export default GenreSection;
