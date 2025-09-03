import { ChangeEvent, useState } from 'react';
import {
  InputFieldHookConfig,
  InputFieldHookValues,
  InputFieldProps,
  InputFieldValidation,
} from '../types/input-field-types';
import validateRules from '../utils/input-field-validator';

export const useInputField = ({
  name,
  rules,
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
    maxLength: rules?.maxLength,
    minLength: rules?.minLength,
  });
  //a custom solution to validate text input fields
  const { isError, isSuccess, errorMessage }: InputFieldValidation =
    validateRules(value, rules);

  return {
    value,
    setValue,
    reset,
    getProps,
    isError,
    isSuccess,
    errorMessage,
  };
};
