import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Op,
  Sequelize,
} from 'sequelize';
import { FilmParental, ShowParental } from '../types/parental/parental-types';
import { sequelize } from '../util/db';
import Media from './media';
import Genre from './genre';
import MediaGenre from './mediaGenre';
import { AuthorType, MediaType } from '../types/media/media-types';
import MediaRole from './mediaRole';

class Show extends Media<InferAttributes<Show>, InferCreationAttributes<Show>> {
  declare tmdbId: string;
  declare imdbId?: string;
  declare mediaType: MediaType.Show;
  declare parentalGuide: keyof typeof FilmParental | null;
  declare lastAirDate: string;
  declare episodeCount: number;
  declare seasonCount: number;

  static associate() {
    Show.belongsToMany(Genre, {
      through: MediaGenre,
      foreignKey: 'mediaId',
      otherKey: 'genreId',
      as: 'genres',
      constraints: false,
    });

    Show.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'cast',
      scope: {
        mediaType: MediaType.Show,
        role: AuthorType.Actor,
      },
      constraints: false,
    });

    Show.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'crew',
      scope: {
        mediaType: MediaType.Show,
        role: { [Op.ne]: AuthorType.Actor },
      },
      constraints: false,
    });
  }
}

Show.init(
  {
    ...Media.baseInit(),
    tmdbId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    imdbId: {
      type: DataTypes.STRING,
      unique: true,
    },
    mediaType: {
      type: DataTypes.STRING,
      defaultValue: MediaType.Show,
    },
    parentalGuide: {
      type: DataTypes.ENUM(...Object.values(ShowParental)),
      allowNull: true,
    },
    lastAirDate: {
      type: DataTypes.STRING,
    },
    episodeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    seasonCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },

  {
    sequelize,
    modelName: 'show',
    underscored: true,
    defaultScope: {
      include: {
        association: 'seasons',
        attributes: [
          'id',
          'index',
          'name',
          'originalName',
          'description',
          'image',
          'voteCount',
          'rating',
          'baseRating',
          'tmdbId',
          'imdbId',
          'releaseDate',
          'episodeCount',
        ],
      },
    },
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
              where: { mediaType: MediaType.Show },
            },
          },
        ],
      },
    },
  }
);
export type ShowAttributes = InferAttributes<Show>;
export type CreateShow = Omit<ShowAttributes, 'id'>;

export default Show;
