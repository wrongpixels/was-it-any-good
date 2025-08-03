import { Link } from 'react-router-dom';
import { AuthorMedia } from '../../../../shared/types/roles';
import { IndexMediaData } from '../../../../shared/types/models';
import { styles } from '../../constants/tailwind-styles';
import {
  mediaTypeToDisplayName,
  urlFromIndexMedia,
} from '../../utils/url-helper';
import imageLinker from '../../../../shared/util/image-linker';
import ScrollableDiv from '../common/ScrollableDiv';
import Separator from '../common/Separator';
import LazyImage from '../common/LazyImage';
import IndexMediaRatingStars from '../IndexMedia/IndexMediaRatingStars';

interface PersonRoleCreditsProps {
  media: AuthorMedia;
  isFirst: boolean;
}

const PersonRoleCredits = ({ media, isFirst }: PersonRoleCreditsProps) => {
  return (
    <div className="h-full">
      {!isFirst && <Separator className="w-full pb-2" />}
      <h2 className="text-left font-bold text-lg pb-1">
        {`${media.authorType} (${media.indexMedia.length})`}
      </h2>

      <ScrollableDiv className="ml-4">
        {media.indexMedia.map((im: IndexMediaData) => (
          <Link
            key={im.id}
            to={urlFromIndexMedia(im)}
            title={`${im.name} (${mediaTypeToDisplayName(im.mediaType)})`}
            className="flex"
          >
            <div className={`${styles.poster.animated()} w-35 `}>
              <span className="text-sm text-gray-500 text-center flex h-full align-middle items-center justify-center -translate-y-1 ">
                <span className="line-clamp-2 leading-tight">{im.name}</span>
              </span>

              <div className="flex-1 relative">
                <LazyImage
                  src={imageLinker.getPosterImage(im.image)}
                  alt={im.name}
                  className="absolute inset-0 w-full h-full object-cover rounded shadow ring-1 ring-gray-325"
                />
              </div>
              <IndexMediaRatingStars value={im.rating} />
            </div>
          </Link>
        ))}
      </ScrollableDiv>
    </div>
  );
};

export default PersonRoleCredits;
