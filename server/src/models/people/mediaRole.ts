import {
  BelongsToGetAssociationMixin,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../../util/db';
import { AuthorType, MediaType } from '../../types/media/media-types';
import { Film, Show } from '..';

class MediaRole extends Model<
  InferAttributes<MediaRole>,
  InferCreationAttributes<MediaRole>
> {
  declare id: CreationOptional<number>;
  declare personId: number;
  declare mediaId: number;
  declare mediaType: MediaType;
  declare role: string;
  declare characterName?: string[];
  declare order?: number;
  //For getting the Media entry linked to mediaId
  declare getFilm: BelongsToGetAssociationMixin<Film>;
  declare getShow: BelongsToGetAssociationMixin<Show>;

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

MediaRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    personId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'people',
        key: 'id',
      },
      allowNull: false,
    },
    mediaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.ENUM(...Object.values(MediaType)),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(AuthorType)),
      allowNull: false,
    },
    characterName: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'mediaRole',
    tableName: 'media_roles',
    underscored: true,
  }
);
export type CreateMediaRole = Omit<InferAttributes<MediaRole>, 'id'>;

export default MediaRole;
