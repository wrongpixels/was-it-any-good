import express, { NextFunction, Request, Response, Router } from 'express';
import { Genre } from '../models';
import { GenreResponse } from '../../../shared/types/models';
import { FindOptions } from 'sequelize';
import { NotFoundError } from '../util/customError';
import idFormatChecker from '../middleware/id-format-checker';

const router: Router = express.Router();

const genreFindOptions: FindOptions<Genre> = {
  raw: true,
  attributes: ['name', 'id'],
};

router.get(
  '/',
  async (_req, res: Response<GenreResponse[]>, next: NextFunction) => {
    try {
      const genres: GenreResponse[] = await Genre.findAll(genreFindOptions);
      res.json(genres);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  idFormatChecker,
  async (
    req: Request,
    res: Response<GenreResponse | null>,
    next: NextFunction
  ) => {
    try {
      const genreId: string = req.params.id;
      const genre: GenreResponse | null = await Genre.findByPk(
        genreId,
        genreFindOptions
      );
      if (!genre) {
        throw new NotFoundError('genre');
      }
      res.json(genre);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
