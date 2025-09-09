import { JSX } from 'react';
import { AuthorType } from '../../../../shared/types/roles';
import { MediaType } from '../../../../shared/types/media';
import MediaPagePoster from '../Posters/MediaPagePoster';
import MediaHeader from './MediaHeader';
import SeasonsSection from './Sections/SeasonsSection';
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
} from '../../../../shared/defaults/media-defaults';
import CrewEntrySection from './Sections/People/CrewEntrySection';
import CastEntrySection from './Sections/People/CastEntrySection';
import LoadingPage from '../Common/Status/LoadingPage';
import ErrorPage from '../Common/Status/ErrorPage';
import { useAuth } from '../../hooks/use-auth';
import { AuthContextValues } from '../../context/AuthProvider';
import { mediaTypeToDisplayName } from '../../utils/url-helper';
import SynopsisSections from './Sections/SynopsisSection';
import { isShow } from '../../utils/ratings-helper';

interface MediaPage {
  mediaType: MediaType;
  tmdb?: boolean;
}

const MediaPage = ({
  tmdb = false,
  mediaType,
}: MediaPage): JSX.Element | null => {
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
  if (isError) {
    return (
      <ErrorPage context={`loading the ${mediaType}`} error={error.message} />
    );
  }
  if (!media) {
    return <MediaMissing mediaId={mediaId} mediaType={mediaType} tmdb={tmdb} />;
  }
  setTitle(`${media.name} (${mediaTypeToDisplayName(mediaType)})`);
  const show = isShow(media);
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8">
        <span className="flex-1 overflow-x-hidden">
          <MediaHeader media={media} />

          {
            <SynopsisSections
              title="Synopsis"
              content={media.description}
              mediaType={mediaType}
              episodeCount={show ? media.episodeCount : undefined}
              startDate={media.releaseDate || undefined}
              endDate={show ? media.lastAirDate || undefined : undefined}
            />
          }
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
                  title="Creation and Direction"
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
        </span>
        <span className="w-50 hidden md:block">
          <MediaPagePoster media={media} />
        </span>
      </div>
      {media.mediaType === MediaType.Show && <SeasonsSection show={media} />}
      <div className="mt-4 border-t border-gray-200">
        <CastEntrySection title="Cast" cast={media.cast || UNKNOWN_CAST} />
      </div>
    </div>
  );
};

export default MediaPage;
