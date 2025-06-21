import express, { Router } from 'express';
import { User } from '../models';
import CustomError from '../util/customError';
import { CreateUserData, UserData } from '../../../shared/types/models';
import { validateAndBuildUserData } from '../services/user-service';
import { Error } from 'sequelize';

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

router.get('/:id', async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const user: User | null = await User.findByPk(id, {
      attributes: ['id', 'username', 'lastActive'],
    });
    if (!user) {
      throw new CustomError('User could not be found', 400);
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
    if (error instanceof Error) {
      console.error('Full error:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    next(error);
  }
});

export default router;
