import { useMutation } from '@tanstack/react-query';
import { VerifyCreateUser } from '../../../shared/types/models';
import { createUser } from '../services/users-service';

const useCreateUserMutation = () => {
  useMutation({
    mutationFn: (createUserData: VerifyCreateUser) => createUser,
  });
};
