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

//this allows us to load our activeUser associations like their rating/lists
//directly within the mediaResponse we'll send to the client.

//the function builds an array that works for both IncludeOptions or Includeable,
//which share structures but not types
const getUserAssociations = (mediaType: MediaType, activeUser?: ActiveUser) => {
  if (!activeUser?.isValid) {
    return [];
  }
  return [
    {
      association: 'userRating',
      where: {
        userId: activeUser.id,
        mediaType: mediaType,
      },
      required: false,
    },
    {
      association: 'userWatchlist',
      include: [
        {
          association: 'userList',
          where: {
            name: 'Watchlist',
          },
        },
      ],
      required: false,
    },
  ];
};

//the functions that type the returned array
export const getActiveUserIncludeOptions = (
  mediaType: MediaType,
  activeUser?: ActiveUser
): IncludeOptions[] => getUserAssociations(mediaType, activeUser);

export const getActiveUserIncludeable = (
  mediaType: MediaType,
  activeUser?: ActiveUser
): Includeable[] => getUserAssociations(mediaType, activeUser);
