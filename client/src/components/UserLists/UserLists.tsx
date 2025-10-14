import { JSX } from 'react';
import { UserMediaListData } from '../../../../shared/types/models';
import { OptClassNameProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';
import { styles } from '../../constants/tailwind-styles';

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
        `${styles.poster.regular()} flex flex-col items-center h-auto min-h-0`,
        inheritedClassname
      )}
    >
      Test
    </div>
  );
};

export default UserLists;
