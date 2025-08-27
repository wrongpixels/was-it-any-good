import { CreateUser, VerifyCreateUser } from '../../../shared/types/models';
import { verifyCreateUserData } from '../utils/create-user-verifier';

export const createUser = async (createUserData: VerifyCreateUser) => {
  const { isError } = verifyCreateUserData(createUserData);
  if (isError) {
    return;
  }
};
