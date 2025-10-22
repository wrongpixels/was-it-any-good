import express, { NextFunction, Request, Response, Router } from 'express';
import { ForbiddenError, NotFoundError } from '../util/customError';
import { authRequired } from '../middleware/auth-requirements';
import { IndexMedia, UserMediaList, UserMediaListItem } from '../models';
import {
  AddMediaToList,
  AddMediaToListSchema,
} from '../schemas/user-media-list-schemas';
import { CreateUserMediaListItem } from '../../../shared/types/models';
import { customIdFormatChecker } from '../middleware/id-format-checker';
import { Transaction } from 'sequelize';
import { sequelize } from '../util/db/initialize-db';
import { toPlain } from '../util/model-helpers';

const router: Router = express.Router();

router.get(
  '/watchlist/:userId',
  authRequired,
  customIdFormatChecker('userId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //we already checked the userId format in the middleware
      const userId: number = Number(req.params.userId);
      //only admins and the users themselves can access their watchlist
      if (
        !req.activeUser ||
        !req.activeUser.isAdmin ||
        userId !== req.activeUser.id
      ) {
        throw new ForbiddenError();
      }
      const watchlist: UserMediaList | null = await UserMediaList.findOne({
        where: {
          userId,
          name: 'watchlist',
          canBeModified: false,
          icon: 'watchlist',
        },
      });
      if (!watchlist) {
        throw new NotFoundError('watchlist');
      }
      res.json(toPlain(watchlist));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/:listId/item',
  authRequired,
  customIdFormatChecker('listId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userListId: string = req.params.listId;
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
        res.status(201).json(toPlain(listItemEntry));
      } catch (error) {
        await transaction.rollback();
        next(error);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:listId/:itemId',
  authRequired,
  customIdFormatChecker('listId'),
  customIdFormatChecker('itemId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userListId: string = req.params.listId;
      const userListItemId: string = req.params.itemId;
      if (!req.activeUser || !req.activeUser.isAdmin) {
        throw new ForbiddenError();
      }
      //we get both the targetList and the targetItem. We'll check both exist and match
      //our expected data to avoid malicious payloads and forbidden actions
      const [targetList, targetListItem] = await Promise.all([
        UserMediaList.findByPk(userListId),
        UserMediaListItem.findByPk(userListItemId),
      ]);
      if (!targetList || !targetListItem) {
        throw new NotFoundError();
      }
      //we check the item is really in the requested list
      if (targetListItem.userListId !== targetList.id) {
        throw new ForbiddenError();
      }
      //we avoid not admin users being able to delete from other users lists
      if (!req.activeUser.isAdmin && req.activeUser.id !== targetList.userId) {
        throw new ForbiddenError();
      }
      const transaction: Transaction = await sequelize.transaction();

      try {
        //and we proceed with the deletion, passing the transaction so the list's
        //item count is updated/rolled back at the same time

        await targetListItem.destroy({
          transaction,
        });
        await transaction.commit();
        res.status(200).json(toPlain(targetListItem));
      } catch (error) {
        await transaction.rollback();
        next(error);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
