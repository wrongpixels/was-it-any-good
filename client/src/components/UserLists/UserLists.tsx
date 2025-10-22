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
  const [inList, setInList] = useState<boolean>(!!media.userWatchlist);

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

  return (
    <div
      className={mergeClassnames(
        `${styles.poster.regular()} flex flex-row items-center justify-around h-auto min-h-0 gap-1.5`,
        inheritedClassname
      )}
    >
      <div
        className="flex flex-row gap-1 cursor-pointer"
        onClick={toggleWatchlist}
      >
        <IconWatchlistRemove
          width={17}
          className={!inList ? 'text-gray-300' : 'text-starblue'}
        />
        <span className="text-xs font-normal text-gray-350">
          {`${inList ? 'Remove from ' : 'Add to '}Watchlist`}
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
