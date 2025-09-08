import { ChangeEvent, useEffect, useState } from 'react';
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
  //the input field content state
  const [value, setValue] = useState(initialValue);

  //the states to keep and update the isError, isSuccess and errorMessage.
  //we use the states from validation as defaults, but we can override them
  //with setIsError and setIsSuccess for async operations in the component.
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //we run a custom solution to validate the rules.
  let validatedData: InputFieldValidation = validateRules(value, rules);
  console.log(validatedData);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    //while typing, we update the value
    setValue(e.target.value);
  };

  //we apply the fresh validated results to the states so are always synched
  useEffect(() => {
    setIsError(validatedData.isError);
    setIsSuccess(validatedData.isSuccess);
    setErrorMessage(validatedData.errorMessage);
  }, [value]);

  const reset = () => setValue(initialValue);

  //a function to set errors easily
  const setError = (message: string): void => {
    setIsError(true);
    setIsSuccess(false);
    setErrorMessage(message);
  };

  //a function to set isSuccess easily
  const setSuccess = (): void => {
    setIsError(false);
    setIsSuccess(true);
    setErrorMessage('');
  };

  const getProps = (): InputFieldProps => ({
    name,
    value,
    onChange,
    placeholder,
    type,
    label,
    isError,
    isSuccess,
    visualValidation: rules?.visualValidation,
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
    setError,
    setSuccess,
  };
};
