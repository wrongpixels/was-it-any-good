import { INV_ACTIVE_USER } from '../constants/user-defaults';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { API_SECRET } from '../util/config';
import { ActiveUser } from '../../../shared/types/models';
import { NextFunction, Request, Response } from 'express';
import { ActiveUserSchema } from '../schemas/user-schema';
import { Session, User } from '../models';
import CustomError from '../util/customError';

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
    const auth = req.header('authorization')?.toLowerCase();
    const token = auth?.startsWith('bearer ') ? auth.slice(7) : null;

    // No token → anonymous
    if (!token) {
      req.activeUser = INV_ACTIVE_USER;
      return next();
    }

    // Verify JWT signature
    let payload: JwtPayload | string;
    try {
      payload = jwt.verify(token, API_SECRET);
    } catch {
      throw new CustomError('Session is not valid', 401);
    }

    // Validate shape
    const parsed = ActiveUserSchema.safeParse(payload);
    if (parsed.error || parsed.data.id < 0 || !parsed.data.username) {
      throw new CustomError('Session is not valid', 401);
    }
    const candidate = parsed.data as ActiveUser;

    // Confirm user still exists & is active
    const user = await User.findOne({
      where: { id: candidate.id, username: candidate.username, isActive: true },
    });
    if (!user) {
      throw new CustomError('Session is not valid', 401);
    }

    // Confirm session record
    const session = await Session.findOne({
      where: { userId: candidate.id, token },
    });
    if (!session || session.expired) {
      if (session) await session.destroy();
      throw new CustomError('Session is not valid', 401);
    }

    // All good
    req.activeUser = { ...candidate, isValid: true };
    next();
  } catch (err) {
    next(err);
  }
};
