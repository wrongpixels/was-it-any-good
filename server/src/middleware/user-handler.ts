import { INV_ACTIVE_USER } from '../constants/user-defaults';
import jwt from 'jsonwebtoken';
import { API_SECRET } from '../util/config';
import { ActiveUser } from '../../../shared/types/models';
import { validateActiveUser } from '../schemas/user-schema';
import { NextFunction, Request, Response } from 'express';

declare module 'express' {
  interface Request {
    activeUser?: ActiveUser;
  }
}

const tokenExtractor = (req: Request): string | null => {
  const authorization = req.header('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};
export const activeUserExtractor = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token: string | null = tokenExtractor(req);
    if (!token) {
      req.activeUser = INV_ACTIVE_USER;
      next();
      return;
    }
    const activeUser: ActiveUser = await validateActiveUser(
      jwt.verify(token, API_SECRET)
    );
    req.activeUser = activeUser;
    next();
  } catch (error) {
    next(error);
  }
};
