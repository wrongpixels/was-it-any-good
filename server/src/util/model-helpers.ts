import { Model } from 'sequelize';

export const toPlainData = <T extends Model>(
  data: T[] | null | undefined
): T['dataValues'][] => data?.map((instance) => instance.toJSON()) ?? [];
