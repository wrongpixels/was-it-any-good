import { ChangeEvent } from 'react';
import {
  BaseInputHook,
  InputFieldHookValues,
  InputFieldProps,
} from '../types/input-field-types';
import { useBaseInput } from './use-base-input';

export const useInputField = ({
  name,
  rules,
  initialValue = '',
  placeholder,
  autoComplete,
  type = 'text',
  label,
  onChange: lateOnChange,
}: BaseInputHook): InputFieldHookValues => {
  //we set up the basic logic from the shared hook
  const {
    value,
    setValue,
    reset,
    isError,
    isSuccess,
    errorMessage,
    setError,
    setSuccess,
  } = useBaseInput({
    rules,
    initialValue,
  });

  //set our type-safe change event
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    //while typing, we update the value
    setValue(e.target.value);
    //we also trigger any additional onChange passed
    lateOnChange?.();
  };

  //a function for fresh props on each call
  const getProps = (): InputFieldProps => ({
    name,
    value,
    onChange,
    placeholder,
    autoComplete,
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
