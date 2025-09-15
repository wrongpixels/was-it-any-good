import { FindAttributeOptions, Includeable, IncludeOptions } from 'sequelize';
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

export const getUserRatingIncludeOptions = (
  mediaType: MediaType,
  activeUser?: ActiveUser
): IncludeOptions | undefined => {
  if (!activeUser?.isValid) {
    return undefined;
  }
  return {
    association: 'userRating',
    where: {
      userId: activeUser.id,
      mediaType: mediaType,
    },
    required: false,
  };
};

export const getUserRatingIncludeable = (
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
