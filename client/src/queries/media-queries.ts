import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMediaById, getMediaByTMDBId } from '../services/media-service';
import { MediaResponse } from '../../../shared/types/models';
import mergeCredits from '../utils/credits-merger';
import { MediaType } from '../../../shared/types/media';
import { useEffect } from 'react';
import { getActiveMediaKey } from '../utils/ratings-helper';

const transformCredits = (data: MediaResponse): MediaResponse => {
  if (!data.crew) return data;
  return { ...data, mergedCrew: mergeCredits(data.crew) };
};

export const useMediaByIdQuery = (id: string = '', mediaType: MediaType) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: getActiveMediaKey(mediaType, id, false),
    enabled: !!id && !isNaN(Number(id)),
    queryFn: async () => {
      const data = await getMediaById(id, mediaType);
      return data ? transformCredits(data) : null;
    },
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
    queryFn: async () => {
      const data = await getMediaByTMDBId(tmdbId, mediaType);
      return data ? transformCredits(data) : null;
    },
  });
  //we create a copy for id urls

  useEffect(() => {
    const media = query.data;
    if (media?.id) {
      queryClient.setQueryData(
        getActiveMediaKey(mediaType, media.id, false),
        media
      );
    }
  }, [query.data, mediaType, tmdbId, queryClient]);

  return query;
};
