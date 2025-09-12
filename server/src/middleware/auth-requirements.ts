//middlewares that verifies the user logged in is correct or has specific attributes.
//used in endpoints that require a valid auth to access them.
//session + token validation is already done in every api call, these are just
//for throwing an error if requirement is not fulfilled.

import { NextFunction, Request, Response } from 'express';
import { AuthError, ForbiddenError } from '../util/customError';

//a user must be logged in.
export const authRequired = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.activeUser?.isValid) {
    throw new AuthError();
  }
  next();
};

//active user is an admin
export const adminRequired = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.activeUser?.isAdmin) {
    throw new ForbiddenError();
  }
  next();
};
