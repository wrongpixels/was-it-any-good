import { JSX } from 'react';
import EntrySection from './EntrySection';
import { AuthorType } from '../../../shared/types/roles';
import { MediaType } from '../../../shared/types/media';
import MediaPoster from './MediaPoster';
import MediaHeader from './MediaHeader';
import useMedia, { UseMedia } from '../hooks/media-hook';
import SeasonsEntry from './SeasonsEntry';

interface MediaEntryProps {
  mediaType: MediaType;
  tmdb?: boolean;
}

const MediaEntry = ({
  tmdb = false,
  mediaType,
}: MediaEntryProps): JSX.Element => {
  const { media, validId }: UseMedia = useMedia(mediaType, tmdb);

  if (!validId) {
    return <div>Invalid {mediaType} id!</div>;
  }
  if (media === undefined || !media) {
    return (
      <div className="flex justify-center w-full h-full font-medium">
        {media === undefined ? 'Loading...' : `${mediaType} couldn't be found!`}
      </div>
    );
  }
  return (
    <div>
      <div className="flex flex-row gap-8">
        <div className="flex-1">
          <MediaHeader media={media} />
          <EntrySection title="Synopsis" content={media.description} />
          <div className="border-t border-gray-200 mt-3">
            {media.mediaType === MediaType.Film ? (
              <EntrySection
                title="Direction and Writing"
                crewContent={media.mergedCrew}
                peopleFilter={[AuthorType.Director, AuthorType.Writer]}
              />
            ) : (
              <div>
                <SeasonsEntry show={media} />
                <EntrySection
                  title="Creators"
                  crewContent={media.mergedCrew}
                  peopleFilter={[AuthorType.Creator, AuthorType.ExecProducer]}
                />
              </div>
            )}
          </div>
        </div>
        <MediaPoster media={media} />
      </div>
      <div className="mt-4 border-t border-gray-200">
        <EntrySection title="Cast" castContent={media.cast} />
      </div>
    </div>
  );
};

export default MediaEntry;
