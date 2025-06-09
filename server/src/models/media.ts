import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Op,
  HasManyGetAssociationsMixin,
  IncludeOptions,
  Sequelize,
  BelongsToManyGetAssociationsMixin,
} from 'sequelize';
import Country from '../types/countries/country-types';
import { Film, Genre, MediaGenre, MediaRole, Show } from '.';
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
    model.belongsToMany(Genre, {
      through: MediaGenre,
      foreignKey: 'mediaId',
      otherKey: 'genreId',
      as: 'genres',
      constraints: false,
    });
    model.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'cast',
      scope: {
        mediaType,
        role: AuthorType.Actor,
      },
      constraints: false,
    });

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

  //Scopes
  private static readonly castInclude: IncludeOptions = {
    association: 'cast',
    include: [
      {
        association: 'person',
        attributes: ['id', 'name', 'tmdbId', 'image'],
      },
    ],
    attributes: {
      exclude: [
        'role',
        'mediaId',
        'mediaType',
        'createdAt',
        'updatedAt',
        'personId',
      ],
    },
    separate: true,

    //We force order by the 'order' value of the cast
    order: [['"order"', 'ASC']],
  };

  private static readonly genresInclude: IncludeOptions = {
    association: 'genres',
    attributes: ['id', 'name', 'tmdbId'],
    through: {
      attributes: [],
    },
  };

  private static readonly crewInclude: IncludeOptions = {
    association: 'crew',
    include: [
      {
        association: 'person',
        attributes: ['id', 'name', 'tmdbId', 'image'],
      },
    ],
    attributes: {
      exclude: [
        'mediaId',
        'mediaType',
        'createdAt',
        'updatedAt',
        'personId',
        'characterName',
        'order',
      ],
    },
    //We force Director to show first
    order: [
      [
        Sequelize.literal(`
          CASE            
            WHEN role = 'Director' THEN 1
            ELSE 3
          END
        `),
        'ASC',
      ],
      ['person', 'name', 'ASC'],
    ],
  };

  static initOptions() {
    return {
      defaultScope: {},
      scopes: {
        withCredits: {
          include: [this.castInclude, this.crewInclude, this.genresInclude],
        },
        castOnly: {
          include: [this.castInclude, this.genresInclude],
        },
        crewOnly: {
          include: [this.crewInclude, this.genresInclude],
        },
      },
    };
  }
}

export default Media;
