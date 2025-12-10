import { JSX } from 'react';
import { MediaResponse } from '../../../../shared/types/models';
import VerticalMediaPoster from './VerticalMediaPoster';
import { getAnyMediaDisplayRating } from '../../utils/ratings-helper';
import { styles } from '../../constants/tailwind-styles';
import { buildMediaLinkWithSlug } from '../../../../shared/util/url-builder';
import { TagContent } from '../Common/Custom/Tag';

interface PersonPagePosterProps {
  mediaResponse: MediaResponse;
  characterNames?: string;
}

//the Poster component for the media cards in Person pages
const PersonRolePoster = ({
  mediaResponse,
  characterNames,
}: PersonPagePosterProps): JSX.Element => {
  const tagContent: TagContent = { text: 'Test', title: 'This is a test' };
  return (
    <div title={characterNames} className="flex flex-col items-center">
      <VerticalMediaPoster
        mainTag={tagContent}
        url={buildMediaLinkWithSlug(mediaResponse)}
        mediaType={mediaResponse.mediaType}
        name={mediaResponse.name}
        image={mediaResponse.image}
        releaseDate={mediaResponse.releaseDate}
        rating={
          mediaResponse.indexMedia
            ? getAnyMediaDisplayRating(mediaResponse.indexMedia)
            : 0
        }
        userRating={mediaResponse.userRating || undefined}
      />
      {characterNames && (
        <div
          className={`max-w-39 pt-2 text-center ${styles.underPosterInfo} line-clamp-3 -pb-2`}
        >
          <span className="font-semibold text-gray-350 cursor-default">
            {'As: '}
          </span>
          <span className="italic text-gray-350">{characterNames}</span>
        </div>
      )}
    </div>
  );
};

export default PersonRolePoster;
