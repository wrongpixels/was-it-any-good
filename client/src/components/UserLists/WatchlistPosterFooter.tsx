import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { JSX, useState, useEffect } from 'react';
import { styles } from '../../constants/tailwind-styles';
import { NotificationContextValues } from '../../context/NotificationProvider';
import { useAnimationTrigger } from '../../hooks/use-animation-trigger';
import { useWatchlistMutation } from '../../mutations/watchlist-mutations';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';
import { getMediaKey } from '../../utils/ratings-helper';
import IconWatchlistRemove from '../Common/Icons/Lists/IconWatchlistRemove';
import { USER_LISTS_ENABLED } from './UserLists';
import { MediaResponse, SeasonResponse } from '../../../../shared/types/models';
import { OptClassNameProps } from '../../types/common-props-types';
import IconWatchlistAdd from '../Common/Icons/Lists/IconWatchlistAdd';

const LABEL_IN: string = 'In Watchlist' as const;
const LABEL_ADD: string = 'Add to Watchlist' as const;
const LABEL_REMOVE: string = 'Remove' as const;

interface WatchlistPosterFooterProps extends OptClassNameProps {
  media: MediaResponse | SeasonResponse;
  mouseOverPoster: boolean;
  notification: NotificationContextValues;
  userId?: number;
}

const WatchlistPosterFooter = ({
  media,
  mouseOverPoster,
  userId,
  notification,
  className: inheritedClassname,
}: WatchlistPosterFooterProps): JSX.Element | null => {
  const { setNotification, anchorRef } = notification;
  const watchlistMutation = useWatchlistMutation();
  //const inList: boolean = !!media.userWatchlist;
  const queryClient: QueryClient = useQueryClient();
  const [inList, setInList] = useState<boolean>(!!media.userWatchlist);
  const [mouseOverWatchlist, setMouseOverWatchlist] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [watchTrigger, setWatchTrigger] = useAnimationTrigger();

  //if the watchlist disappears from the media due to voting, we trigger an setInList
  useEffect(() => {
    if (media.userWatchlist) {
      setInList(true);
    } else if (inList) {
      setNotification({
        message: `'${media.name}' was ${inList ? 'removed\nfrom' : 'added\nto'} Watchlist!`,
        anchorRef,
        offset: { x: 0, y: -5 },
      });
      setInList(false);
      setWatchTrigger();
    }
  }, [media.userWatchlist]);

  const watchlistLabel: string = media.userWatchlist
    ? mouseOverWatchlist && !justVoted
      ? LABEL_REMOVE
      : LABEL_IN
    : LABEL_ADD;

  if (userId === undefined) {
    return null;
  }

  const toggleWatchlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (watchlistMutation.isPending || justVoted) {
      return;
    }
    setWatchTrigger();
    setJustVoted(watchlistLabel === LABEL_ADD);
    setInList((oldInList) => !oldInList);
    setNotification({
      message: `'${media.name}' was \n${inList ? 'removed from your' : 'added to your'} Watchlist!`,
      anchorRef,
      offset: { x: 0, y: -5 },
    });
    watchlistMutation.mutate(
      {
        inList,
        userId,
        indexId: media.indexId,
      },
      {
        onSuccess: (result) => {
          console.log('Response data:', result);
          console.log('Mutation status:', watchlistMutation.status);
          queryClient.refetchQueries({
            queryKey: getMediaKey(media.mediaType, media.id),
            type: 'all',
          });
        },
        onError: (error) => {
          console.error('Request failed:', error);
        },
        onSettled: () => {
          console.log('Final state:', watchlistMutation.status);
        },
      }
    );
  };

  if (!USER_LISTS_ENABLED) {
    return null;
  }

  return (
    <button
      disabled={watchlistMutation.isPending || justVoted}
      onClick={toggleWatchlist}
      onMouseOver={() => {
        setMouseOverWatchlist(true);
        setJustVoted(false);
      }}
      onMouseOut={() => {
        setMouseOverWatchlist(false);
        setJustVoted(false);
      }}
      className={mergeClassnames(
        `flex flex-row gap-2 absolute w-full h-[40px] font-semibold text-xs text-white items-center justify-center bg-gradient-to-t from-starbright via-starbright to-starbright/75 transition-all -bottom-10 ${(media.userWatchlist || mouseOverPoster) && 'bottom-0'} ${!justVoted && (media.userWatchlist ? 'hover:from-red-400 hover:to-red-400/80 hover:via-red-400' : 'hover:from-notigreen hover:to-notigreen/70 hover:via-notigreen')}`,
        inheritedClassname
      )}
    >
      <div
        className={`
       
        transition-all duration-120 ease-in-out ${watchTrigger && (inList ? 'scale-140 rotate-6 animate-bounce [animation-iteration-count:1] text-amber-300' : 'animate-ping scale-110 [animation-iteration-count:1]')} `}
      >
        {watchlistLabel === LABEL_IN ||
        (watchlistLabel === LABEL_ADD && mouseOverWatchlist) ? (
          <IconWatchlistRemove width={17} className="drop-shadow-xs/30" />
        ) : (
          <IconWatchlistAdd width={17} className="drop-shadow-xs/30" />
        )}
      </div>
      <span className={styles.shadow.textShadow}>{watchlistLabel}</span>
    </button>
  );
};

export default WatchlistPosterFooter;
