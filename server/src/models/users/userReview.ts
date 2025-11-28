import {
  CreationOptional,
  DataTypes,
  FindOptions,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Op,
} from 'sequelize';
import Rating from './rating';
import { sequelize } from '../../util/db/initialize-db';
import User from './user';
import IndexMedia from '../media/indexMedia';
import { RatingData } from '../../../../shared/types/models';
import {
  buildReviewIncludeableOptions,
  buildReviewWhereOptions,
} from '../../util/user-review-helpers';

enum RecommendType {
  NotSpecified = 0,
  Yes = 1,
  No = 2,
  Mixed = 3,
}

class UserReview extends Model<
  InferAttributes<UserReview>,
  InferCreationAttributes<UserReview>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare indexId: number;
  declare title: string;
  declare seasons: CreationOptional<number[]>;
  declare rating?: RatingData;
  declare mainContent: string;
  declare spoilerContent: string | null;
  declare recommended: RecommendType;
  declare edited: CreationOptional<boolean>;
  declare timesEdited: CreationOptional<number>;
  declare lastEdited: CreationOptional<Date | null>;

  static associate() {
    this.belongsTo(IndexMedia, {
      as: 'indexMedia',
      foreignKey: 'indexId',
    });
    this.belongsTo(User, {
      as: 'user',
      foreignKey: 'userId',
    });
  }

  //to find all the user reviews of a specific media and, if rated by the user, attach the rating
  static async findAllByIndexId(
    indexId: number,
    options?: FindOptions<UserReview>
  ) {
    const entries: UserReview[] = await UserReview.findAll({
      ...options,
      where: buildReviewWhereOptions({ indexId }, options),
      include: buildReviewIncludeableOptions(options),
    });
    //we map the entries to their userIds
    const entriesMap: Map<number, UserReview> = new Map<number, UserReview>(
      entries.map((ur: UserReview) => [ur.userId, ur])
    );
    const userIds: number[] = entries.map((ur: UserReview) => ur.userId);
    const ratings: Rating[] = await Rating.findAll({
      where: {
        indexId,
        userId: {
          [Op.in]: userIds,
        },
      },
    });
    ratings.forEach((r: Rating) => {
      const match: UserReview | undefined = entriesMap.get(r.userId);
      if (match) {
        match.rating = r;
      }
    });
    return entries;
  }

  //to find all the reviews by a specific user and, if rated, attach the rating they gave
  static async findAllByUserId(
    userId: number,
    options?: FindOptions<UserReview>
  ) {
    const entries: UserReview[] = await UserReview.findAll({
      ...options,
      where: buildReviewWhereOptions({ userId }, options),
      include: buildReviewIncludeableOptions(options),
    });
    //we map the entries to their indexIds this time
    const entriesMap: Map<number, UserReview> = new Map<number, UserReview>(
      entries.map((ur: UserReview) => [ur.indexId, ur])
    );
    const indexIds: number[] = entries.map((ur: UserReview) => ur.indexId);
    const ratings: Rating[] = await Rating.findAll({
      where: {
        userId,
        indexId: {
          [Op.in]: indexIds,
        },
      },
    });
    ratings.forEach((r: Rating) => {
      const match: UserReview | undefined = entriesMap.get(r.indexId);
      if (match) {
        match.rating = r;
      }
    });
    return entries;
  }
}

UserReview.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    indexId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'index_media',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    seasons: {
      type: DataTypes.ARRAY(DataTypes.NUMBER),
      allowNull: false,
      defaultValue: [],
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 75],
      },
    },
    mainContent: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [30, 6000],
      },
    },
    spoilerContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [30, 4000],
      },
    },
    recommended: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: RecommendType.NotSpecified,
      validate: {
        min: 0,
        max: RecommendType.Mixed,
      },
    },
    edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    timesEdited: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastEdited: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user_review',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'index_id'],
      },
    ],
    scopes: {
      withUserRating(userId: number) {
        return {
          include: [
            {
              association: 'indexMedia',
              attributes: ['id', 'mediaType'],
              include: [
                {
                  model: Rating,
                  as: 'ratings',
                  required: false,
                  attributes: ['id', 'userScore', 'mediaId'],
                  where: { userId },
                },
              ],
            },
          ],
        };
      },
    },
  }
);

export default UserReview;
