import { JSX } from 'react';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'toolbar'
    | 'accept'
    | 'cancel'
    | 'dropdown';
  size?: 'sm' | 'md' | 'lg' | 'xs';
  extraClassNames?: string;
  pressed?: boolean;
}

const colors = (variant: string): string => {
  switch (variant) {
    case 'accept':
      return 'bg-button-green hover:bg-button-green-hover ring-gray-300 ring-1 text-white';
    case 'dropdown':
      return 'bg-gray-200 hover:bg-button-gray-200 border-gray-400/50 border text-gray-600 hover:ring hover:ring-amber-200 focus:outline-none focus:ring focus:ring-sky-400 focus:ring-offset-0 active:outline-none active:ring active:ring-sky-300';
    case 'cancel':
      return 'bg-red-400 hover:bg-red-300 ring-gray-300 ring-1 text-white';
    case 'secondary':
    case 'toolbar':
      return 'bg-blue-400 hover:bg-blue-300 ring-gray-300 ring-1 text-white';
    default:
      return 'relative bg-starbutton hover:bg-starbrighter border-1 border-black/15 text-white before:absolute before:inset-x-0.5 before:top-0 before:h-px before:bg-white/30 mx-0.25';
  }
};

const sizes = (size: string): string => {
  switch (size) {
    case 'xs':
      return 'text-xs h-7 min-h-7 flex items-center';
    case 'sm':
      return 'text-sm h-8 min-h-8 flex items-center';
    case 'lg':
      return 'text-lg h-10 min-h-10 flex items-center';
    case 'xl':
      return 'text-xl h-12 min-h-12 flex items-center';
    default:
      return 'text-base h-8 min-h-8 flex items-center';
  }
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: ButtonProps): JSX.Element | null => {
  if (!children) {
    return null;
  }

  return (
    <button
      type="button"
      disabled={disabled}
      {...props}
      className={mergeClassnames(
        `${colors(variant)} ${sizes(size)} rounded-sm px-2 drop-shadow-sm/20 font-medium leading-none`,
        `${className} ${disabled ? 'opacity-50 animate-none cursor-not-allowed' : ''}`
      )}
    >
      {children}
    </button>
  );
};

export default Button;
