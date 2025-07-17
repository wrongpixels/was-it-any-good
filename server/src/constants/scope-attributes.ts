import { FindAttributeOptions, Includeable } from 'sequelize';
import { MediaType } from '../../../shared/types/media';

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
  userId?: number
): Includeable[] => {
  return [
    {
      association: 'userRating',
      where: {
        userId,
        mediaType,
      },
      required: false,
    },
  ];
};
