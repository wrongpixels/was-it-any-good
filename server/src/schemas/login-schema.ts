import z from 'zod';
import { LoginData } from '../../../shared/types/models';

const LoginDataSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const validateLoginData = (data: unknown): LoginData =>
  LoginDataSchema.parse(data);
