import express, { Request } from 'express';
import { UserSessionData } from '../../../shared/types/models';
import { Session, User } from '../models';
import CustomError from '../util/customError';
import { isValidSession } from '../util/session-verifier';

const router = express.Router();

router.get('/validate/:id', async (req: Request, res, next) => {
  try {
    if (!req.params.id) {
      throw new CustomError('No session id provided', 401);
    }
    const session: Session | null = await Session.findByPk(req.params.id, {
      include: User,
    });
    if (!session) {
      throw new CustomError('Session could not be found', 401);
    }
    if (!isValidSession(session)) {
      await session.expire();
      throw new CustomError('Session expired', 401);
    }
    const userSession: UserSessionData = session.get({ plain: true });
    res.json(userSession);
  } catch (error) {
    next(error);
  }
});

export default router;
