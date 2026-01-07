import { ChangeEvent } from 'react';
import {
  BaseInputHook,
  TextAreaHookValues,
  TextAreaProps,
} from '../types/input-field-types';
import { useBaseInput } from './use-base-input';

export const useTextArea = ({
  name,
  rules,
  initialValue = '',
  placeholder,
  type = 'text',
  label,
  onChange: lateOnChange,
}: BaseInputHook): TextAreaHookValues => {
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

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    //while typing, we update the value
    setValue(e.target.value);
    //we also trigger any additional onChange passed
    lateOnChange?.();
  };

  const getProps = (): TextAreaProps => ({
    name,
    value,
    onChange,
    placeholder,
    //we disable autocomplete for text areas
    autoComplete: undefined,
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
