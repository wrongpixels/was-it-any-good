import { MediaResponse } from '../../../../shared/types/models';
import MediaPagePoster from '../Posters/MediaPagePoster';
import GenreSection from './Sections/GenreSection';
import MediaTitle from './Sections/MediaTitle';

interface MediaHeaderProps {
  media: MediaResponse;
}

const MediaHeader = ({ media }: MediaHeaderProps) => {
  return (
    <>
      <MediaTitle media={media} />
      <div className="mt-2 mb-5 md:hidden flex flex-row justify-center">
        <div className="w-55">
          <MediaPagePoster media={media} />
        </div>
      </div>
      <>
        {media.genres && (
          <GenreSection mediaType={media.mediaType} genres={media.genres} />
        )}
      </>
    </>
  );
};

export default MediaHeader;
