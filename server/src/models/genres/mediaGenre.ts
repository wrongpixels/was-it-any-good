import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { MediaType } from '../../types/media/media-types';
import { sequelize } from '../../util/db';

class MediaGenre extends Model<
  InferAttributes<MediaGenre>,
  InferCreationAttributes<MediaGenre>
> {
  declare mediaId: number;
  declare genreId: number;
  declare mediaType: MediaType;
}

MediaGenre.init(
  {
    genreId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'genres',
        key: 'id',
      },
    },
    mediaId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    mediaType: {
      type: DataTypes.ENUM(...Object.values(MediaType)),
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    indexes: [
      {
        unique: true,
        fields: ['media_id', 'media_type', 'genre_id'],
      },
    ],
    underscored: true,
    modelName: 'mediaGenre',
    tableName: 'media_genres',
  }
);

export default MediaGenre;
