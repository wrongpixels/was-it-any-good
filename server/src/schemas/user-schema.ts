import { z } from 'zod';
import { ActiveUser, CreateUser } from '../../../shared/types/models';
import { JwtPayload } from 'jsonwebtoken';
import { INV_ACTIVE_USER } from '../constants/user-defaults';
import { User } from '../models';

const CreateUserSchema = z.object({
  name: z.string().nullable(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  pfp: z.string().url().email().nullable(),
  lastActive: z.date().nullable(),
  isActive: z.boolean(),
  isAdmin: z.boolean(),
});

const ActiveUserSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  username: z.string(),
  lastActive: z.date().nullable(),
  isActive: z.boolean(),
  isAdmin: z.boolean(),
  isValid: z.boolean(),
});

export const validateUser = (data: unknown): CreateUser =>
  CreateUserSchema.parse(data);

export const validateActiveUser = async (
  data: JwtPayload | string
): Promise<ActiveUser> => {
  const result = ActiveUserSchema.safeParse(data);
  if (result.error || result.data?.id < 0 || !result.data.username) {
    return INV_ACTIVE_USER;
  }
  const activeUser: ActiveUser = result.data;
  const user = await User.findOne({
    where: {
      id: activeUser.id,
      username: activeUser.username,
    },
  });
  if (!user) {
    return INV_ACTIVE_USER;
  }
  return { ...result.data, isValid: true };
};

export default CreateUserSchema;
