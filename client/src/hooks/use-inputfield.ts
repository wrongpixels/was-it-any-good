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

  //a custom solution to validate text input fields.
  const {
    isError: errorDefault,
    isSuccess: successDefault,
    errorMessage: defErrorMessage,
  }: InputFieldValidation = validateRules(value, rules);

  //the states to keep and update the isError, isSuccess and errorMessage.
  //we use the states from validation as defaults, but we can override them
  //with setIsError and setIsSuccess for async operations in the component.
  const [isError, setIsError] = useState(errorDefault);
  const [isSuccess, setIsSuccess] = useState(successDefault);
  const [errorMessage, setErrorMessage] = useState(defErrorMessage);

  const getProps = (): InputFieldProps => ({
    name,
    value,
    onChange,
    placeholder,
    type,
    label,
    isError,
    isSuccess,
    maxLength: rules?.maxLength,
    minLength: rules?.minLength,
  });

  return {
    value,
    setValue,
    reset,
    getProps,
    isError,
    isSuccess,
    errorMessage,
    setIsError,
    setIsSuccess,
    setErrorMessage,
  };
};
