import { ChangeEvent, useState } from 'react';
import {
  InputFieldHookConfig,
  InputFieldHookValues,
  InputFieldProps,
} from '../types/input-field-types';

export const useInputField = ({
  name,
  initialValue = '',
  placeholder,
  type = 'text',
  label,
}: InputFieldHookConfig): InputFieldHookValues => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const reset = () => setValue(initialValue);

  const getProps = (): InputFieldProps => ({
    name,
    value,
    onChange,
    placeholder,
    type,
    label,
  });

  return {
    value,
    reset,
    getProps,
  };
};
