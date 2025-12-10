import { JSX } from 'react';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';

export interface TagContent {
  text: string;
  title: string;
  icon?: JSX.Element;
  className?: string;
}

const Tag = ({
  text,
  title,
  className,
  icon,
}: TagContent): JSX.Element | null => {
  if (!text) {
    return null;
  }
  return (
    <div
      title={title ?? text}
      className={mergeClassnames(
        ' font-semibold cursor-pointer absolute text-white text-xs bg-starbright rounded-full px-2 py-0.5 shadow/60',
        className
      )}
    >
      {icon}
      {text}
    </div>
  );
};

export default Tag;
