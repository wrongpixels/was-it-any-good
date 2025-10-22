import express, { NextFunction, Request, Response, Router } from 'express';
import { ForbiddenError, NotFoundError } from '../util/customError';
import { authRequired } from '../middleware/auth-requirements';
import { IndexMedia, UserMediaList, UserMediaListItem } from '../models';
import {
  AddMediaToList,
  AddMediaToListSchema,
} from '../schemas/user-media-list-schemas';
import { CreateUserMediaListItem } from '../../../shared/types/models';
import idFormatChecker from '../middleware/id-format-checker';
import { Transaction } from 'sequelize';
import { sequelize } from '../util/db/initialize-db';

const router: Router = express.Router();

router.post(
  '/:id/item',
  authRequired,
  idFormatChecker,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userListId: string = req.params.id;
      if (!req.activeUser || !req.activeUser.isAdmin) {
        throw new ForbiddenError();
      }
      const listItemData: AddMediaToList = AddMediaToListSchema.parse(req.body);
      //we get both the targetList and the target media. We'll check both exist and match
      //our expected data to avoid malicious payloads and forbidden actions
      const [targetList, targetMedia] = await Promise.all([
        UserMediaList.findByPk(userListId),
        IndexMedia.findByPk(listItemData.indexId),
      ]);
      if (!targetList || !targetMedia) {
        throw new NotFoundError();
      }
      //we avoid not admin users being able to post to other users lists
      if (!req.activeUser.isAdmin && req.activeUser.id !== targetList.userId) {
        throw new ForbiddenError();
      }
      const indexInList: number =
        listItemData.indexInList || targetList.itemCount;
      const listItem: CreateUserMediaListItem = {
        ...listItemData,
        userListId: targetList.id,
        indexInList,
      };

      const transaction: Transaction = await sequelize.transaction();

      try {
        //we create the entry using the transaction and pass it to the hook of UserMediaListItem,
        //as it will update the itemCount for us
        const listItemEntry: UserMediaListItem = await UserMediaListItem.create(
          listItem,
          { transaction }
        );
        await transaction.commit();
        res.status(201).json(listItemEntry);
      } catch (error) {
        await transaction.rollback();
        console.error(error);
        console.log('Rolling back');
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
