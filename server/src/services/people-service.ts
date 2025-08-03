import { MediaType } from '../../../shared/types/media';
import {
  MediaRoleResponse,
  IndexMediaData,
  PersonResponse,
} from '../../../shared/types/models';
import {
  SortedRoles,
  AuthorMedia,
  authorOrder,
} from '../../../shared/types/roles';

const getIndexMedia = (role: MediaRoleResponse): IndexMediaData | undefined => {
  if (role.mediaType === MediaType.Film) {
    return role.film?.indexMedia;
  }
  if (role.mediaType === MediaType.Show) {
    return role.show?.indexMedia;
  }
  return undefined;
};
export const sortRoles = (person: PersonResponse): SortedRoles => {
  const authorMedia: AuthorMedia[] = [];
  person.roles?.forEach((r: MediaRoleResponse) => {
    const indexMedia: IndexMediaData | undefined = getIndexMedia(r);
    if (indexMedia) {
      const entry = authorMedia.find(
        (a: AuthorMedia) => a.authorType === r.role
      );
      if (entry) {
        entry.indexMedia.push(indexMedia);
      } else {
        authorMedia.push({ authorType: r.role, indexMedia: [indexMedia] });
      }
    }
  });
  authorMedia.sort((a, b) => {
    const countB = b.indexMedia.length;
    const countA = a.indexMedia.length;
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
