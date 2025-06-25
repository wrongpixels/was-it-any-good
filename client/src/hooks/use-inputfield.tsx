import { ChangeEvent, JSX, useMemo, useState } from 'react';

interface InputFieldProps {
  name: string;
  placeholder?: string;
  type?: string;
  labelClassName?: string;
  extraLabelClassName?: string;
  label?: string;
  className?: string;
  extraClassNames?: string;
}

interface InputFieldValues {
  value: string;
  field: JSX.Element;
  reset: VoidFunction;
}

export const useInputField = ({
  name,
  labelClassName = 'text-sm mr-2',
  extraLabelClassName,
  label,
  placeholder,
  type = 'text',
  className = 'pl-1 py-0.5 pr-1 rounded bg-white text-gray-800 text-sm',
  extraClassNames,
}: InputFieldProps): InputFieldValues => {
  const [value, setValue]: [
    string,
    React.Dispatch<React.SetStateAction<string>>,
  ] = useState('');
  const onChange: (e: ChangeEvent<HTMLInputElement>) => void = (
    e: ChangeEvent<HTMLInputElement>
  ) => setValue(e.target.value);
  const reset: () => void = (): void => setValue('');
  const field: JSX.Element = useMemo(
    () => (
      <div>
        {label && (
          <span
            className={`${labelClassName}${extraLabelClassName ? ` ${extraLabelClassName}` : ''}`}
          >
            {label}
          </span>
        )}
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          className={`${className}${extraClassNames ? ` ${extraClassNames}` : ''}`}
        />
      </div>
    ),
    [
      value,
      onChange,
      name,
      label,
      labelClassName,
      extraLabelClassName,
      placeholder,
      type,
      className,
      extraClassNames,
    ]
  );
  return { value, field, reset };
};
