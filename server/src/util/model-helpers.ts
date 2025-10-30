import { Attributes, FindOptions, Model, ModelStatic } from 'sequelize';

export const toPlain = <T extends Model>(entry: T): T['dataValues'] =>
  entry?.get({ plain: true }) ?? null;

export const toPlainArray = <T extends Model>(
  entries: T[]
): T['dataValues'][] =>
  entries?.map((instance) => instance.get({ plain: true })) ?? [];

//a helper function that confirms an X entry is a Y model instance
export const isModelInstance = <M extends ModelStatic<Model>>(
  value: unknown,
  modelCtor: M
): value is InstanceType<M> => {
  return value instanceof modelCtor;
};

//a universal sequelize model finder by pk that accepts a Model, a pk and options
export const findByPkInModel = async <M extends ModelStatic<Model>>(
  model: M,
  id: number | string,
  options?: FindOptions<Attributes<InstanceType<M>>>
): Promise<InstanceType<M> | null> => {
  const rawEntry = await model.findByPk(id, options);
  if (isModelInstance(rawEntry, model)) {
    return rawEntry;
  }
  return null;
};

//a universal sequelize model finder that accepts a Model and find options
export const findInModel = async <M extends ModelStatic<Model>>(
  model: M,
  options?: FindOptions<Attributes<InstanceType<M>>>
): Promise<InstanceType<M> | null> => {
  const rawEntry = await model.findOne(options);
  if (isModelInstance(rawEntry, model)) {
    return rawEntry;
  }
  return null;
};
