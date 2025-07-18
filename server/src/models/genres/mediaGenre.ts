import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../../util/db';
import { MediaType } from '../../../../shared/types/media';

class MediaGenre extends Model<
  InferAttributes<MediaGenre>,
  InferCreationAttributes<MediaGenre>
> {
  declare id: CreationOptional<number>;
  declare mediaId: number;
  declare genreId: number;
  declare mediaType: MediaType;
}

MediaGenre.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    genreId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'genres',
        key: 'id',
      },
    },
    mediaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.ENUM(...Object.values(MediaType)),
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
