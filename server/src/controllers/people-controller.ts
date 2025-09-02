import express, { Request, Response } from 'express';
import { Person } from '../models';
import CustomError, { NotFoundError } from '../util/customError';
import { PersonResponse } from '../../../shared/types/models';
import { toPlain } from '../util/model-helpers';
import { sortRoles } from '../services/people-service';
const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const people: PersonResponse[] = await Person.scope('withMedia').findAll(
      {}
    );

    res.json(people);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  async (req: Request, res: Response<PersonResponse | null>, next) => {
    try {
      const id: string = req.params.id;
      if (!id) {
        throw new CustomError('Wrong id format', 400);
      }
      const person: Person | null = await Person.scope('withMedia').findByPk(
        id
      );
      if (!person) {
        throw new NotFoundError('Person');
      }
      const personData: PersonResponse = toPlain<Person>(person);
      //we sort indexMedia here by roles (Actor, Director…) because sequelize
      //is not great for that and the frontend should avoid doing it.
      res.json({ ...personData, sortedRoles: sortRoles(personData) });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
