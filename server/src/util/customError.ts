import {
  AUTH_REQUIRED_ERROR,
  NOT_FOUND_ERROR,
  SESSION_AUTH_ERROR,
  WRONG_FORMAT_ERROR,
} from '../../../shared/constants/error-constants';
import { toFirstUpperCase } from '../../../shared/helpers/format-helper';

type ErrorCode = string | number;

class CustomError extends Error {
  status: number;
  code?: ErrorCode;

  constructor(
    message: string = 'There was an error with the request',
    status: number = 500,
    name: string = 'Error',
    code?: ErrorCode
  ) {
    super(message);
    this.name = name;
    this.status = status;
    if (code !== undefined) {
      this.code = code;
    }
  }
}

export class AuthError extends CustomError {
  constructor(
    message: string = 'Authentication required.',
    code: ErrorCode = AUTH_REQUIRED_ERROR
  ) {
    super(message, 401, 'AuthError', code);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Access not authorized.', code?: ErrorCode) {
    super(message, 403, 'ForbiddenError', code);
  }
}

export class SessionAuthError extends AuthError {
  constructor(message: string = 'Session is no longer valid') {
    super(message, SESSION_AUTH_ERROR);
    this.name = 'SessionAuthError';
  }
}

export class WrongFormatError extends CustomError {
  constructor(code: ErrorCode = WRONG_FORMAT_ERROR) {
    super('The format of the URL is not valid!', 400, 'WrongFormatError', code);
  }
}

export class NotFoundError extends CustomError {
  constructor(
    contentName: string = 'Content',
    code: ErrorCode = NOT_FOUND_ERROR
  ) {
    super(
      `${toFirstUpperCase(contentName)} not found!`,
      404,
      'NotFoundError',
      code
    );
  }
}

export default CustomError;
