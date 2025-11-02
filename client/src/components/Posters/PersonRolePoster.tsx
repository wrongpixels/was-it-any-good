import { JSX } from 'react';
import { MediaResponse } from '../../../../shared/types/models';
import VerticalMediaPoster from './VerticalMediaPoster';
import { getMediaAverageRating } from '../../utils/ratings-helper';
import { styles } from '../../constants/tailwind-styles';
import { buildMediaLinkWithSlug } from '../../../../shared/util/url-builder';

interface PersonPagePosterProps {
  mediaResponse: MediaResponse;
  characterNames?: string;
}

//the Poster component for the media cards in Person pages
const PersonRolePoster = ({
  mediaResponse,
  characterNames,
}: PersonPagePosterProps): JSX.Element => {
  console.log(mediaResponse.userRating?.userScore);
  return (
    <div title={characterNames} className="flex flex-col items-center">
      <VerticalMediaPoster
        url={buildMediaLinkWithSlug(mediaResponse)}
        mediaType={mediaResponse.mediaType}
        name={mediaResponse.name}
        image={mediaResponse.image}
        releaseDate={mediaResponse.releaseDate}
        rating={
          mediaResponse.indexMedia
            ? getMediaAverageRating(mediaResponse.indexMedia)
            : 0
        }
        userRating={mediaResponse.userRating || undefined}
      />
      {characterNames && (
        <div
          className={`max-w-39 pt-2 cursor-help text-center ${styles.underPosterInfo} line-clamp-3 -pb-2`}
        >
          <span className="font-semibold text-gray-350">As:</span>{' '}
          <span className="italic text-gray-350">{characterNames}</span>
        </div>
      )}
    </div>
  );
};

export default PersonRolePoster;
