import { z } from 'zod';
import { CreateUser } from '../../../shared/types/models';

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

export const validateUser = (data: unknown): CreateUser =>
  CreateUserSchema.parse(data);

export default CreateUserSchema;
