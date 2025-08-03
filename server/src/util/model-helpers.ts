import { Model } from 'sequelize';

export const toPlain = <T extends Model>(entry: T): T['dataValues'] =>
  entry?.get({ plain: true }) ?? null;

export const toPlainArray = <T extends Model>(
  entries: T[]
): T['dataValues'][] =>
  entries?.map((instance) => instance.get({ plain: true })) ?? [];
