import { SESSION_AUTH_ERROR } from '../../../shared/constants/error-constants';

class CustomError extends Error {
  status: number;
  constructor(
    message: string = 'There was an error with the request',
    status: number = 500,
    name: string = 'Error'
  ) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export class AuthError extends CustomError {
  constructor(
    message: string = 'Access not authorized.',
    name: string = 'AuthError'
  ) {
    super(message, 401, name);
  }
}

export class SessionAuthError extends AuthError {
  constructor(message: string = 'Session is no longer valid') {
    console.log('called');
    super(message, SESSION_AUTH_ERROR);
  }
}

export default CustomError;
