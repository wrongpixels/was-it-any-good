import { JSX } from 'react';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';

export interface TagContent {
  text?: string | number | null;
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
  if (!text && !icon) {
    return null;
  }
  return (
    <div
      title={title ?? text}
      className={mergeClassnames(
        ' font-semibold cursor-pointer absolute text-white text-xs bg-starbright rounded-full px-2 py-0.5 shadow/60 flex flex-row gap-1.25 items-center',
        className
      )}
    >
      {icon} <div className="w-0 flex h-3 border-r-2 border-white/25" />
      {text}
    </div>
  );
};

export default Tag;
