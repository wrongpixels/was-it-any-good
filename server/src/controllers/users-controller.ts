import express, { NextFunction, Request, Response, Router } from 'express';
import { User } from '../models';
import CustomError, {
  NotFoundError,
  WrongFormatError,
} from '../util/customError';
import { CreateUserData, UserData } from '../../../shared/types/models';
import { validateAndBuildUserData } from '../services/user-service';
import idFormatChecker from '../middleware/id-format-checker';

const router: Router = express.Router();

router.get('/', async (req: Request, res, next) => {
  try {
    const options = req.activeUser?.isAdmin
      ? {}
      : { attributes: ['id', 'username', 'lastActive'] };
    const users: UserData[] = await User.findAll({ ...options, raw: true });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', idFormatChecker, async (req: Request, res, next) => {
  try {
    const id: string = req.params.id;
    if (!id) {
      throw new WrongFormatError();
    }
    const user: UserData | null = await User.findByPk(id, {
      attributes: ['id', 'username', 'lastActive'],
    });
    if (!user) {
      throw new NotFoundError('User');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:id/activate',
  idFormatChecker,
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
      res.status(200).json({
        message: `User ${user.username} ${
          activate ? 'unbanned' : 'banned'
        } successfully.`,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/', async (req, res, next) => {
  try {
    const createUserData: CreateUserData = await validateAndBuildUserData(
      req.body
    );
    const newUser: UserData = await User.create(createUserData, { raw: true });
    if (!newUser?.id) {
      throw new CustomError('There was an error creating the user', 400);
    }
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

export default router;
