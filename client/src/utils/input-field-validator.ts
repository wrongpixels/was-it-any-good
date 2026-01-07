import { hasNumber, isEmail } from '../../../shared/helpers/format-helper';
import {
  INPUT_VALIDATION_SKIP,
  INPUT_VALIDATION_ERROR,
  INPUT_VALIDATION_SUCCESS,
} from '../constants/input-validation-constants';
import { InputRules, InputValidation } from '../types/input-field-types';

const validateRules = (
  input: string | null,
  rules?: InputRules
): InputValidation => {
  if (!rules || !input || input.length < 1) {
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
  if (!!rules.blackList) {
    const lowerCase: string = input.toLowerCase();
    if (rules.blackList.includes(lowerCase)) {
      return {
        ...INPUT_VALIDATION_ERROR,
        errorMessage: 'You cannot use this word!',
      };
    }
  }
  if (!!rules.isEmail) {
    if (!isEmail(input)) {
      return {
        ...INPUT_VALIDATION_ERROR,
        errorMessage: 'Must be a valid e-mail format',
      };
    }
  }
  return INPUT_VALIDATION_SUCCESS;
};

export default validateRules;
