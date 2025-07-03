import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getMediaById, getMediaByTMDBId } from '../services/media-service';
import { MediaResponse } from '../../../shared/types/models';
import mergeCredits from '../utils/credits-merger';
import { MediaType } from '../../../shared/types/media';

interface MediaQueryValues {
  mediaType: MediaType;
  id?: string;
  tmdbId?: string;
}

const transformCredits = (data: MediaResponse): MediaResponse => {
  if (!data.crew) return data;
  return { ...data, mergedCrew: mergeCredits(data.crew) };
};

export const useMediaQuery = ({ mediaType, id, tmdbId }: MediaQueryValues) => {
  const queryClient = useQueryClient();
  const mapped = tmdbId
    ? queryClient.getQueryData<{ id: string }>(['tmdbMap', mediaType, tmdbId])
    : undefined;
  const effectiveId = mapped?.id ?? id;

  const query = useQuery({
    queryKey: ['media', mediaType, effectiveId ?? tmdbId],
    enabled: !!(effectiveId ?? tmdbId),
    queryFn: async () => {
      if (effectiveId) {
        const raw = await getMediaById(effectiveId, mediaType);
        return transformCredits(raw);
      }
      const raw = await getMediaByTMDBId(tmdbId!, mediaType);
      return transformCredits(raw);
    },
  });
  //tanstack has removed OnSuccess from queries, so this is a way of "sharing" values between a
  //tmdb cache entry and the internal id one
  useEffect(() => {
    const media = query.data;
    if (!media) {
      return;
    }

    queryClient.setQueryData<MediaResponse>(
      ['media', mediaType, media.id],
      media
    );
    if (tmdbId) {
      queryClient.setQueryData(['tmdbMap', mediaType, tmdbId], {
        id: media.id,
      });
    }
  }, [query.data, mediaType, tmdbId, queryClient]);

  return query;
};
