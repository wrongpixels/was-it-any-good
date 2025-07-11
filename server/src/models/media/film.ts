import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Op,
  Sequelize,
} from 'sequelize';
import { sequelize } from '../../util/db';
import { FilmParental } from '../../types/parental/parental-types';
import { MediaType, AuthorType } from '../../types/media/media-types';
import Genre from '../genres/genre';
import MediaGenre from '../genres/mediaGenre';
import MediaRole from '../people/mediaRole';
import Rating from '../users/rating';
import { Media } from '..';

class Film extends Media<InferAttributes<Film>, InferCreationAttributes<Film>> {
  declare tmdbId: number;
  declare imdbId?: string;
  declare mediaType: MediaType.Film;
  declare parentalGuide: keyof typeof FilmParental | null;

  static associate() {
    this.belongsToMany(Genre, {
      through: MediaGenre,
      foreignKey: 'mediaId',
      otherKey: 'genreId',
      as: 'genres',
      constraints: false,
    });

    this.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'cast',
      scope: {
        mediaType: MediaType.Film,
        role: AuthorType.Actor,
      },
      constraints: false,
    });

    this.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'crew',
      scope: {
        mediaType: MediaType.Film,
        role: { [Op.ne]: AuthorType.Actor },
      },
      constraints: false,
    });

    this.hasMany(Rating, {
      foreignKey: 'mediaId',
      as: 'ratings',
      scope: {
        MediaType: MediaType.Film,
      },
      constraints: false,
    });
  }
}

Film.init(
  {
    ...Media.baseInit(),
    tmdbId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    imdbId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    mediaType: {
      type: DataTypes.STRING,
      defaultValue: MediaType.Film,
    },
    parentalGuide: {
      type: DataTypes.ENUM(...Object.values(FilmParental)),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'film',
    underscored: true,
    scopes: {
      withCredits: {
        include: [
          {
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
            order: [['order', 'ASC']],
          },
          {
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
            order: [
              [
                Sequelize.literal(
                  'CASE WHEN "crew"."role" = \'Director\' THEN 1 ELSE 3 END'
                ),
                'ASC',
              ],
              ['person', 'name', 'ASC'],
            ],
          },
          {
            association: 'genres',
            attributes: ['id', 'name', 'tmdbId'],
            through: {
              attributes: [],
              where: { mediaType: MediaType.Film },
            },
          },
        ],
      },
    },
  }
);
export type FilmAttributes = InferAttributes<Film>;
export type CreateFilm = Omit<FilmAttributes, 'id'>;

export default Film;
