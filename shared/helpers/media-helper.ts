import { MediaType } from "../types/media";
import {
  MediaResponse,
  MediaRoleResponse,
  SeasonResponse,
  ShowResponse,
} from "../types/models";

export const stringToMediaType = (media: string): MediaType | null => {
  switch (media.toLowerCase()) {
    case "film":
      return MediaType.Film;
    case "show":
      return MediaType.Show;
    case "season":
      return MediaType.Season;
    default:
      return null;
  }
};

//a function that strips heavy data for a basic MediaResponse to the client.
//used for redirecting a tmdb entry to the id one that already has those fields cached.
export const toBasicMediaResponse = (media: MediaResponse): MediaResponse => {
  media.cast = undefined;
  media.crew = undefined;
  media.userRating = undefined;
  media.indexMedia = undefined;
  if (media.mediaType === MediaType.Show) {
    media.seasons = undefined;
  }
  return media;
};

export const reorderSeasons = (
  show: ShowResponse
): SeasonResponse[] | undefined =>
  show?.seasons?.sort((a, b) => a.index - b.index);

export const getMediaFromRole = (
  role: MediaRoleResponse
): MediaResponse | undefined => {
  if (role.mediaType === MediaType.Film) {
    return role.film;
  }
  if (role.mediaType === MediaType.Show) {
    return role.show;
  }
  return undefined;
};
