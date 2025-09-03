import { InputFieldValidation } from '../types/input-field-types';

export const INPUT_VALIDATION_SKIP: InputFieldValidation = {
  isError: false,
  isValidated: false,
  errorMessage: '',
};
export const INPUT_VALIDATION_ERROR: InputFieldValidation = {
  isError: true,
  isValidated: false,
  errorMessage: '',
};
export const INPUT_VALIDATION_SUCCESS: InputFieldValidation = {
  isError: true,
  isValidated: false,
  errorMessage: '',
};
