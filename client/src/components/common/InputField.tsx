//main Input Field component with default classnames and a builtin label.
//it also provides styling and a tick if 'isError' and 'isSuccess' have been
//provided by the use-inputfield hook.

import { JSX } from 'react';
import { mergeClassnames } from '../../utils/lib/tw-classname-merger';
import { InputFieldProps } from '../../types/input-field-types';
import { styles } from '../../constants/tailwind-styles';
import IconCheck from './icons/badges/IconCheck';

export const InputField = ({
  name,
  label,
  labelClassName,
  className,
  isError = false,
  isSuccess = false,
  ...props
}: InputFieldProps): JSX.Element | null => {
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
      <input
        id={name}
        className={mergeClassnames(
          `pl-1 py-0.5 pr-1 ring-cyan-400 border-none rounded ring-1 bg-white text-gray-800 text-sm hover:ring-amber-300 focus:outline-none focus:ring-2 focus:ring-starblue ${styles.inputField.rules(isError, isSuccess)}`,
          className
        )}
        {...props}
      />
      {!label && isSuccess && (
        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6.5">
          <IconCheck title="" className="text-green-500" width={20} />
        </span>
      )}
    </div>
  );
};
