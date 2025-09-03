import { hasNumber } from '../../../shared/helpers/format-helper';
import {
  INPUT_VALIDATION_SKIP,
  INPUT_VALIDATION_ERROR,
  INPUT_VALIDATION_SUCCESS,
} from '../constants/input-validation-constants';
import {
  InputFieldRules,
  InputFieldValidation,
} from '../types/input-field-types';

const validateRules = (
  input: string | null,
  rules?: InputFieldRules
): InputFieldValidation => {
  if (!rules || !input || input.length < 2) {
    return INPUT_VALIDATION_SKIP;
  }
  if (!!rules.minLength) {
    //we don't allow negative numbers or 0.
    if (rules.minLength < 1) {
      rules.minLength = 1;
    }
    if (input.length < rules.minLength)
      return {
        ...INPUT_VALIDATION_ERROR,
        errorMessage: `Use at least ${rules.minLength} characters`,
      };
  }
  if (!!rules.maxLength) {
    //we don't allow negative numbers or 0.
    if (rules.maxLength < 1) {
      rules.maxLength = 1;
    }
    //we don't allow setting it bellow minLength if existing.
    if (rules.minLength && rules.maxLength < rules.minLength) {
      rules.maxLength = rules.minLength;
    }
    if (input.length > rules.maxLength)
      return {
        ...INPUT_VALIDATION_ERROR,
        errorMessage: `Use less than ${rules.maxLength} characters`,
      };
  }
  if (!!rules.includeNumber) {
    if (!hasNumber(input))
      return {
        ...INPUT_VALIDATION_ERROR,
        errorMessage: 'Use at least a number',
      };
  }
  return INPUT_VALIDATION_SUCCESS;
};

export default validateRules;
