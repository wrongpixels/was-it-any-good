import { OptClassNameProps } from '../../types/common-props-types';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

interface CloseButtonPros extends OptClassNameProps {
  onClick: () => void;
}

const CloseButton = ({ onClick, className }: CloseButtonPros) => {
  return (
    <button
      type="button"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
      aria-label="Close"
      className={mergeClassnames(
        'text-gray-400 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-150 hover:bg-red-600/30 hover:text-white',
        className
      )}
    >
      ✖
    </button>
  );
};

export default CloseButton;
