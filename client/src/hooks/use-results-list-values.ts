//a hook that gives us the logic to manipulate the results of a BrowsePage via
//its Tanstack Queries.
//Mainly meant to control the changes on a List from individual SearchCards
import {
  QueryClient,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { MediaType } from '../../../shared/types/media';
import {
  useWatchlistMutation,
  WatchlistMutationOptions,
} from '../mutations/watchlist-mutations';
import { getMediaKey } from '../utils/ratings-helper';
import {
  IndexMediaData,
  IndexMediaResults,
  RatingData,
  RatingResults,
  UserListValues,
  UserMediaListItemData,
} from '../../../shared/types/models';

//extended version with the Operations incorporated
export interface BrowseCacheOps {
  userListValues: UserListValues;
  listMutation:
    | UseMutationResult<
        UserMediaListItemData,
        Error,
        WatchlistMutationOptions,
        unknown
      >
    | undefined;
  resetBrowseCache: (mediaType?: MediaType, id?: number | null) => void;
  removeFromBrowseCache: (indexId?: number | null) => void;
}

const useBrowseCacheOps = (
  results: IndexMediaResults | RatingResults,
  queryKey: string[] | undefined
) => {
  const queryClient: QueryClient = useQueryClient();

  //the logic that removes a media entry from the current Browse cache
  const removeFromBrowseCache = (indexId?: number | null): void => {
    if (queryKey && indexId) {
      switch (results.resultsType) {
        case 'browse':
          queryClient.setQueryData<IndexMediaResults>(queryKey, {
            ...results,
            totalResults: results.totalResults - 1,
            indexMedia: results.indexMedia.filter(
              (im: IndexMediaData) => im.id !== indexId
            ),
          });
          break;
        case 'votes':
          queryClient.setQueryData<RatingResults>(queryKey, {
            ...results,
            totalResults: results.totalResults - 1,
            ratings: results.ratings.filter(
              (rd: RatingData) => rd.indexId !== indexId
            ),
          });
      }
    }
  };

  //the logic that refreshes the current state of the list and optionally, removes the cache of a specific media entry
  const resetBrowseCache = (
    mediaType?: MediaType,
    id?: number | null
  ): void => {
    console.log('Resetting:', queryKey, 'for media:', id);

    //we refetch the current list query to show the changes
    queryClient.refetchQueries({
      queryKey,
    });

    if (mediaType && id) {
      queryClient.removeQueries({
        queryKey: getMediaKey(mediaType, id),
      });
    }
  };
  const listMutation =
    queryKey && results.userListValues ? useWatchlistMutation() : undefined;
  const browseCacheOps: BrowseCacheOps | undefined = results.userListValues
    ? {
        userListValues: results.userListValues,
        resetBrowseCache,
        removeFromBrowseCache,
        listMutation,
      }
    : undefined;

  return browseCacheOps;
};

export default useBrowseCacheOps;
