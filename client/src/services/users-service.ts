import { CreateUser } from '../../../shared/types/models';
import { verifyCreateUserData } from '../utils/create-user-verifier';

export const createUser = (createUser: CreateUser) => {
  const { isError } = verifyCreateUserData(createUser);
  if (isError) {
    return;
  }
};
