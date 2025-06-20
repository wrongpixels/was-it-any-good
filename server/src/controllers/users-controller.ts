import express, { Router } from 'express';
import { User } from '../models';
import CustomError from '../util/customError';
import { UserData } from '../../../shared/types/models';

const router: Router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const users: User[] = await User.findAll({});
    if (!users) {
      throw new CustomError('Users database could not be accessed', 400);
    }
    const usersData: UserData[] = users.map(
      (u: User): UserData => u.get({ plain: true })
    );
    res.json(usersData);
  } catch (error) {
    next(error);
  }
});

export default router;
