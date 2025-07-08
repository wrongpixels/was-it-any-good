import { APIError } from '../types/errors';

export const SESSION_AUTH_ERROR: string = 'SessionAuthError';

export const DEF_API_ERROR: APIError = {
  name: 'Error',
  message: 'There was an error with the request',
  status: 500,
};
