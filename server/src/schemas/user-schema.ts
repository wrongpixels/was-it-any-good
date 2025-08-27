import { z } from 'zod';
import { CreateUser } from '../../../shared/types/models';

const CreateUserSchema = z.object({
  name: z.string().nullable(),
  username: z.string().min(4),
  password: z.string().min(7),
  email: z.string().email(),
  pfp: z.string().url().email().nullable(),
  lastActive: z.date().nullable(),
  isActive: z.boolean(),
  isAdmin: z.boolean(),
});

export const ActiveUserSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  username: z.string(),
  lastActive: z
    .string()
    .transform((str) => new Date(str))
    .nullable(),
  isActive: z.boolean(),
  isAdmin: z.boolean(),
});

export const validateUser = (data: unknown): CreateUser =>
  CreateUserSchema.parse(data);

export default CreateUserSchema;
