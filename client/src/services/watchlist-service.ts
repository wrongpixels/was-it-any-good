import axios, { AxiosResponse } from 'axios';
import {
  IndexMediaResults,
  UserMediaListItemData,
} from '../../../shared/types/models';
import { WatchlistMutationOptions } from '../mutations/watchlist-mutations';
import { apiPaths } from '../../../shared/util/url-builder';

export const getUserWatchlist = async (userId: number, query: string) => {
  const { data }: AxiosResponse<IndexMediaResults> = await axios.post(
    apiPaths.watchlist.getFromUserId(userId, query)
  );
  return data;
};

export const getActiveUserWatchlist = async (query: string) => {
  console.log(apiPaths.watchlist.getFromActiveUser(query));
  const { data }: AxiosResponse<IndexMediaResults> = await axios.post(
    apiPaths.watchlist.getFromActiveUser(query)
  );
  return data;
};

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
