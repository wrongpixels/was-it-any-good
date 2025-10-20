import { JSX, useEffect } from 'react';
import { AuthorType } from '../../../../shared/types/roles';
import { MediaType } from '../../../../shared/types/media';
import MediaPagePoster from '../Posters/MediaPagePoster';
import MediaHeader from './MediaHeader';
import SeasonsSection from './Sections/SeasonsSection';
import { useNavigate, useParams } from 'react-router-dom';
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
import {
  buildRouterMediaLink,
  mediaTypeToDisplayName,
} from '../../utils/url-helper';
import SynopsisSections from './Sections/SynopsisSection';
import { isShow } from '../../utils/ratings-helper';
import WrongIdFormatPage from '../Common/Status/WrongIdFormatPage';
import { isNotFoundError } from '../../utils/error-handler';
import CreatingMediaPage from '../Common/Status/CreatingMediaPage';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEY_TRENDING } from '../../constants/query-key-constants';
import UserLists from '../UserLists/UserLists';

interface MediaPage {
  mediaType: MediaType;
  tmdb?: boolean;
}

const MediaPage = ({
  tmdb = false,
  mediaType,
}: MediaPage): JSX.Element | null => {
  const queryClient: QueryClient = useQueryClient();
  const navigate = useNavigate();
  const { id: mediaId } = useParams<{ id: string }>();
  const { isLoginPending, session }: AuthContextValues = useAuth();
  const {
    data: media,
    isLoading,
    isFetching,
    isError,
    error,
  } = tmdb
    ? useMediaByTMDBQuery(mediaId, mediaType)
    : useMediaByIdQuery(mediaId, mediaType);

  let isRedirecting: boolean = !!tmdb && !!media;

  //once load, if it's a tmdb entry, we redirect to the existing or just
  //created id page
  useEffect(() => {
    if (tmdb && media) {
      //we invalidate the HomePage cache after a successful creation, as averages
      //stored in placeholder IndexMedia might change due to our algorithm
      queryClient.removeQueries({
        queryKey: [QUERY_KEY_TRENDING],
        exact: false,
      });
      navigate(buildRouterMediaLink(media.mediaType, media.id), {
        replace: true,
      });
    }
  }, [media]);

  if (mediaId && isNaN(Number(mediaId))) {
    return <WrongIdFormatPage />;
  }
  if (
    isLoading ||
    isLoginPending ||
    isRedirecting ||
    (isFetching &&
      media &&
      media?.cast === undefined &&
      media?.crew === undefined)
  ) {
    return tmdb ? (
      <CreatingMediaPage text={mediaType} />
    ) : (
      <LoadingPage text={mediaType} />
    );
  }
  if (isError || !media) {
    if (isNotFoundError(error)) {
      return (
        <MediaMissing
          mediaId={mediaId}
          mediaType={mediaType}
          contentType={mediaType}
          tmdb={tmdb}
        />
      );
    }
    return (
      <ErrorPage context={`loading the ${mediaType}`} error={error?.message} />
    );
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
        <div className="flex-col w-50 hidden md:flex gap-3">
          <MediaPagePoster media={media} />
          {session && <UserLists />}
        </div>
      </div>
      {media.mediaType === MediaType.Show && <SeasonsSection show={media} />}
      <div className="mt-4 border-t border-gray-200">
        <CastEntrySection title="Cast" cast={media.cast || UNKNOWN_CAST} />
      </div>
    </div>
  );
};

export default MediaPage;
