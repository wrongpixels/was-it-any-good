import { OptStringProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

const mediaBubbleClassName: string =
  'text-xs font-medium px-2 pb-0.25 rounded-xl text-starblue overflow-clip ring ring-starbright hover:bg-starbright hover:text-white bg-starbright/25';

const cardBubbleClassName: string =
  'text-xs font-medium px-2 pb-0.25 rounded-xl text-stardark  overflow-clip border border-starblue bg-starbright/25';

interface BubbleProps extends OptStringProps {
  type?: 'media' | 'card';
}

const Bubble = ({ text, className, type = 'card', ...rest }: BubbleProps) => {
  const finalClassName: string = mergeClassnames(
    type === 'media' ? mediaBubbleClassName : cardBubbleClassName,
    className
  );

  return (
    <span {...rest} className={finalClassName}>
      {text}
    </span>
  );
};

export default Bubble;
