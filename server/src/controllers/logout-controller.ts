import express, { NextFunction, Request, Response } from 'express';
import { logoutUser } from '../services/session-service';
const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.activeUser?.isValid) {
      res.status(200).end();
      return;
    }
    await logoutUser(req.activeUser.id);
    res.status(200).json({
      message: 'User was logged out',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
