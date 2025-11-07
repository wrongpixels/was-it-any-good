import { JSX, useState } from 'react';
import {
  MediaResponse,
  UserMediaListData,
} from '../../../../shared/types/models';
import { OptClassNameProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';
import { styles } from '../../constants/tailwind-styles';
import IconWatchlistRemove from '../Common/Icons/Lists/IconWatchlistRemove';
import IconChecklist from '../Common/Icons/Lists/IconCheckList';
import { useWatchlistMutation } from '../../mutations/watchlist-mutations';
import { useAnimationTrigger } from '../../hooks/use-animation-trigger';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { getMediaKey } from '../../utils/ratings-helper';

export const USER_LISTS_ENABLED: boolean = true;

interface UserListsProps extends OptClassNameProps {
  userLists?: UserMediaListData[];
  media: MediaResponse;
  userId: number;
}

const UserLists = ({
  userId,
  media,
  className: inheritedClassname,
}: UserListsProps): JSX.Element | null => {
  const watchlistMutation = useWatchlistMutation();
  //const inList: boolean = !!media.userWatchlist;
  const queryClient: QueryClient = useQueryClient();
  const [inList, setInList] = useState<boolean>(!!media.userWatchlist);
  const [watchTrigger, setWatchTrigger] = useAnimationTrigger();
  const toggleWatchlist = () => {
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
          setInList((oldInList) => !oldInList);
          queryClient.refetchQueries({
            queryKey: getMediaKey(media.mediaType, media.id),
            type: 'all',
          });
          setWatchTrigger();
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
    <div
      className={mergeClassnames(
        `${styles.poster.regular()} to-gray-50 via-gray-100/70 flex flex-row items-center justify-around h-auto min-h-0 gap-1.5`,
        inheritedClassname
      )}
    >
      <div
        className="flex flex-row gap-2 cursor-pointer pl-1"
        onClick={toggleWatchlist}
      >
        <IconWatchlistRemove
          width={17}
          className={`
        ${!inList ? 'text-gray-300' : 'text-starbright'}
        transition-all duration-150 ease-in-out ${watchTrigger && (inList ? 'scale-140 rotate-6 animate-bounce [animation-iteration-count:1]' : 'animate-ping scale-110 [animation-iteration-count:1]')} `}
        />
        <span
          className={`transition-all text-xs font-normal ${watchTrigger && (inList ? 'animate-pulse opacity-0 scale-102' : 'animate-shake')} ${(inList && 'text-amber-900/50') || 'text-gray-350'}`}
        >
          {`${inList ? 'In your ' : 'Add to '}Watchlist`}
        </span>
      </div>
      <div className="flex flex-row gap-2 items-center align-middle">
        <IconChecklist
          className={'border-l pl-2 border-gray-200 text-gray-400'}
          height={25}
        />
      </div>
    </div>
  );
};

export default UserLists;
