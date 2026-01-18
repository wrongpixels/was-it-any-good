import { useMemo, useState } from 'react';
import {
  BaseInputHookValues,
  InputValidation,
  BaseInputHookConfig,
} from '../types/input-field-types';
import validateRules from '../utils/input-field-validator';

export const useBaseInput = ({
  rules,
  initialValue = '',
}: BaseInputHookConfig): BaseInputHookValues => {
  //the input field content state
  const [value, setValue] = useState(initialValue);

  //the states to keep and update the isError, isSuccess and errorMessage.
  //we use the states from validation as defaults, but we can override them
  //with setIsError and setIsSuccess for async operations in the component.
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  //we run a custom solution to validate the rules.
  const validatedData: InputValidation = useMemo(
    () => validateRules(value, rules),
    [value]
  );

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

  return {
    value,
    setValue,
    reset,
    isError: isError || validatedData.isError,
    isSuccess: isSuccess || validatedData.isSuccess,
    errorMessage: errorMessage || validatedData.errorMessage,
    setError,
    setSuccess,
  };
};
