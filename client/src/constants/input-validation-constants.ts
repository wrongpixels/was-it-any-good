import { InputValidation } from '../types/input-field-types';

export const INPUT_VALIDATION_SKIP: InputValidation = {
  isError: false,
  isSuccess: false,
  errorMessage: '',
};
export const INPUT_VALIDATION_ERROR: InputValidation = {
  isError: true,
  isSuccess: false,
  errorMessage: '',
};
export const INPUT_VALIDATION_SUCCESS: InputValidation = {
  isError: false,
  isSuccess: true,
  errorMessage: '',
};
