import { INV_ACTIVE_USER } from '../constants/user-defaults';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { API_SECRET } from '../util/config';
import { ActiveUser } from '../../../shared/types/models';
import { NextFunction, Request, Response } from 'express';
import { ActiveUserSchema } from '../schemas/user-schema';
import { Session, User } from '../models';

declare module 'express' {
  interface Request {
    activeUser?: ActiveUser;
  }
}

export const activeUserExtractor = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const validUser: ActiveUser | null = await tokenValidator(req);
    if (!validUser) {
      req.activeUser = INV_ACTIVE_USER;
      next();
      return;
    }
    req.activeUser = validUser;
    next();
  } catch (error) {
    next(error);
  }
};

const tokenValidator = async (req: Request): Promise<ActiveUser | null> => {
  const token: string | null = tokenExtractor(req);
  if (!token) {
    return null;
  }
  const activeUser: ActiveUser = await validateActiveUser(
    jwt.verify(token, API_SECRET)
  );
  if (!activeUser?.isActive || !activeUser.id) {
    return null;
  }
  const session: Session | null = await Session.findOne({
    where: { userId: activeUser.id },
  });
  if (!session || session.token !== token) {
    return null;
  }
  if (session.expired) {
    await session.destroy();
    return null;
  }
  return activeUser;
};

const tokenExtractor = (req: Request): string | null => {
  const authorization = req.header('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

const validateActiveUser = async (
  data: JwtPayload | string
): Promise<ActiveUser> => {
  const result = ActiveUserSchema.safeParse(data);
  if (result.error || result.data?.id < 0 || !result.data.username) {
    return INV_ACTIVE_USER;
  }
  const activeUser: ActiveUser = result.data;
  const user = await User.findOne({
    where: {
      id: activeUser.id,
      username: activeUser.username,
    },
  });
  if (!user) {
    return INV_ACTIVE_USER;
  }
  return { ...result.data, isValid: true };
};
