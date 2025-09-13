import React from 'react';
import {
  ScrollData,
  useVerticalScroll,
} from '../../../hooks/use-verticall-scroll';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import IconArrowRight from '../Icons/Arrows/IconArrowRight';
import IconArrowLeft from '../Icons/Arrows/IconArrowLeft';

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
      <div className={'pr-5'}>
        {canScrollL && (
          <>
            <div
              className={mergeClassnames(
                borderBaseClasses,
                'left-0 pl-5 bg-gradient-to-r',
                borderSize,
                bordersColor
              )}
            />
            <div
              className={
                'absolute flex h-full items-center align-middle -translate-x-2 z-10 '
              }
            >
              <div
                className={
                  'transition-all duration-75 bg-gray-100 rounded shadow/30 w-10 h-20  text-center text-gray-400 cursor-pointer hover:-translate-x-0.75'
                }
                onMouseDown={() => {
                  reference.current?.scrollBy({
                    left: -400,
                    top: 0,
                    behavior: 'smooth',
                  });
                }}
              >
                <IconArrowLeft
                  width={25}
                  className={
                    'flex items-center h-full w-full align-middle justify-center'
                  }
                />
              </div>
            </div>
          </>
        )}
        {canScrollR && (
          <>
            <div
              className={mergeClassnames(
                borderBaseClasses,
                'right-0 mr-5 bg-gradient-to-l',
                borderSize,
                bordersColor
              )}
            >
              <div
                className={
                  'absolute flex h-full items-center align-middle z-30'
                }
              >
                <div
                  className={
                    'transition-all duration-75 bg-gray-100 rounded shadow/30 w-10 h-20 right-1 text-center text-gray-400 cursor-pointer hover:translate-x-0.75'
                  }
                  onMouseDown={() => {
                    reference.current?.scrollBy({
                      left: 400,
                      top: 0,
                      behavior: 'smooth',
                    });
                  }}
                >
                  <span
                    className={
                      'flex items-center h-full w-full align-middle justify-center'
                    }
                  >
                    <IconArrowRight
                      width={25}
                      className={
                        'flex items-center h-full w-full align-middle justify-center'
                      }
                    />
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
        <div
          className="flex overflow-x-auto p-1.5 space-x-2 scrollbar-hide"
          ref={reference}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ScrollableDiv);
