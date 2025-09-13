import { JSX } from 'react';
import { buildMediaLink } from '../../utils/url-helper';
import { MediaResponse } from '../../../../shared/types/models';
import VerticalMediaPoster from './VerticalMediaPoster';

interface PersonPagePosterProps {
  mediaResponse: MediaResponse;
}

//the Poster component for the media cards in Person pages
const PersonRolePoster = ({
  mediaResponse,
}: PersonPagePosterProps): JSX.Element => {
  return (
    <VerticalMediaPoster
      url={buildMediaLink(mediaResponse)}
      mediaType={mediaResponse.mediaType}
      name={mediaResponse.name}
      image={mediaResponse.image}
      rating={mediaResponse.indexMedia?.rating}
      userRating={mediaResponse.userRating?.userScore}
    />
  );
};

export default PersonRolePoster;
