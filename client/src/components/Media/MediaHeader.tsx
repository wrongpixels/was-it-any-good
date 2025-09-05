import { MediaResponse } from '../../../../shared/types/models';
import GenreSection from './Sections/GenreSection';
import MediaTitle from './Sections/MediaTitle';

interface MediaHeaderProps {
  media: MediaResponse;
}

const MediaHeader = ({ media }: MediaHeaderProps) => {
  return (
    <>
      <MediaTitle media={media} />
      <>
        {media.genres && (
          <GenreSection mediaType={media.mediaType} genres={media.genres} />
        )}
      </>
    </>
  );
};

export default MediaHeader;
