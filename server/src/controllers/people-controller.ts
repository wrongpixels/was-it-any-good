import express, { Request } from 'express';
import { Person } from '../models';
import CustomError from '../util/customError';
import { PersonResponse } from '../../../shared/types/models';
const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const people: PersonResponse[] = await Person.scope('withMedia').findAll({
      raw: true,
    });

    res.json(people);
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
    const person: PersonResponse | null = await Person.scope(
      'withMedia'
    ).findByPk(id, { raw: true });
    if (!person) {
      res.json(null);
      return;
    }
    res.json(person);
  } catch (error) {
    next(error);
  }
});

export default router;
