//main Input Field component with default classnames and a builtin label.
//
import { JSX } from 'react';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';
import { InputFieldProps } from '../../types/input-field-types';

export const InputField = ({
  name,
  label,
  labelClassName,
  className,
  ...props
}: InputFieldProps): JSX.Element | null => {
  if (!name) {
    return null;
  }
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className={mergeClassnames('text-sm mr-2', labelClassName)}
        >
          {label}
        </label>
      )}
      <input
        id={name}
        className={mergeClassnames(
          'pl-1 py-0.5 pr-1 ring-cyan-400 border-none rounded ring-1 bg-white text-gray-800 text-sm hover:ring-amber-300 focus:outline-none focus:ring-2 focus:ring-starblue',
          className
        )}
        {...props}
      />
    </div>
  );
};
