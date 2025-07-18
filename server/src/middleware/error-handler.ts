import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { APIError } from '../../../shared/types/errors';
import CustomError from '../util/customError';
import { DEF_API_ERROR } from '../../../shared/constants/error-constants';

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
  } else {
    responseError.message = err.message;
    responseError.name = err.name;
  }
  console.log(err);
  res.status(responseError.status).json(responseError);
};

export default errorHandler;
