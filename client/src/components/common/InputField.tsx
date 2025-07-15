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
  ...rest
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
          'pl-1 py-0.5 pr-1 rounded bg-white text-gray-800 text-sm',
          className
        )}
        {...rest}
      />
    </div>
  );
};
