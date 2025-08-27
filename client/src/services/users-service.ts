import axios, { AxiosResponse } from 'axios';
import {
  CreateUser,
  UserData,
  VerifyCreateUser,
} from '../../../shared/types/models';
import { apiPaths } from '../utils/url-helper';

export const createUser = async (
  verifiedUserData: VerifyCreateUser
): Promise<UserData> => {
  const createUserData: CreateUser = {
    isAdmin: false,
    isActive: true,
    pfp: null,
    name: null,
    lastActive: null,
    ...verifiedUserData,
  };
  const { data: newUser }: AxiosResponse<UserData> = await axios.post(
    apiPaths.users.base,
    createUserData
  );
  return newUser;
};
