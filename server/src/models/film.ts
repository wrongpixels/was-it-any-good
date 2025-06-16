import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Op,
  Sequelize,
} from 'sequelize';
import { sequelize } from '../util/db';
import { FilmParental } from '../types/parental/parental-types';
import Media from './media';
import { MediaType, AuthorType } from '../types/media/media-types';
import Genre from './genre';
import MediaGenre from './mediaGenre';
import MediaRole from './mediaRole';

class Film extends Media<InferAttributes<Film>, InferCreationAttributes<Film>> {
  declare tmdbId: string;
  declare imdbId?: string;
  declare mediaType: MediaType.Film;
  declare parentalGuide: keyof typeof FilmParental | null;

  static associate() {
    Film.belongsToMany(Genre, {
      through: MediaGenre,
      foreignKey: 'mediaId',
      otherKey: 'genreId',
      as: 'genres',
      constraints: false,
    });

    Film.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'cast',
      scope: {
        mediaType: MediaType.Film,
        role: AuthorType.Actor,
      },
      constraints: false,
    });

    Film.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'crew',
      scope: {
        mediaType: MediaType.Film,
        role: { [Op.ne]: AuthorType.Actor },
      },
      constraints: false,
    });
  }
}

Film.init(
  {
    ...Media.baseInit(),
    tmdbId: {
      type: DataTypes.STRING,
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
