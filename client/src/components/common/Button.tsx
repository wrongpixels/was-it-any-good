import { JSX } from 'react';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'toolbar';
  size?: 'sm' | 'md' | 'lg' | 'xs';
  extraClassNames?: string;
}

const colors = (variant: string): string => {
  switch (variant) {
    case 'toolbar':
    case 'secondary':
      return 'bg-blue-400 hover:bg-blue-300 border-gray-300 border-1 text-white';
    case 'toolbar':
      return 'bg-blue-400 hover:bg-blue-300 border-gray-300 border-1 text-white';
    default:
      return 'bg-starbutton hover:bg-starbrighter border-gray-300 border-1 text-white';
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
  ...props
}: ButtonProps): JSX.Element | null => {
  if (!children) {
    return null;
  }

  return (
    <button
      type="button"
      {...props}
      className={mergeClassnames(
        `${colors(variant)} ${sizes(size)} rounded px-2 shadow-sm font-medium leading-none`,
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
