import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { APIError } from '../../../shared/types/errors';
import CustomError from '../util/customError';
import { DEF_API_ERROR } from '../../../shared/constants/error-constants';
import { ValidationError } from 'sequelize';

const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const responseError: APIError = { ...DEF_API_ERROR };
  console.log(err);

  if (err instanceof CustomError) {
    responseError.message = err.message;
    responseError.status = err.status;
    responseError.name = err.name;
    responseError.code = err.code;
  } else {
    if (err instanceof ValidationError) {
      responseError.name = 'ValidationError';
      responseError.status = 400;
      responseError.message = `${err.errors[0]?.path} already in use!`;
    } else {
      responseError.message = err.message;
      responseError.name = err.name;
    }
  }

  res.status(responseError.status).json(responseError);
};

export default errorHandler;
