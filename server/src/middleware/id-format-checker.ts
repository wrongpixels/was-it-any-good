import { NextFunction, Request, Response } from 'express';
import { WrongFormatError } from '../util/customError';

//a middleware that throws an error if the provided id is not a number
const idFormatChecker = (req: Request, _res: Response, next: NextFunction) => {
  const id: string = req.params.id;
  if (!isNaN(Number(id))) {
    throw new WrongFormatError();
  }
  next();
};

export default idFormatChecker;
