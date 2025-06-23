import { ChangeEvent, JSX, useState } from 'react';

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
  reset: () => void;
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
  const [value, setValue] = useState('');
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const reset = (): void => setValue('');
  const field = (
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
  );
  return { value, field, reset };
};
