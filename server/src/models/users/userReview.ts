import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import Rating from './rating';
import { sequelize } from '../../util/db/initialize-db';
import User from './user';
import IndexMedia from '../media/indexMedia';

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
      allowNull: false,
      defaultValue: 0,
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
      withUserRating: (userId: number, indexId: number) => ({
        include: [
          {
            association: 'indexMedia',
            attributes: ['id', 'mediaType'],
            include: [
              {
                model: Rating,
                as: 'userRating',
                required: false,
                attributes: ['id', 'userScore', 'mediaId'],
                where: {
                  userId,
                  indexId,
                },
              },
            ],
          },
        ],
      }),
    },
  }
);

export default UserReview;
