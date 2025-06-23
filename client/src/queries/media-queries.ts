import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { MediaType } from '../../../shared/types/media';
import { getById, getByTMDBId } from '../services/media-service';
import { MediaResponse } from '../../../shared/types/models';
import mergeCredits from '../utils/credits-merger';

export const useMediaByIDQuery = (
  id: string | undefined,
  mediaType: MediaType
): UseQueryResult<MediaResponse | null, Error> =>
  useQuery({
    queryKey: ['media', mediaType, id],
    queryFn: () => getById(id!, mediaType),
    enabled: !!id,
    select: transformCredits,
  });

export const useMediaByTMDBQuery = (
  id: string | undefined,
  mediaType: MediaType
): UseQueryResult<MediaResponse | null, Error> =>
  useQuery({
    queryKey: ['tmdbMedia', mediaType, id],
    queryFn: () => getByTMDBId(id!, mediaType),
    enabled: !!id,
    select: transformCredits,
  });

//to merge credits for the frontend before caching them
const transformCredits = (data: MediaResponse | null): MediaResponse | null => {
  if (!data) {
    return null;
  }
  return data.crew ? { ...data, mergedCrew: mergeCredits(data.crew) } : data;
};
