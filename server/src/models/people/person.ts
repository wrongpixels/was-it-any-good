import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../../util/db';
import { CountryCode, isCountryCode } from '../../../../shared/types/countries';
import { MediaType } from '../../../../shared/types/media';
import IndexMedia from '../media/indexMedia';

class Person extends Model<
  InferAttributes<Person>,
  InferCreationAttributes<Person>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare tmdbId?: number;
  declare gamedbId?: string;
  declare image: string;
  declare birthDate?: string;
  declare country: CountryCode[];
}

Person.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tmdbId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: true,
    },
    gamedbId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
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
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'person',
    underscored: true,
    scopes: {
      withMedia: {
        include: [
          {
            association: 'roles',
            attributes: ['id', 'role', 'mediaId', 'mediaType', 'characterName'],
            include: [
              {
                association: 'film',
                attributes: ['indexId'],
                required: false,
                where: {
                  '$roles.media_type$': MediaType.Film,
                },
                include: [
                  {
                    model: IndexMedia,
                    as: 'indexMedia',
                  },
                ],
              },
              {
                association: 'show',
                attributes: ['indexId'],
                required: false,
                where: {
                  '$roles.media_type$': MediaType.Show,
                },
                include: [
                  {
                    model: IndexMedia,
                    as: 'indexMedia',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  }
);
export type PersonAttributes = InferAttributes<Person>;
export type CreatePerson = Omit<PersonAttributes, 'id'>;

export default Person;
