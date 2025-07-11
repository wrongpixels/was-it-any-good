import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Op,
} from 'sequelize';
import {
  FilmParental,
  ShowParental,
} from '../../types/parental/parental-types';
import { sequelize } from '../../util/db';
import Genre from '../genres/genre';
import MediaGenre from '../genres/mediaGenre';
import { AuthorType, MediaType } from '../../types/media/media-types';
import MediaRole from '../people/mediaRole';
import { Media, Rating } from '..';

class Show extends Media<InferAttributes<Show>, InferCreationAttributes<Show>> {
  declare tmdbId: number;
  declare imdbId?: string;
  declare mediaType: MediaType.Show;
  declare parentalGuide: keyof typeof FilmParental | null;
  declare lastAirDate: string | null;
  declare episodeCount: number;
  declare seasonCount: number;

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
        mediaType: MediaType.Show,
        role: AuthorType.Actor,
      },
      constraints: false,
    });

    this.hasMany(MediaRole, {
      foreignKey: 'mediaId',
      as: 'crew',
      scope: {
        mediaType: MediaType.Show,
        role: { [Op.ne]: AuthorType.Actor },
      },
      constraints: false,
    });
    this.hasMany(Rating, {
      foreignKey: 'mediaId',
      as: 'ratings',
      scope: {
        MediaType: MediaType.Show,
      },
      constraints: false,
    });
  }
}

Show.init(
  {
    ...Media.baseInit(),
    tmdbId: {
      type: DataTypes.INTEGER,
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
      allowNull: true,
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

    scopes: {
      withSeasons: {
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
            'showId',
            'releaseDate',
            'episodeCount',
            'mediaType',
            'updatedAt',
          ],
        },
        order: [['seasons', 'index', 'ASC']],
      },
      withCredits: Media.creditsScope(MediaType.Show),
    },
  }
);
export type ShowAttributes = InferAttributes<Show>;
export type CreateShow = Omit<ShowAttributes, 'id'>;

export default Show;
