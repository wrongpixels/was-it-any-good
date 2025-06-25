import { APIError } from '../../../shared/types/errors';

export const DEF_API_ERROR: APIError = {
  name: 'Error',
  message: 'There was an error with the request',
  status: 500,
};
