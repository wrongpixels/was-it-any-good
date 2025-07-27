import express, { Request, Router } from 'express';
import {
  ActiveUser,
  CreateUserSessionData,
  LoginData,
  UserSessionData,
} from '../../../shared/types/models';
import { validateLoginData } from '../schemas/login-schema';
import { Session, User } from '../models';
import CustomError from '../util/customError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { API_SECRET } from '../util/config';
import { logoutUser } from '../services/session-service';

const router: Router = express.Router();

router.post('/', async (req: Request, res, next) => {
  try {
    const loginData: LoginData = validateLoginData(req.body);
    const currentSession: Session | null = await Session.findOne({
      raw: true,
      where: {
        username: loginData.username,
      },
      include: {
        model: User,
      },
    });
    const user: User | null | undefined = currentSession
      ? currentSession.user
      : await User.findOne({
          where: { username: loginData.username },
          raw: true,
        });

    if (currentSession) {
      await logoutUser(currentSession.userId);
    }
    if (!user) {
      throw new CustomError('Wrong username or password', 401);
    }
    if (!user.isActive) {
      throw new CustomError(
        'User is disabled. Please contact administration.',
        401
      );
    }
    const passwordMatch: boolean = await bcrypt.compare(
      loginData.password,
      user?.hash
    );
    if (!passwordMatch) {
      throw new CustomError('Wrong username or password', 401);
    }
    const userToken: ActiveUser = {
      username: user.username,
      name: user.name,
      id: user.id,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      lastActive: new Date(),
    };
    const token: string = await jwt.sign(userToken, API_SECRET);
    if (!token) {
      throw new CustomError('Token error', 401);
    }
    const sessionData: CreateUserSessionData = {
      username: userToken.username,
      userId: userToken.id,
      token,
      expired: false,
    };
    const session: UserSessionData = await Session.create(sessionData, {
      raw: true,
    });
    if (!session) {
      throw new CustomError('Session error', 401);
    }
    await user.update({ lastActive: new Date() });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

export default router;
