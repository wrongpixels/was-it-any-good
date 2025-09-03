import { InputFieldValidation } from '../types/input-field-types';

export const INPUT_VALIDATION_SKIP: InputFieldValidation = {
  isError: false,
  isSuccess: false,
  errorMessage: '',
};
export const INPUT_VALIDATION_ERROR: InputFieldValidation = {
  isError: true,
  isSuccess: false,
  errorMessage: '',
};
export const INPUT_VALIDATION_SUCCESS: InputFieldValidation = {
  isError: false,
  isSuccess: true,
  errorMessage: '',
};
