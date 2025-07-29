import { MediaType } from '../../../shared/types/media';
import { IndexMediaData } from '../../../shared/types/models';

export const getMediaId = (indexMedia: IndexMediaData): number | null => {
  if (!indexMedia.addedToMedia) {
    return null;
  }
  switch (indexMedia.mediaType) {
    case MediaType.Film:
      return indexMedia.film?.id ?? null;

    case MediaType.Show:
      return indexMedia.show?.id ?? null;

    default:
      return null;
  }
};
