import express, { NextFunction, Request, Response, Router } from 'express';
import { User } from '../models';
import CustomError from '../util/customError';
import { CreateUserData, UserData } from '../../../shared/types/models';
import { validateAndBuildUserData } from '../services/user-service';
import { activeUserExtractor } from '../middleware/user-extractor';

const router: Router = express.Router();

router.get('/', activeUserExtractor, async (req: Request, res, next) => {
  try {
    const options = req.activeUser?.isAdmin
      ? {}
      : { attributes: ['id', 'username', 'lastActive'] };
    const users: User[] = await User.findAll(options);
    const usersData: UserData[] = users.map(
      (u: User): UserData => u.get({ plain: true })
    );
    res.json(usersData);
  } catch (error) {
    next(error);
  }
});
router.put(
  '/:id/activate',
  activeUserExtractor,
  async (
    req: Request<{ id: string }, unknown, { activate: boolean }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.activeUser?.isAdmin) {
        throw new CustomError('Unauthorized access', 401);
      }
      if (typeof req.body.activate !== 'boolean') {
        throw new CustomError('Missing or invalid "validate" value', 400);
      }
      const id = req.params.id;
      const activate: boolean = req.body.activate;
      const user = await User.findByPk(id);
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      if (user.isAdmin) {
        throw new CustomError('Administrators cannot be banned this way', 401);
      }

      user.isActive = activate;
      await user.save();
      res.json({
        message: `User ${user.username} ${
          activate ? 'unbanned' : 'banned'
        } successfully.`,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id', async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const user: User | null = await User.findByPk(id, {
      attributes: ['id', 'username', 'lastActive'],
    });
    if (!user) {
      res.json(null);
      return;
    }
    const userData: UserData = user.get({ plain: true });
    res.json(userData);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const createUserData: CreateUserData = await validateAndBuildUserData(
      req.body
    );
    const newUser: User = await User.create(createUserData);
    const responseUser: UserData = newUser.get({ plain: true });
    if (!responseUser?.id) {
      throw new CustomError('There was an error creating the user', 400);
    }
    res.status(201).json(responseUser);
  } catch (error) {
    next(error);
  }
});

export default router;
