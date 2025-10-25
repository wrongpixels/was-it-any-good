import { Transaction } from 'sequelize';
import {
  DEF_LIST_FAV_FILMS,
  DEF_LIST_FAV_SHOWS,
  DEF_LIST_LIKES,
  DEF_LIST_WATCHLIST,
} from '../../../shared/constants/user-media-list-constants';
import { CreateUserMediaList } from '../../../shared/types/models';
import UserMediaList from '../models/users/userMediaList';

export const createDefaultUserLists = async (
  userId: number,
  transaction?: Transaction
): Promise<UserMediaList[]> => {
  const defaultLists: CreateUserMediaList[] = [
    createLikesList(userId),
    createWatchlist(userId),
    createFavFilmList(userId),
    createFavTVList(userId),
  ];
  return await UserMediaList.bulkCreate(defaultLists, {
    transaction,
  });
};
export const createLikesList = (userId: number): CreateUserMediaList => ({
  ...DEF_LIST_LIKES,
  userId,
  indexInUserLists: 0,
});
export const createWatchlist = (userId: number): CreateUserMediaList => ({
  ...DEF_LIST_WATCHLIST,
  userId,
  indexInUserLists: 1,
});

export const createFavFilmList = (userId: number): CreateUserMediaList => ({
  ...DEF_LIST_FAV_FILMS,
  userId,
  indexInUserLists: 2,
});

export const createFavTVList = (userId: number): CreateUserMediaList => ({
  ...DEF_LIST_FAV_SHOWS,
  userId,
  indexInUserLists: 3,
});

//to get a users watchlist
export const getUserWatchlist = async (
  userId: number | string
): Promise<UserMediaList | null> =>
  await UserMediaList.findOne({
    where: {
      userId,
      name: 'Watchlist',
      canBeModified: false,
      icon: 'watchlist',
    },
  });
