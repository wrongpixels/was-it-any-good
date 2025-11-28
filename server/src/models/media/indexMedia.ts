import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { MediaType } from '../../../../shared/types/media';
import { sequelize } from '../../util/db/initialize-db';
import { Film, Rating, Season, Show } from '..';
import { CountryCode, isCountryCode } from '../../../../shared/types/countries';
import { mediaInIndexAttributes } from '../../constants/scope-attributes';

//stores TMDB media metadata and maps TMDB ids to internal media ids (if they exist).
//used for search results and checking if TMDB entries are already in our database.
//no model associations needed, media data is fetched directly from Film/Show tables.

class IndexMedia extends Model<
  InferAttributes<IndexMedia>,
  InferCreationAttributes<IndexMedia>
> {
  declare id: CreationOptional<number>;
  declare tmdbId: number;
  //only for Seasons
  declare showId?: number;
  declare addedToMedia: boolean;
  declare name: string;
  declare image: string;
  declare rating: number;
  declare year: number | null;
  declare releaseDate: string | null;
  declare baseRating: number;
  declare country: CountryCode[];
  declare voteCount: number;
  declare popularity: number;
  declare mediaType: MediaType;
  declare film?: Film;
  declare show?: Show;
  declare season?: Season;

  static associate() {
    this.hasMany(Rating, {
      as: 'ratings',
      foreignKey: 'indexId',
    });
    this.hasOne(Film, {
      foreignKey: 'indexId',
      constraints: false,
      as: 'film',
      scope: {
        //we're forced to snake_case it as sequelize won't convert it
        //automatically when used in buildIncludeOptions()
        media_type: MediaType.Film,
      },
    });
    this.hasOne(Show, {
      foreignKey: 'indexId',
      constraints: false,
      as: 'show',
      scope: {
        //we're forced to snake_case it as sequelize won't convert it
        //automatically when used in buildIncludeOptions()
        media_type: MediaType.Show,
      },
    });
    this.hasOne(Season, {
      foreignKey: 'indexId',
      constraints: false,
      as: 'season',
      scope: {
        //we're forced to snake_case it as sequelize won't convert it
        //automatically when used in buildIncludeOptions()
        media_type: MediaType.Season,
      },
    });
  }

  getMediaId(): number | null {
    return !this.addedToMedia ? null : (this.film?.id ?? this.show?.id ?? null);
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
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    baseRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
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
    releaseDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    modelName: 'index_media',
    underscored: true,
    sequelize,
    //for setting a double unique
    indexes: [
      {
        unique: true,
        fields: ['tmdb_id', 'media_type'],
      },
    ],
    scopes: {
      withMediaAndGenres: {
        include: [
          {
            association: 'film',
            attributes: mediaInIndexAttributes,
            include: [
              {
                association: 'genres',
                attributes: ['id', 'name'],
                through: {
                  attributes: [],
                },
              },
            ],
          },
          {
            association: 'show',
            attributes: mediaInIndexAttributes,
            include: [
              {
                association: 'genres',
                attributes: ['id', 'name'],
                through: {
                  attributes: [],
                },
              },
            ],
          },
        ],
      },
    },
  }
);

export default IndexMedia;
