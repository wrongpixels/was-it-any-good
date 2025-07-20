import { MediaResponse } from '../../../../shared/types/models';
import GenreSection from './GenreList';
import Title from '../Title';

interface MediaHeaderProps {
  media: MediaResponse;
}

const MediaHeader = ({ media }: MediaHeaderProps) => {
  return (
    <div>
      <Title
        title={media.name}
        date={media.releaseDate}
        country={media.country}
        originalTitle={media.originalName}
      />
      <div>
        <div>
          {media.genres && (
            <GenreSection mediaType={media.mediaType} genres={media.genres} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaHeader;
