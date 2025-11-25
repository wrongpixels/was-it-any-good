import { Op, Transaction } from 'sequelize';
import {
  DEF_LIST_FAV_FILMS,
  DEF_LIST_FAV_SHOWS,
  DEF_LIST_LIKES,
  DEF_LIST_WATCHLIST,
} from '../../../shared/constants/user-media-list-constants';
import {
  CreateUserMediaList,
  IndexMediaData,
  MediaResponse,
  SeasonResponse,
} from '../../../shared/types/models';
import UserMediaList from '../models/users/userMediaList';
import { buildIndexMediaInclude } from './index-media-service';
import { UserMediaListItem } from '../models';
import { getMediaFromIndexMedia } from '../../../shared/util/url-builder';

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

interface FindWatchlistOptions {
  userId: number;
  includeItems?: boolean;
  includeItemsIndexMedia?: boolean;
}

export const populateIndexMediaWatchlist = async (
  indexMedia: IndexMediaData[],
  userId?: number
): Promise<IndexMediaData[]> => {
  if (userId === undefined) {
    return indexMedia;
  }

  const ids: number[] = indexMedia.map(
    (media: IndexMediaData): number => media.id
  );

  const list: UserMediaList | null = await UserMediaList.findOne({
    where: {
      userId: userId,
      name: 'Watchlist',
      canBeModified: false,
      icon: 'watchlist',
    },
    include: {
      association: 'listItems',
      where: {
        indexId: {
          [Op.in]: ids,
        },
      },
    },
  });

  if (
    list === null ||
    list.listItems === undefined ||
    list.listItems.length === 0
  ) {
    return indexMedia;
  }
  const listItems: UserMediaListItem[] = list.listItems;

  const itemByIndexId: Map<number, UserMediaListItem> = new Map<
    number,
    UserMediaListItem
  >();

  for (const listItem of listItems) {
    const indexId: number = listItem.indexId;
    itemByIndexId.set(indexId, listItem);
  }

  console.log('Found', listItems.length, 'in Watchlist');

  for (const media of indexMedia) {
    const mediaId: number = media.id;
    const listItem: UserMediaListItem | undefined = itemByIndexId.get(mediaId);

    const nestedMedia: MediaResponse | SeasonResponse | null =
      getMediaFromIndexMedia(media);

    if (listItem !== undefined && nestedMedia !== null) {
      nestedMedia.userWatchlist = listItem;
      media.inActiveUserWatchlist = true;
    } else {
      media.inActiveUserWatchlist =
        media.inActiveUserWatchlist !== undefined
          ? media.inActiveUserWatchlist
          : false;
    }
  }
  return indexMedia;
};

//to get a users watchlist with some options for light or heavy fetches
export const getUserWatchlist = async ({
  userId,
  includeItems,
  includeItemsIndexMedia,
}: FindWatchlistOptions): Promise<UserMediaList | null> =>
  await UserMediaList.findOne({
    where: {
      userId,
      name: 'Watchlist',
      canBeModified: false,
      icon: 'watchlist',
    },
    include: includeItems
      ? [
          {
            association: 'listItems',
            include: includeItemsIndexMedia
              ? [
                  {
                    association: 'indexMedia',
                    include: buildIndexMediaInclude(),
                  },
                ]
              : [],
          },
        ]
      : [],
    order: includeItems ? [['listItems', 'updatedAt', 'DESC']] : [],
  });
