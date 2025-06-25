import express, { Request } from 'express';
import { UserSessionData } from '../../../shared/types/models';
import { Session, User } from '../models';
import CustomError from '../util/customError';
import { isValidSession } from '../util/session-verifier';

const router = express.Router();

router.post(
  '/verify',
  async (req: Request<null, UserSessionData, UserSessionData>, res, next) => {
    try {
      const localSession: UserSessionData = req.body;
      if (
        !localSession?.id ||
        !localSession.userId ||
        !localSession.token ||
        localSession.token === '' ||
        localSession.expired
      ) {
        throw new CustomError('No session or invalid session', 401);
      }
      const dbSession: Session | null = await Session.findByPk(
        localSession.id,
        {
          include: User,
        }
      );
      if (!dbSession) {
        throw new CustomError('Session could not be found in db', 401);
      }
      if (!isValidSession(localSession, dbSession)) {
        await dbSession.expire();
        throw new CustomError('Session expired', 401);
      }
      const userSession: UserSessionData = dbSession.get({ plain: true });
      res.json(userSession);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
