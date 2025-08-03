import React from 'react';
import {
  ScrollData,
  useVerticalScroll,
} from '../../hooks/use-verticall-scroll';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

//a custom div to convert long lists into horizontal scrollable areas with the mousewheel.
//default fade color and size is overriden with classnames merged with tailwind merge
interface ScrollableDivProps extends React.HTMLAttributes<HTMLDivElement> {
  bordersColor?: string;
  borderSize?: string;
}
const ScrollableDiv = ({
  bordersColor = 'from-gray-50',
  borderSize = 'w-6',
  children,
  className,
  ...rest
}: ScrollableDivProps) => {
  const { reference, canScrollR, canScrollL }: ScrollData = useVerticalScroll();

  const borderBaseClasses = 'absolute top-0 h-full to-transparent z-10';

  return (
    <div {...rest} className={mergeClassnames('relative', className)}>
      {canScrollL && (
        <div
          className={mergeClassnames(
            borderBaseClasses,
            'left-0 pl-5 bg-gradient-to-r',
            borderSize,
            bordersColor
          )}
        />
      )}
      {canScrollR && (
        <div
          className={mergeClassnames(
            borderBaseClasses,
            'right-0 pr-5 bg-gradient-to-l',
            borderSize,
            bordersColor
          )}
        />
      )}
      <div
        className="flex overflow-x-auto p-1.5 space-x-2 scrollbar-hide"
        ref={reference}
      >
        {children}
      </div>
    </div>
  );
};

export default React.memo(ScrollableDiv);
