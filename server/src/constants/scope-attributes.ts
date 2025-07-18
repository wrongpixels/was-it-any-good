import { FindAttributeOptions, Includeable } from 'sequelize';
import { MediaType } from '../../../shared/types/media';
import { ActiveUser } from '../../../shared/types/models';

export const BRIEF_MEDIA_ATTRIBUTES: FindAttributeOptions = [
  'id',
  'name',
  'image',
  'rating',
  'baseRating',
  'mediaType',
];

export const getUserRatingInclude = (
  mediaType: MediaType,
  activeUser?: ActiveUser
): Includeable[] => {
  if (!activeUser?.isValid) {
    return [];
  }
  return [
    {
      association: 'userRating',
      where: {
        userId: activeUser.id,
        mediaType,
      },
      required: false,
    },
  ];
};
