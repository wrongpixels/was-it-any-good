import express, { NextFunction, Request, Response } from 'express';
import { logoutUser } from '../services/session-service';
const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Trying to log out', req.activeUser?.id);
    if (!req.activeUser?.id) {
      res.status(200).json({ success: true, message: 'No active session' });
      return;
    }
    await logoutUser(req.activeUser.id);
    res.status(200).json({
      success: true,
      message: 'User was logged out',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
