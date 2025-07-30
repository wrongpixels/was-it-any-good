import express from 'express';
import CustomError from '../util/customError';
import { IndexMedia } from '../models';
import { Op } from 'sequelize';
import { IndexMediaData } from '../../../shared/types/models';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const suggestion: string | undefined = req.query.query?.toString();
    if (!suggestion) {
      throw new CustomError('Search field cannot be empty', 400);
    }
    const searchTerm: string = suggestion.trim();
    const matches: IndexMediaData[] = await IndexMedia.findAll({
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
      include: [
        {
          association: 'film',
          attributes: ['id'],
        },
        {
          association: 'show',
          attributes: ['id'],
        },
      ],
    });
    res.json(matches);
  } catch (error) {
    next(error);
  }
});

export default router;
