import express, { Request, Response } from 'express';
import { Person } from '../models';
import { NotFoundError } from '../util/customError';
import { PersonResponse } from '../../../shared/types/models';
import { toPlain } from '../util/model-helpers';
import { sortRoles } from '../services/people-service';
import idFormatChecker from '../middleware/id-format-checker';
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
  idFormatChecker,
  async (req: Request, res: Response<PersonResponse | null>, next) => {
    try {
      const id: string = req.params.id;
      const person: Person | null =
        await Person.scope('withMedia').findByPk(id);
      if (!person) {
        throw new NotFoundError('Person');
      }
      if (!person.addedDetails) {
        console.log('Missing extra Person data. Gathering');
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
