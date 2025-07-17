import { JSX } from 'react';
import EntrySection from '../EntrySection';
import { AuthorType } from '../../../../shared/types/roles';
import { MediaType } from '../../../../shared/types/media';
import MediaEntryPoster from '../Poster/MediaEntryPoster';
import MediaHeader from './MediaHeader';
import SeasonsEntry from './SeasonsEntry';
import { useParams } from 'react-router-dom';
import {
  useMediaByIdQuery,
  useMediaByTMDBQuery,
} from '../../queries/media-queries';
import MediaMissing from './MediaMissing';
import { setTitle } from '../../utils/page-info-setter';
import {
  UNKNOWN_CAST,
  UNKNOWN_CREW,
  DEF_CREW_TV,
  DEF_SYNOPSIS,
} from '../../../../shared/defaults/media-defaults';
import CrewEntrySection from '../CrewEntrySection';
import CastEntrySection from '../CasEntrySection';
import LoadingPage from '../common/status/LoadingPage';
import ErrorPage from '../common/status/ErrorPage';
import { useAuth } from '../../hooks/use-auth';
import { AuthContextValues } from '../../context/AuthProvider';

interface MediaEntryProps {
  mediaType: MediaType;
  tmdb?: boolean;
}

const MediaEntry = ({
  tmdb = false,
  mediaType,
}: MediaEntryProps): JSX.Element | null => {
  const { id: mediaId } = useParams<{ id: string }>();
  const { isLoginPending }: AuthContextValues = useAuth();
  const {
    data: media,
    isFetching,
    isError,
    error,
  } = tmdb
    ? useMediaByTMDBQuery(mediaId, mediaType)
    : useMediaByIdQuery(mediaId, mediaType);

  if (mediaId && isNaN(Number(mediaId))) {
    setTitle('Wrong id format');
    return (
      <div className="flex flex-col items-center justify-center w-full font-medium text-2xl gap-4 whitespace-pre-line">
        Wrong ID format!
        <div className="text-lg font-normal">Ids can only have numbers</div>
      </div>
    );
  }
  if (isFetching || isLoginPending) {
    return <LoadingPage text={mediaType} />;
  }
  console.log('User vote is ', media?.userRating?.userScore);
  if (isError) {
    return (
      <ErrorPage context={`loading the ${mediaType}`} error={error.message} />
    );
  }
  if (!media) {
    return <MediaMissing mediaId={mediaId} mediaType={mediaType} tmdb={tmdb} />;
  }
  setTitle(`${media.name} (${mediaType})`);

  return (
    <div>
      <div className="flex flex-row gap-8">
        <div className="flex-1 overflow-x-hidden">
          <MediaHeader media={media} />
          <EntrySection
            title="Synopsis"
            content={media.description || DEF_SYNOPSIS}
          />
          <div className="border-t border-gray-200 mt-3">
            {media.mediaType === MediaType.Film ? (
              <CrewEntrySection
                title="Direction and Writing"
                crew={media.mergedCrew || UNKNOWN_CREW}
                filterRoles={
                  media.mergedCrew
                    ? [AuthorType.Director, AuthorType.Writer]
                    : undefined
                }
              />
            ) : (
              <div>
                <CrewEntrySection
                  title="Direction and Creation"
                  crew={media.mergedCrew || DEF_CREW_TV}
                  filterRoles={
                    media.mergedCrew
                      ? [
                          AuthorType.Creator,
                          AuthorType.ExecProducer,
                          AuthorType.Director,
                          AuthorType.Writer,
                        ]
                      : undefined
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-50">
          <MediaEntryPoster media={media} />
        </div>
      </div>
      {media.mediaType === MediaType.Show && <SeasonsEntry show={media} />}
      <div className="mt-4 border-t border-gray-200">
        <CastEntrySection title="Cast" cast={media.cast || UNKNOWN_CAST} />
      </div>
    </div>
  );
};

export default MediaEntry;
