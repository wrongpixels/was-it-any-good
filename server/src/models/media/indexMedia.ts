import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { MediaType } from '../../../../shared/types/media';
import { sequelize } from '../../util/db';
import { Film, Show } from '..';
import { CountryCode, isCountryCode } from '../../../../shared/types/countries';

//stores TMDB media metadata and maps TMDB ids to internal media ids (if they exist).
//used for search results and checking if TMDB entries are already in our database.
//no model associations needed, media data is fetched directly from Film/Show tables.

class IndexMedia extends Model<
  InferAttributes<IndexMedia>,
  InferCreationAttributes<IndexMedia>
> {
  declare id: CreationOptional<number>;
  declare tmdbId: number;
  declare mediaId: number | null;
  declare addedToMedia: boolean;
  declare name: string;
  declare image: string;
  declare rating: number;
  declare year: number | null;
  declare baseRating: number;
  declare country: CountryCode[];
  declare voteCount: number;
  declare popularity: number;
  declare mediaType: MediaType;
  declare film?: Film;
  declare show?: Show;

  static associate() {
    this.belongsTo(Film, {
      foreignKey: 'mediaId',
      constraints: false,
      as: 'film',
      scope: {
        mediaType: MediaType.Film,
      },
    });
    this.belongsTo(Show, {
      foreignKey: 'mediaId',
      constraints: false,
      as: 'show',
      scope: {
        mediaType: MediaType.Show,
      },
    });
  }
}

IndexMedia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tmdbId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mediaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    popularity: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    },
    addedToMedia: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    name: {
      type: DataTypes.STRING,
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
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    modelName: 'index-media',
    underscored: true,
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ['tmdb_id', 'media_type'],
      },
    ],
  }
);

export default IndexMedia;
