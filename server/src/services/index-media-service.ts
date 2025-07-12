import { getYearNum } from '../../../shared/src/helpers/format-helper';
import { CreateIndexMedia } from '../../../shared/types/models';
import { Film, Show } from '../models';
import IndexMedia from '../models/media/indexMedia';

export const syncIndexMedia = async (media: Show | Film): Promise<void> => {
  try {
    const indexMediaData = mediaToIndexMedia(media);
    if (indexMediaData) {
      await addIndexMedia(indexMediaData);
    }
  } catch (error) {
    console.error(`Failed to sync index media for mediaId: ${media.id}`, error);
  }
};

export const addIndexMedia = async (
  data: CreateIndexMedia
): Promise<IndexMedia | null> => {
  const [indexEntry]: [IndexMedia, boolean | null] =
    await IndexMedia.upsert(data);
  return indexEntry;
};

export const mediaToIndexMedia = (
  media: Show | Film
): CreateIndexMedia | null => {
  if (!media.tmdbId) {
    return null;
  }
  return {
    tmdbId: media.tmdbId,
    mediaType: media.mediaType,
    mediaId: media.id,
    addedToMedia: true,
    name: media.name,
    image: media.image,
    rating: media.rating,
    baseRating: media.baseRating,
    year: getYearNum(media.releaseDate),
    voteCount: media.voteCount,
    popularity: media.popularity,
  };
};
