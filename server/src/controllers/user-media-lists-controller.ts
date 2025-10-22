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
import { getUserWatchlist } from '../services/user-media-lists-service';

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
      const watchlist: UserMediaList | null = await getUserWatchlist(userId);
      if (!watchlist) {
        throw new NotFoundError('watchlist');
      }
      res.json(toPlain(watchlist));
    } catch (error) {
      next(error);
    }
  }
);

//add media to user watchlist directly
router.post(
  '/watchlist/:userId/:indexId',
  authRequired,
  customIdFormatChecker('userId'),
  customIdFormatChecker('indexId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: number = Number(req.params.userId);
      const indexId: number = Number(req.params.indexId);
      //only admins and the users themselves can edit their watchlist
      if (
        !req.activeUser ||
        (!req.activeUser.isAdmin && req.activeUser.id !== userId)
      ) {
        throw new ForbiddenError();
      }
      //we get the target watchlist and the indexMedia to make sure both exist
      const [targetList, targetMedia] = await Promise.all([
        getUserWatchlist(userId),
        IndexMedia.findByPk(indexId),
      ]);
      if (!targetList || !targetMedia) {
        throw new NotFoundError();
      }

      const indexInList: number = targetList.itemCount;
      const transaction: Transaction = await sequelize.transaction();
      try {
        //we create the new watchlist item matching it to both list and index
        const item = await UserMediaListItem.create(
          { userListId: targetList.id, indexId, indexInList },
          { transaction }
        );
        await transaction.commit();
        res.status(201).json(toPlain(item));
      } catch (error) {
        await transaction.rollback();
        next(error);
      }
    } catch (error) {
      next(error);
    }
  }
);

//to remove media from user watchlist directly
router.delete(
  '/watchlist/:userId/:indexId',
  authRequired,
  customIdFormatChecker('userId'),
  customIdFormatChecker('indexId'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: number = Number(req.params.userId);
      const indexId: number = Number(req.params.indexId);
      //only admins and the users themselves can edit their watchlist
      if (
        !req.activeUser ||
        (!req.activeUser.isAdmin && req.activeUser.id !== userId)
      ) {
        throw new ForbiddenError();
      }
      //we get the target watchlist to find the item to remove
      const targetList: UserMediaList | null = await getUserWatchlist(userId);
      if (!targetList) {
        throw new NotFoundError('watchlist');
      }
      //we find the item that matches both the watchlist and the requested index media
      const targetListItem: UserMediaListItem | null =
        await UserMediaListItem.findOne({
          where: { userListId: targetList.id, indexId },
        });
      if (!targetListItem) {
        throw new NotFoundError('item');
      }

      const transaction: Transaction = await sequelize.transaction();
      try {
        await targetListItem.destroy({ transaction });
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
