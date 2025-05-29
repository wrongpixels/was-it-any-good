// models/Media.ts
import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

class Media<
  TAttributes extends InferAttributes<Media<TAttributes, TCreation>>,
  TCreation extends InferCreationAttributes<Media<TAttributes, TCreation>>
> extends Model<TAttributes, TCreation> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare originalName: string;
  declare sortName: string;
  declare description: string | null;
  declare status: string | null;
  declare releaseDate: Date | null;
  declare image: string | null;
  declare rating: number | null;
  declare voteCount: number;
  declare runtime: number | null;

  static baseInit() {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sortName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.STRING,
      },
      releaseDate: {
        type: DataTypes.DATE,
      },
      image: {
        type: DataTypes.STRING,
        validate: { isUrl: true },
      },
      rating: {
        type: DataTypes.DECIMAL(3, 1),
      },
      voteCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      runtime: {
        type: DataTypes.INTEGER,
      },
    };
  }
}

export default Media;
