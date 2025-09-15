import React from 'react';
import {
  useVerticalScroll,
  ScrollData,
} from '../../../hooks/use-vertical-scroll';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import IconArrowRight from '../Icons/Arrows/IconArrowRight';
import IconArrowLeft from '../Icons/Arrows/IconArrowLeft';

//a custom div to convert long lists into horizontal scrollable areas with the mousewheel.
//default fade color and size is overriden with classnames merged with tailwind merge
interface ScrollableDivProps extends React.HTMLAttributes<HTMLDivElement> {
  bordersColor?: string;
  borderSize?: string;
}

const ScrollableDiv: React.FC<ScrollableDivProps> = ({
  bordersColor = 'from-gray-50',
  borderSize = 'w-6',
  children,
  className,
  ...rest
}) => {
  const {
    reference,
    canScrollR,
    canScrollL,
    scrollLeft,
    scrollRight,
  }: ScrollData = useVerticalScroll();

  const borderBaseClasses: string =
    'absolute top-0 h-full to-transparent z-10 pointer-events-none';
  const buttonContainerBaseClasses: string =
    'absolute flex h-full items-center top-0 z-20 transition-opacity duration-200';
  const buttonBaseClasses: string =
    'bg-gray-100 border border-gray-300 rounded shadow/30 w-10 h-20 text-center text-gray-400 cursor-pointer';

  return (
    <div {...rest} className={mergeClassnames('relative mr-4', className)}>
      <div
        className={mergeClassnames(
          borderBaseClasses,
          'left-0 pl-5 bg-gradient-to-r',
          borderSize,
          bordersColor,
          canScrollL ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        className={mergeClassnames(
          buttonContainerBaseClasses,
          'left-0',
          canScrollL ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className={mergeClassnames(
            buttonBaseClasses,
            'transition-transform hover:-translate-x-0.5'
          )}
          onClick={scrollLeft}
        >
          <IconArrowLeft
            width={25}
            className={'flex items-center h-full w-full justify-center'}
          />
        </div>
      </div>

      <div
        className={mergeClassnames(
          borderBaseClasses,
          'right-0 pr-5 bg-gradient-to-l',
          borderSize,
          bordersColor,
          canScrollR ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        className={mergeClassnames(
          buttonContainerBaseClasses,
          'right-0',
          canScrollR ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className={mergeClassnames(
            buttonBaseClasses,
            'transition-transform hover:translate-x-0.5'
          )}
          onClick={scrollRight}
        >
          <span className={'flex items-center h-full w-full justify-center'}>
            <IconArrowRight
              width={25}
              className={'flex items-center h-full w-full justify-center'}
            />
          </span>
        </div>
      </div>

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
