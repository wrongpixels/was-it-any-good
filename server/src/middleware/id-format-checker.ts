import { NextFunction, Request, RequestHandler, Response } from 'express';
import { WrongFormatError } from '../util/customError';

//a middleware that throws an error if the provided id is not a number
export const customIdFormatChecker = (idParamName = 'id'): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const stringId = req.params[idParamName];
    const id = Number(stringId);

    if (!stringId || Number.isNaN(id)) {
      return next(
        new WrongFormatError(
          `'${idParamName}' must be numeric, but was '${stringId}`
        )
      );
    }
    next();
  };
};

export const idFormatChecker: RequestHandler = customIdFormatChecker();

export default idFormatChecker;
