import { JSX } from 'react';
import { buildMediaLink } from '../../utils/url-helper';
import { MediaResponse } from '../../../../shared/types/models';
import VerticalMediaPoster from './VerticalMediaPoster';
import { getMediaAverageRating } from '../../utils/ratings-helper';
import { styles } from '../../constants/tailwind-styles';

interface PersonPagePosterProps {
  mediaResponse: MediaResponse;
  characterNames?: string;
}

//the Poster component for the media cards in Person pages
const PersonRolePoster = ({
  mediaResponse,
  characterNames,
}: PersonPagePosterProps): JSX.Element => {
  return (
    <div title={characterNames} className="flex flex-col items-center">
      <VerticalMediaPoster
        url={buildMediaLink(mediaResponse)}
        mediaType={mediaResponse.mediaType}
        name={mediaResponse.name}
        image={mediaResponse.image}
        rating={
          mediaResponse.indexMedia
            ? getMediaAverageRating(mediaResponse.indexMedia)
            : 0
        }
        userRating={mediaResponse.userRating?.userScore}
      />
      {characterNames && (
        <div
          className={`max-w-39 pt-2 cursor-help text-center ${styles.underPosterInfo} line-clamp-3`}
        >
          <span className="font-semibold text-gray-350">As:</span>{' '}
          <span className="italic text-gray-350">{characterNames}</span>
        </div>
      )}
    </div>
  );
};

export default PersonRolePoster;
