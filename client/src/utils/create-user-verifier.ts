import { VerifyCreateUser } from '../../../shared/types/models';

export const verifyCreateUserData = ({
  username,
  password,
  email,
  isAdmin,
}: VerifyCreateUser) => {
  let isError: boolean = false;
  let errorMessage: string = 'There was an error with your User data';
  if (isAdmin) {
    errorMessage = 'Sorry, you cannot crack the user creation process!';
    isError = true;
  }
  if (!username || !password) {
    errorMessage = 'You need to provide both a username and a password';
    isError = true;
  }
  if (!email) {
    errorMessage =
      'You need to provide an e-mail address (we will not verify it, just make one up!)';
    isError = true;
  }
  if (username.length <= 4) {
    errorMessage = 'The username has to be at least 7 characters long!';
    isError = true;
  }
  if (password.length <= 7) {
    errorMessage = 'The username has to be at least 7 characters long!';
    isError = true;
  }
  return { isError, errorMessage };
};
