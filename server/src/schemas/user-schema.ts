import { z } from 'zod';
import { CreateUserData } from '../../../shared/types/models';

const CreateUserSchema = z.object({
  name: z.string(),
  userName: z.string(),
  hash: z.string(),
  email: z.string().email(),
  pfp: z.string().email().nullable(),
  lastActive: z.date().nullable(),
  isActive: z.boolean(),
  isAdmin: z.boolean(),
});

export const validate = (data: unknown): CreateUserData =>
  CreateUserSchema.parse(data);

export default CreateUserSchema;
