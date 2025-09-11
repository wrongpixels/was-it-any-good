import { INV_ACTIVE_USER } from '../constants/user-defaults';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { API_SECRET } from '../util/config';
import { ActiveUser } from '../../../shared/types/models';
import { NextFunction, Request, Response } from 'express';
import { ActiveUserSchema } from '../schemas/user-schema';
import { Session, User } from '../models';
import { SessionAuthError } from '../util/customError';

export const authHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.header('authorization');
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;

    if (!token) {
      console.log('No token!');
      req.activeUser = INV_ACTIVE_USER;
      return next();
    }

    let payload: JwtPayload | string;
    try {
      payload = jwt.verify(token, API_SECRET);
    } catch {
      console.log('here', token);
      throw new SessionAuthError();
    }

    const parsed = ActiveUserSchema.safeParse(payload);
    if (parsed.error || parsed.data.id < 0 || !parsed.data.username) {
      console.log('here2', parsed);

      throw new SessionAuthError();
    }
    const sessionUser = parsed.data as ActiveUser;

    const user = await User.findOne({
      where: { id: sessionUser.id, username: sessionUser.username },
    });
    if (!user) {
      throw new SessionAuthError('User is not valid');
    }
    if (!user.isActive) {
      throw new SessionAuthError(
        'User account is inactive. Contact Administration'
      );
    }

    const session = await Session.findOne({
      where: { userId: sessionUser.id, token },
    });
    if (!session) {
      throw new SessionAuthError('Session is not valid');
    }

    if (session.expired) {
      await session.destroy();
      throw new SessionAuthError('Session has expired');
    }

    req.activeUser = { ...sessionUser, isValid: true };
    next();
  } catch (error) {
    next(error);
  }
};
