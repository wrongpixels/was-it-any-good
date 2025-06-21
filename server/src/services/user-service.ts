import { CreateUserData, CreateUser } from '../../../shared/types/models';
import { validateUser } from '../schemas/user-schema';
import bcrypt from 'bcrypt';

//We check the type and content with zod, then generate a hash, and force an interface without a password field
export const validateAndBuildUserData = async (
  data: unknown
): Promise<CreateUserData> => {
  const createUser: CreateUser = validateUser(data);
  const hash: string = await bcrypt.hash(createUser.password, 10);
  return {
    name: createUser.name,
    username: createUser.username,
    email: createUser.email,
    hash,
    pfp: createUser.pfp,
    isActive: createUser.isActive,
    lastActive: createUser.lastActive,
    isAdmin: createUser.isAdmin,
  };
};
