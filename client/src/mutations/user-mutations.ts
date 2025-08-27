import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { UserData, VerifyCreateUser } from '../../../shared/types/models';
import { createUser } from '../services/users-service';

export const useCreateUserMutation = (): UseMutationResult<
  UserData,
  Error,
  VerifyCreateUser
> => {
  return useMutation({
    mutationFn: (verifiedUserData: VerifyCreateUser) =>
      createUser(verifiedUserData),
  });
};
