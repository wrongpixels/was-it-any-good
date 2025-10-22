import { useMutation } from '@tanstack/react-query';
import { toggleFromWatchlist } from '../services/watchlist-service';

export interface WatchlistMutationOptions {
  inList: boolean;
  indexId: number;
  userId: number;
}

export const useWatchlistMutation = () => {
  return useMutation({
    mutationFn: (options: WatchlistMutationOptions) =>
      toggleFromWatchlist(options),
  });
};
