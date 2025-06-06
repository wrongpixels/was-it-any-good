import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Op,
} from 'sequelize';
import Country from '../types/countries/country-types';
import { Film, MediaRole, Show } from '.';
import { AuthorType, MediaType } from '../types/media/media-types';

class Media<
  TAttributes extends InferAttributes<Media<TAttributes, TCreation>>,
  TCreation extends InferCreationAttributes<Media<TAttributes, TCreation>>
> extends Model<TAttributes, TCreation> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare originalName: string;
  declare sortName: string;
  declare description: string | null;
  declare country: string[];
  declare status: string | null;
  declare releaseDate: string | null;
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
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          isIn: [Object.keys(Country)],
        },
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

  //To avoid repeating basic relationships between Media Models
  static setupAssociations<T extends typeof Film | typeof Show>(
    model: T,
    mediaType: MediaType
  ) {
    //Full credits
    model.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'credits',
      scope: {
        mediaType,
      },
      constraints: false,
    });

    //Cast only -> Only Actors
    model.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'cast',
      scope: {
        mediaType,
        role: AuthorType.Actor,
      },
      constraints: false,
    });

    //Crew only -> All but Actors
    model.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'crew',
      scope: {
        mediaType,
        role: { [Op.ne]: AuthorType.Actor },
      },
      constraints: false,
    });
  }
}

export default Media;
