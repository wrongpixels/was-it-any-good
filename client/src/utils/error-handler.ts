import { AxiosError, isAxiosError } from 'axios';
import { APIError } from '../../../shared/types/errors';
import {
  DEF_API_ERROR,
  SESSION_AUTH_ERROR,
} from '../../../shared/constants/error-constants';
import { capitalize } from './common-format-helper';

export const isAPIError = (error: unknown): error is APIError => {
  return isAxiosError(error) && isAPIErrorType(extractAPIError(error));
};

export const getAPIError = (error: unknown): APIError | null => {
  if (isAxiosError(error)) {
    const apiError: APIError | null = extractAPIError(error);
    if (isAPIErrorType(apiError)) {
      return apiError;
    }
  }
  return null;
};

export const getAPIErrorMessage = (error: unknown): string =>
  capitalize(
    getAPIError(error)?.message || 'There was an error with the request.'
  );

export const isAPIErrorType = (error: unknown | null): error is APIError => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'status' in error &&
    'name' in error &&
    'message' in error
  );
};

const extractAPIError = (error: AxiosError): APIError | null => {
  const apiError: unknown | null = error.response?.data
    ? error.response.data
    : null;
  if (apiError && isAPIErrorType(apiError)) {
    return apiError;
  }
  return null;
};

const getByStatusCode = (error: unknown, status: number): APIError | null => {
  const apiError: APIError | null = getAPIError(error);
  if (apiError && apiError.status === status) {
    return apiError;
  }
  return null;
};

export const isAuthError = (error: APIError | null): error is APIError =>
  error?.status === 401;

export const isNotFoundError = (error: unknown): error is APIError =>
  !!getByStatusCode(error, 404);

export const getAuthError = (error: unknown): APIError | null =>
  getByStatusCode(error, 401);

export const isSessionAuthError = (error: unknown): boolean =>
  getAuthError(error)?.code === SESSION_AUTH_ERROR;

export const formatToAPIError = (error: unknown): APIError => {
  const apiError: APIError | null = getAPIError(error);
  if (apiError) {
    return apiError;
  }
  const newError: APIError = DEF_API_ERROR;
  if (!(error instanceof Error)) {
    return newError;
  }
  if (error instanceof AxiosError) {
    ((newError.name = error.response?.statusText || error.name),
      (newError.message = error.message),
      (newError.status = error.response?.status || newError.status));
  } else {
    newError.name = error.name;
    newError.message = error.message;
    newError.status = -1;
  }
  return newError;
};
