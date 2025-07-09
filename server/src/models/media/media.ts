import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import { MediaGenre, MediaRole } from '..';
import { CountryCode, isCountryCode } from '../../../../shared/types/countries';
import { MediaType } from '../../../../shared/types/media';

class Media<
  TAttributes extends InferAttributes<Media<TAttributes, TCreation>>,
  TCreation extends InferCreationAttributes<Media<TAttributes, TCreation>>
> extends Model<TAttributes, TCreation> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare originalName: string;
  declare sortName: string;
  declare description: string;
  declare country: CountryCode[];
  declare mediaType: MediaType;
  declare status: string;
  declare releaseDate: string | null;
  declare image: string;
  //the cached average of all Rating entries linked to the media
  declare rating: number;
  //a default rating score taken from TMDB so media is not '0' or 'not voted'
  //counts as a single vote so user's ratings will weight in easier
  //if no one voted the media on TMDB, then it'll be considered actually 'not voted'
  declare baseRating: number;
  //the cached length of all Rating entries linked to the media entry
  declare voteCount: number;
  declare runtime: number | null;
  //For getting the Cast and Crew data
  declare getCredits: HasManyGetAssociationsMixin<MediaRole>;
  declare getCast: HasManyGetAssociationsMixin<MediaRole>;
  declare getCrew: HasManyGetAssociationsMixin<MediaRole>;
  //For getting the Genres
  declare getGenres: BelongsToManyGetAssociationsMixin<MediaGenre>;

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
        allowNull: true,
      },
      country: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          isValidCountryArray(value: string[]) {
            if (!Array.isArray(value)) {
              throw new Error('Must be an array');
            }
            const invalidCountries = value.filter(
              (country) => !isCountryCode(country)
            );

            if (invalidCountries.length > 0) {
              throw new Error(
                `Invalid country codes found: ${invalidCountries.join(', ')}`
              );
            }
          },
        },
      },
      mediaType: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [Object.values(MediaType)],
            msg: 'Must be a valid Media Type',
          },
        },
      },

      image: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 1),
        defaultValue: 0,
      },
      baseRating: {
        type: DataTypes.DECIMAL(3, 1),
      },
      voteCount: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      runtime: {
        type: DataTypes.INTEGER,
      },
    };
  }
}

export default Media;
