import axios, { AxiosResponse } from 'axios';
import { UserMediaListItemData } from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';
import { WatchlistMutationOptions } from '../mutations/watchlist-mutations';

export const toggleFromWatchlist = async ({
  inList,
  userId,
  indexId,
}: WatchlistMutationOptions): Promise<UserMediaListItemData> =>
  inList
    ? removeFromWatchlist(userId, indexId)
    : addToWatchlist(userId, indexId);

export const addToWatchlist = async (userId: number, indexId: number) => {
  const { data }: AxiosResponse<UserMediaListItemData> = await axios.post(
    apiPaths.watchlist.toggleIndexMedia(userId, indexId)
  );
  return data;
};

export const removeFromWatchlist = async (userId: number, indexId: number) => {
  const { data }: AxiosResponse<UserMediaListItemData> = await axios.delete(
    apiPaths.watchlist.toggleIndexMedia(userId, indexId)
  );
  return data;
};
