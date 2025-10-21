import express, { NextFunction, Request, Response, Router } from 'express';
import { AuthError, ForbiddenError, NotFoundError } from '../util/customError';
import { authRequired } from '../middleware/auth-requirements';
import { IndexMedia, UserMediaList } from '../models';
import {
  AddMediaToList,
  AddMediaToListSchema,
} from '../schemas/user-media-list-schemas';

const router: Router = express.Router();

router.post(
  '/',
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.activeUser || !req.activeUser.isAdmin) {
        throw new ForbiddenError();
      }
      const listElementData: AddMediaToList = AddMediaToListSchema.parse(
        req.body
      );
      //we get both the targetList and the target media. We'll check both exist and match
      //our expected data to avoid malicious payloads and forbidden actions
      const [targetList, targetMedia] = await Promise.all([
        UserMediaList.findByPk(listElementData.userListId),
        IndexMedia.findByPk(listElementData.indexId),
      ]);
      if (!targetList || targetMedia) {
        throw new NotFoundError();
      }
      //we avoid not admin users being able to post to other users lists
      if (!req.activeUser.isAdmin && req.activeUser.id !== targetList.userId) {
        throw new ForbiddenError();
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
