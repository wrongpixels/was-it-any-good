import { JSX } from 'react';
import { UserMediaListData } from '../../../../shared/types/models';
import { OptClassNameProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';
import { styles } from '../../constants/tailwind-styles';
import IconWatchlistRemove from '../Common/Icons/Lists/IconWatchlistRemove';
import IconChecklist from '../Common/Icons/Lists/IconCheckList';

interface UserListsProps extends OptClassNameProps {
  userLists?: UserMediaListData[];
}

const UserLists = ({
  //userLists,
  className: inheritedClassname,
}: UserListsProps): JSX.Element | null => {
  return (
    <div
      className={mergeClassnames(
        `${styles.poster.regular()} flex flex-row items-center justify-around h-auto min-h-0 gap-1.5`,
        inheritedClassname
      )}
    >
      <div className="flex flex-row gap-1.5">
        <IconWatchlistRemove width={17} className="text-gray-300" />{' '}
        <span className="text-xs font-normal text-gray-350">
          {'Add to Watchlist'}
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
