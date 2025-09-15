import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMediaById, getMediaByTMDBId } from '../services/media-service';
import { MediaResponse } from '../../../shared/types/models';
import { mergeCredits } from '../utils/credits-merger';
import { MediaType } from '../../../shared/types/media';
import { useEffect } from 'react';
import { getActiveMediaKey } from '../utils/ratings-helper';

const transformCredits = (data: MediaResponse): MediaResponse => {
  if (!data.crew) {
    return data;
  }
  return {
    ...data,
    cast: data.cast && data.cast.length > 0 ? data.cast : undefined,
    mergedCrew:
      data.crew.length > 0
        ? mergeCredits(data.crew, data.mediaType)
        : undefined,
  };
};

export const useMediaByIdQuery = (id: string = '', mediaType: MediaType) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: getActiveMediaKey(mediaType, id, false),
    retry: false,
    gcTime: Infinity,
    enabled: !!id && !isNaN(Number(id)),
    select: (data) => (data ? transformCredits(data) : null),
    queryFn: () => getMediaById(id, mediaType),
  });
  //we create a copy for tmdb id urls
  useEffect(() => {
    const media = query.data;
    if (media?.tmdbId) {
      queryClient.setQueryData(
        getActiveMediaKey(mediaType, media.tmdbId, true),
        media
      );
    }
  }, [query.data, mediaType, id, queryClient]);

  return query;
};

export const useMediaByTMDBQuery = (
  tmdbId: string = '',
  mediaType: MediaType
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: getActiveMediaKey(mediaType, tmdbId, true),
    enabled: !!tmdbId && !isNaN(Number(tmdbId)),
    retry: false,
    queryFn: async () => {
      const data = await getMediaByTMDBId(tmdbId, mediaType);
      const media: MediaResponse | null = data ? transformCredits(data) : null;
      if (media?.id) {
        //we set now the cache for the next query
        queryClient.setQueryData(
          getActiveMediaKey(mediaType, media.id, false),
          media
        );
      }
      return media;
    },
  });

  //a second query triggers when we have the media and its id that we set before.
  //this will return the content of the first query directly, without fetching.
  //we can now get the same data from id and tmdbid keys in any component, which becomes
  //and observer in both queries, avoiding tanstack cleaning them.

  const id = query.data?.id;
  const queryKey = getActiveMediaKey(mediaType, id || 0, false);
  const idQuery = useQuery({
    queryKey,
    retry: false,
    queryFn: () => {
      //this placeholder query is empty but useless, so we remove it
      queryClient.removeQueries({
        queryKey: getActiveMediaKey(mediaType, 0, false),
      });
      return query.data;
    },
    enabled: !!id,
  });
  //we return the 1st query with the 2nd query's data so isLoading etc is linked to
  //the query doing the fetch process.
  return { ...query, data: idQuery.data };
};
