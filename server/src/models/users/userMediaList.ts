import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { MediaType } from '../../../../shared/types/media';
import { sequelize } from '../../util/db/initialize-db';
import UserMediaListItem from './userMediaListItem';
import {
  MAX_LENGTH_DESCRIPTION,
  MAX_LENGTH_NAME,
  MAX_USER_LISTS_INDEX,
  MIN_LENGTH_DESCRIPTION,
  MIN_LENGTH_NAME,
} from '../../../../shared/constants/user-media-list-constants';
import {
  USER_MEDIA_LIST_ICONS,
  UserMediaListIcon,
} from '../../../../shared/types/models';

class UserMediaList extends Model<
  InferAttributes<UserMediaList>,
  InferCreationAttributes<UserMediaList>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: CreationOptional<string>;
  declare userId: number;
  declare indexInUserLists: number;
  declare mediaTypes: CreationOptional<MediaType[]>;
  declare icon: CreationOptional<UserMediaListIcon>;
  declare lockedMediaType: CreationOptional<boolean>;
  declare canBeModified: CreationOptional<boolean>;
  declare autoRemoveItems: CreationOptional<boolean>;
  declare private: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare listItems?: UserMediaListItem[];

  static associate() {
    this.hasMany(UserMediaListItem, {
      foreignKey: 'userListId',
      as: 'listItems',
      //so if we delete the list, all the items are also deleted
      onDelete: 'CASCADE',
      hooks: true,
    });
  }
}

UserMediaList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: MAX_LENGTH_NAME,
        min: MIN_LENGTH_NAME,
      },
    },
    autoRemoveItems: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    canBeModified: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
      validate: {
        max: MAX_LENGTH_DESCRIPTION,
        min: MIN_LENGTH_DESCRIPTION,
      },
    },
    indexInUserLists: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,

      validate: {
        min: 0,
        max: MAX_USER_LISTS_INDEX,
      },
    },
    icon: {
      type: DataTypes.ENUM(...USER_MEDIA_LIST_ICONS),
      allowNull: false,
      defaultValue: 'multi',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    mediaTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [MediaType.Film, MediaType.Show],
      validate: {
        isValidMediaTypeArray(value: string[]) {
          if (!Array.isArray(value)) {
            throw new Error('Must be an array!');
          }
          if (value.length === 0) {
            throw new Error('MediaTypes Array cannot be empty');
          }
          const mediaTypes: string[] = Object.values(MediaType);
          value.forEach((s: string) => {
            if (!mediaTypes.includes(s)) {
              throw new Error(
                `Invalid MediaType. Array must be of MediaType, but received: ${s}`
              );
            }
          });
        },
      },
    },
    lockedMediaType: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user_media_list',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'name'],
      },
      {
        unique: true,
        fields: ['user_id', 'index_in_user_lists'],
      },
    ],
  }
);

export default UserMediaList;
