import express from 'express';
import CustomError from '../util/customError';
import { IndexMedia } from '../models';
import { Op } from 'sequelize';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const suggestion: string | undefined = req.query.query?.toString();
    if (!suggestion) {
      throw new CustomError('Search field cannot be empty', 400);
    }
    const searchTerm: string = suggestion.trim();
    const matches: IndexMedia[] = await IndexMedia.findAll({
      where: {
        name: {
          [Op.iLike]: `${searchTerm.length > 2 ? '%' : ''}${searchTerm}%`,
        },
      },
      order: [
        ['popularity', 'DESC'],
        ['name', 'ASC'],
      ],
      limit: 15,
    });
    res.json(Array.from(matches.values()));
  } catch (error) {
    next(error);
  }
});

export default router;
