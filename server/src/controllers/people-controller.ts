import express, { Request } from 'express';
import { Person } from '../models';
import CustomError from '../util/customError';
import { PersonResponse } from '../../../shared/types/models';
const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const people: Person[] = await Person.scope('withFilms').findAll({});
    const peopleResponse: PersonResponse[] = people.map((p: Person) =>
      p.get({ plain: true })
    );
    res.json(peopleResponse);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res, next) => {
  try {
    const id: string = req.params.id;
    if (!id) {
      throw new CustomError('Wrong id format', 400);
    }
    const person: Person | null = await Person.scope('withFilms').findByPk(id);
    if (!person) {
      throw new CustomError('Wrong person id', 400);
    }
    const personResponse: PersonResponse = { ...person.get({ plain: true }) };
    res.json(personResponse);
  } catch (error) {
    next(error);
  }
});

export default router;
