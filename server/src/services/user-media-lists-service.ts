import { UserMediaList } from '../models';

//to get a users watchlist
export const getUserWatchlist = async (
  userId: number | string
): Promise<UserMediaList | null> =>
  await UserMediaList.findOne({
    where: {
      userId,
      name: 'watchlist',
      canBeModified: false,
      icon: 'watchlist',
    },
  });
