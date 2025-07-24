import { JSX } from 'react';
import { mergeClassnames } from '../utils/lib/tw-classname-merger';
import { styles } from '../constants/tailwind-styles';

const NotFound = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <span className="font-bold text-2xl"> Page not found!</span>
      <span className="font-normal text-lg">(And we really tried)</span>
      <span className={mergeClassnames('text-white', styles.test.redBg2)}>
        HIIIIIII
      </span>
    </div>
  );
};

export default NotFound;
