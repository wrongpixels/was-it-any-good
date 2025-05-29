import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';

class Media extends Model {
  declare id: number;
  declare name: string;
  declare originalName: string;
  declare sortName: string;
  declare description: string;
  declare status: string;
  declare releaseDate: Date;
  declare image: string;
  declare rating: number;
  declare voteCount: number;
  declare runtime: number;
  declare mediaType: string;
}

Media.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      validate: {
        isUrl: true,
      },
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
  },
  {
    sequelize,
    modelName: 'media',
    underscored: true,
  }
);
export default Media;
