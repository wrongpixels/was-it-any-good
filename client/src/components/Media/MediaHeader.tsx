import { MediaResponse } from '../../../../shared/types/models';
import GenreSection from './GenreSection';
import MediaTitle from './MediaTitle';

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
