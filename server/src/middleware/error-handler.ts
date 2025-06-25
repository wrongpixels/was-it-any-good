import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { APIError } from '../../../shared/types/errors';
import CustomError from '../util/customError';
import { DEF_API_ERROR } from '../constants/error-defaults';

const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const responseError: APIError = { ...DEF_API_ERROR };

  if (err instanceof CustomError) {
    responseError.message = err.message;
    responseError.status = err.status;
    responseError.name = err.name;
  }
  res.status(responseError.status).json(responseError);
};

export default errorHandler;
