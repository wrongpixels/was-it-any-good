//main Input Field component with default classnames and a builtin label.
//it also provides styling and a tick if 'isError' and 'isSuccess' have been
//provided by the use-inputfield hook.

import { JSX } from 'react';
import { mergeClassnames } from '../../../utils/lib/tw-classname-merger';
import { TextAreaProps } from '../../../types/input-field-types';
import { styles } from '../../../constants/tailwind-styles';

export const TextArea = ({
  name,
  label,
  labelClassName,
  className,
  visualValidation = false,
  isError = false,
  isSuccess = false,
  minLength = 2,
  maxLength = 500,
  ...props
}: TextAreaProps): JSX.Element | null => {
  if (!name) {
    return null;
  }
  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={name}
          className={mergeClassnames('text-sm mr-2', labelClassName)}
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        minLength={minLength}
        maxLength={maxLength}
        className={mergeClassnames(
          `w-full pl-1 py-0.5 pr-2 ring-cyan-400 border-none rounded ring-1 bg-white text-gray-800 text-sm hover:ring-amber-300 focus:outline-none focus:ring-2 focus:ring-starblue ${styles.inputField.rules(visualValidation && isError, visualValidation && isSuccess)} min-h-30`,
          className
        )}
        {...props}
      />
    </div>
  );
};
