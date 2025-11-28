import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import Rating from './rating';
import { MediaType } from '../../../../shared/types/media';
import { sequelize } from '../../util/db/initialize-db';

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
    this.belongsTo(Rating, {
      as: 'indexMedia',
      foreignKey: 'indexId',
    });
    this.belongsTo(Rating, {
      as: 'user',
      foreignKey: 'userId',
    });
  }
}
const mediaId: number = 2;

UserReview.findAll({
  where: {
    indexId: mediaId,
  },
});

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
      unique: true,
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
        min: 3,
        max: 75,
      },
    },
    mainContent: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        min: 30,
        max: 6000,
      },
    },
    spoilerContent: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        min: 30,
        max: 4000,
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user_review',
  }
);

export default UserReview;
