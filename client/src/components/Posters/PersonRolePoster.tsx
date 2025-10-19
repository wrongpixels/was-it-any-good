import { JSX } from 'react';
import { buildMediaLink } from '../../utils/url-helper';
import { MediaResponse } from '../../../../shared/types/models';
import VerticalMediaPoster from './VerticalMediaPoster';
import { getMediaAverageRating } from '../../utils/ratings-helper';

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
    <div className="flex flex-col">
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
      {characterNames && <div>{characterNames}</div>}
    </div>
  );
};

export default PersonRolePoster;
