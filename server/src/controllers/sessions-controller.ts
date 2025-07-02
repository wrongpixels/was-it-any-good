import express, { Request } from 'express';
import { UserSessionData } from '../../../shared/types/models';
import { Session, User } from '../models';
import { SessionAuthError } from '../util/customError';
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
        throw new SessionAuthError('No session or invalid session');
      }
      const dbSession: Session | null = await Session.findByPk(
        localSession.id,
        {
          include: User,
        }
      );
      if (!dbSession) {
        throw new SessionAuthError('Session could not be found in db');
      }
      if (!isValidSession(localSession, dbSession)) {
        await dbSession.expire();
        throw new SessionAuthError('Session expired');
      }
      const userSession: UserSessionData = dbSession.get({ plain: true });
      res.json(userSession);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
