import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db';

class Media extends Model {
  declare name: string;
  declare sortName: string;
  declare rating: number;
  declare countries: number[];
  declare writers: number[];
  declare directors: number[];
  declare cast: number[];
  declare genres: number[];
  declare description: string;
  declare year: number;
  declare image: number;
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
    sortName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rating: {
      type: DataTypes.DECIMAL,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: new Date().getFullYear() + 10,
        min: 1888,
      },
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    hooks: {
      beforeCreate: (r) => {
        if (!r.sortName) {
          r.sortName = r.name;
        }
      },
    },
    sequelize,
  }
);

export default Media;
