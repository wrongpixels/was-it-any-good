import { Model } from 'sequelize';

export const toPlain = <T extends Model>(
  entry: T | null | undefined
): T['dataValues'] | null => entry?.get({ plain: true }) ?? null;

export const toPlainArray = <T extends Model>(
  entries: T[] | null | undefined
): T['dataValues'][] =>
  entries?.map((instance) => instance.get({ plain: true })) ?? [];
