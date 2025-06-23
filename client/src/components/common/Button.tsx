import { JSX } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'toolbar';
  size?: 'sm' | 'md' | 'lg' | 'xs';
  extraClassNames?: string;
}

const colors = (variant: string): string => {
  switch (variant) {
    case 'secondary':
      return 'bg-blue-400 hover:bg-blue-300 border-gray-300 border-1 text-white';
    case 'toolbar':
      return 'bg-blue-400 hover:bg-blue-300 border-gray-300 border-1 text-white';
    default:
      return 'bg-blue-400 hover:bg-blue-300 border-gray-300 border-1 text-white';
  }
};

const sizes = (size: string): string => {
  switch (size) {
    case 'xs':
      return 'font-medium text-xs';
    case 'sm':
      return 'font-medium text-sm';
    case 'lg':
      return 'font-medium text-lg';
    case 'xl':
      return 'font-medium text-xl';
    default:
      return 'bg-blue-400 hover:bg-blue-300 border-gray-300 border-1 text-white';
  }
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps): JSX.Element | null => {
  if (!children) {
    return null;
  }

  return (
    <button
      type="button"
      {...props}
      className={`${colors(variant)} ${sizes(size)} rounded px-2 shadow-sm`}
    >
      {children}
    </button>
  );
};

export default Button;
