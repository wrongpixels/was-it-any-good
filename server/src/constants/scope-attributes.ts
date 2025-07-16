import { FindAttributeOptions, Includeable } from 'sequelize';
import { Rating } from '../models';

export const BRIEF_MEDIA_ATTRIBUTES: FindAttributeOptions = [
  'id',
  'name',
  'image',
  'rating',
  'baseRating',
  'mediaType',
];

export const getUserRatingInclude = (userId?: number): Includeable[] => {
  if (!userId) {
    return [];
  }
  return [
    {
      model: Rating,
      as: 'ratings',
      where: {
        userId,
      },
      required: false,
    },
  ];
};
