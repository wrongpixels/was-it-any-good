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
    const matches: IndexMedia[] = await IndexMedia.findAll({
      where: {
        name: {
          [Op.iLike]: `%${suggestion.trim()}%`,
        },
      },
    });
    res.json({ matches });
  } catch (error) {
    next(error);
  }
});

export default router;
