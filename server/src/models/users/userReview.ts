import {
  CreationOptional,
  DataTypes,
  FindOptions,
  InferAttributes,
  InferCreationAttributes,
  Model,
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
import { RecommendType } from '../../../../shared/types/user-reviews';
import {
  MAX_REVIEW_CONTENT_LENGTH,
  MAX_REVIEW_SPOILER_LENGTH,
  MAX_REVIEW_TITLE_LENGTH,
  MIN_REVIEW_CONTENT_LENGTH,
  MIN_REVIEW_TITLE_LENGTH,
} from '../../../../shared/constants/user-review-constants';

class UserReview extends Model<
  InferAttributes<UserReview>,
  InferCreationAttributes<UserReview>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare indexId: number;
  //the rating of the user to link with the review
  //users are allowed to remove and update ratings freely, so ids might change and we should
  //allow for null ids too. New Ratings will take care of re-linking themselves to the UserReview
  declare ratingId: number | null;
  declare title: string;
  //saves the seasons available if a user votes a full show.
  //if new seasons get added, the review will inform the reader.
  //eg:
  //Stranger Things (TV Show) - Seasons 1 to 4
  //vs
  //Stranger Things (TV Show) - Full Show
  //individual seasons have their own unique reviews
  declare seasons: CreationOptional<number[]>;
  declare mainContent: string;
  declare spoilerContent: string | null;
  declare recommended: RecommendType;
  declare edited: CreationOptional<boolean>;
  declare timesEdited: CreationOptional<number>;
  declare lastEdited: CreationOptional<Date | null>;
  declare rating?: RatingData;

  static associate() {
    this.belongsTo(IndexMedia, {
      as: 'indexMedia',
      foreignKey: 'indexId',
    });
    this.belongsTo(User, {
      as: 'user',
      foreignKey: 'userId',
    });
    this.belongsTo(Rating, {
      as: 'rating',
      foreignKey: 'ratingId',
    });
  }

  //to find all the user reviews of a specific media and, if rated by the user, attach the rating
  static async findAllByIndexId(
    indexId: number | string,
    options?: FindOptions<UserReview>
  ) {
    const entries: UserReview[] = await UserReview.findAll({
      ...options,
      where: buildReviewWhereOptions({ indexId }, options),
      include: buildReviewIncludeableOptions(options),
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
    return entries;
  }
}

//to find a specific user's review for a specific media

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
    ratingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ratings',
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
        len: [MIN_REVIEW_TITLE_LENGTH, MAX_REVIEW_TITLE_LENGTH],
      },
    },
    mainContent: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [MIN_REVIEW_CONTENT_LENGTH, MAX_REVIEW_CONTENT_LENGTH],
      },
    },
    spoilerContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [MIN_REVIEW_CONTENT_LENGTH, MAX_REVIEW_SPOILER_LENGTH],
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
