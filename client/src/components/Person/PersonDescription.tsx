import { JSX, memo } from 'react';
import { OptStringProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

//a component that shows a description for People, either by formatting and
//adapting the TMDB biography or building our own with the data we have

const baseClassName: string = 'text-sm text-gray-400 italic text-justify';

const PersonDescription = ({
  text,
  className,
}: OptStringProps): JSX.Element | null => {
  if (!text) {
    return null;
  }
  return (
    <div className={mergeClassnames(baseClassName, className)}>{text}</div>
  );
};

export default memo(PersonDescription);
