import express from 'express';
import CustomError from '../util/customError';
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const suggestion: string | undefined = req.query.query?.toString();
    if (!suggestion) {
      throw new CustomError('Search field cannot be empty', 400);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
