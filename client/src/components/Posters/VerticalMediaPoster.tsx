import { JSX } from 'react';
import { Link } from 'react-router-dom';
import imageLinker from '../../../../shared/util/image-linker';
import { styles } from '../../constants/tailwind-styles';
import { mediaTypeToDisplayName } from '../../utils/url-helper';
import LazyImage from '../Common/Custom/LazyImage';
import StarRatingIndexMedia from '../Rating/StarRatingIndexMedia';
import { MediaType } from '../../../../shared/types/media';
import { RatingData } from '../../../../shared/types/models';
import Tag from '../Common/Custom/Tag';

interface TagContent {
  text: string;
  title: string;
  className?: string;
}

interface VerticalMediaPosterProps {
  name: string;
  url: string;
  image: string;
  mediaType: MediaType;
  releaseDate: string | null;
  //the optional Tag up right
  mainTag?: TagContent;
  //the optional Tag bottom left
  secondaryTag?: TagContent;
  rating?: number;
  userRating?: RatingData;
  isVote?: boolean;
}

//the Poster component for vertical media cards
const VerticalMediaPoster = ({
  name,
  url,
  image,
  releaseDate,
  mediaType,
  rating,
  isVote,
  userRating,
  mainTag,
  secondaryTag,
}: VerticalMediaPosterProps): JSX.Element => {
  return (
    <Link
      to={url}
      title={`${name} (${mediaTypeToDisplayName(mediaType)})`}
      className="flex"
    >
      <div className={`${styles.poster.animated()} w-35 pb-0.5`}>
        <span className="text-xs text-gray-500 text-center flex h-full align-middle items-center justify-center -translate-y-1 py-0.5">
          <span className={'line-clamp-1 leading-tight w-35'}>{name}</span>
        </span>
        <div className="flex-1 relative">
          <LazyImage
            src={imageLinker.getPosterImage(image)}
            alt={name}
            className="absolute inset-0 rounded shadow ring-1 ring-gray-325"
          />
          {mainTag && (
            <Tag {...mainTag} className="absolute right-1.5 top-1.5" />
          )}
          {secondaryTag && (
            <Tag
              {...secondaryTag}
              className="absolute left-1.5 bottom-1.5 text-notigreen"
            />
          )}
        </div>
        <StarRatingIndexMedia
          rating={rating}
          isVote={isVote}
          releaseDate={releaseDate}
          userRating={userRating}
        />
      </div>
    </Link>
  );
};

export default VerticalMediaPoster;
