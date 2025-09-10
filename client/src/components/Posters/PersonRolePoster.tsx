import { JSX } from 'react';
import { Link } from 'react-router-dom';
import imageLinker from '../../../../shared/util/image-linker';
import { styles } from '../../constants/tailwind-styles';
import { buildMediaLink, mediaTypeToDisplayName } from '../../utils/url-helper';
import LazyImage from '../Common/Custom/LazyImage';
import StarRatingIndexMedia from '../Rating/StarRatingIndexMedia';
import { MediaResponse } from '../../../../shared/types/models';

interface PersonPagePosterProps {
  mediaResponse: MediaResponse;
}

//the Poster component for the media cards in Person pages
const PersonRolePoster = ({
  mediaResponse,
}: PersonPagePosterProps): JSX.Element => {
  return (
    <Link
      to={buildMediaLink(mediaResponse)}
      title={`${mediaResponse.name} (${mediaTypeToDisplayName(mediaResponse.mediaType)})`}
      className="flex"
    >
      <div className={`${styles.poster.animated()} w-35 pb-0.5`}>
        <span className="text-sm text-gray-500 text-center flex h-full align-middle items-center justify-center -translate-y-1 ">
          <span className={'line-clamp-2 leading-tight w-35'}>
            {mediaResponse.name}
          </span>
        </span>

        <div className="flex-1 relative">
          <LazyImage
            src={imageLinker.getPosterImage(mediaResponse.image)}
            alt={mediaResponse.name}
            className="absolute inset-0 rounded shadow ring-1 ring-gray-325"
          />
        </div>
        <StarRatingIndexMedia value={mediaResponse.indexMedia?.rating} />
      </div>
    </Link>
  );
};

export default PersonRolePoster;
