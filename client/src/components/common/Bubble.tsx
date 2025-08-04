import { OptStringProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

const Bubble = ({ text, className, ...rest }: OptStringProps) => {
  const finalClassName = mergeClassnames(
    'text-xs font-medium px-2 pb-0.25 rounded-xl text-sky-800 overflow-clip bg-gradient-to-t from-starbright/60 to-starbright/40',
    className
  );

  return (
    <span {...rest} className={finalClassName}>
      {text}
    </span>
  );
};

export default Bubble;
