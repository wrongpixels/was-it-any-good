import { PathMatch, useMatch } from 'react-router-dom';
import { MediaType } from '../../../shared/types/media';
import { MediaResponse } from '../../../shared/types/models';
import { useEffect, useState } from 'react';
import { buildMediaURL, getById, getByTMDBId } from '../services/media-service';
import mergeCredits from '../utils/credits-merger';

export interface UseMedia {
  media: MediaResponse | null | undefined;
  validId: boolean;
}

const useMedia = (mediaType: MediaType, tmdb: boolean): UseMedia => {
  const [media, setMedia] = useState<MediaResponse | null | undefined>(
    undefined
  );
  const match: PathMatch<'id'> | null = useMatch(
    `${buildMediaURL(mediaType, tmdb)}/:id`
  );
  const mediaId: string | undefined = match?.params.id;
  useEffect(() => {
    if (!mediaId) {
      return;
    }
    const getMedia = async () => {
      const mediaResponse: MediaResponse | null = tmdb
        ? await getByTMDBId(mediaId, mediaType)
        : await getById(mediaId, mediaType);
      if (mediaResponse) {
        setMedia(
          mediaResponse.crew
            ? { ...mediaResponse, mergedCrew: mergeCredits(mediaResponse.crew) }
            : mediaResponse
        );
      } else {
        setMedia(null);
      }
    };
    getMedia();
  }, [mediaId]);
  if (!mediaId) {
    return { validId: false, media: null };
  }
  return { media, validId: true };
};

export default useMedia;
