import { MediaType } from '../../../shared/types/media';
import {
  MediaRoleResponse,
  MediaResponse,
  PersonResponse,
} from '../../../shared/types/models';
import {
  SortedRoles,
  AuthorMedia,
  authorOrder,
} from '../../../shared/types/roles';

const getMedia = (role: MediaRoleResponse): MediaResponse | undefined => {
  if (role.mediaType === MediaType.Film) {
    return role.film;
  }
  if (role.mediaType === MediaType.Show) {
    return role.show;
  }
  return undefined;
};
export const sortRoles = (person: PersonResponse): SortedRoles => {
  const authorMedia: AuthorMedia[] = [];
  person.roles?.forEach((r: MediaRoleResponse) => {
    const media: MediaResponse | undefined = getMedia(r);
    if (media) {
      const entry = authorMedia.find(
        (a: AuthorMedia) => a.authorType === r.role
      );
      if (entry) {
        entry.media.push(media);
      } else {
        authorMedia.push({ authorType: r.role, media: [media] });
      }
    }
  });
  authorMedia.sort((a, b) => {
    const countB = b.media.length;
    const countA = a.media.length;
    if (countA !== countB) {
      return countB - countA;
    }
    return (
      authorOrder.indexOf(a.authorType) - authorOrder.indexOf(b.authorType)
    );
  });
  const mainRoles = authorMedia.map((role) => role.authorType);
  return { mediaByRole: authorMedia, mainRoles };
};
