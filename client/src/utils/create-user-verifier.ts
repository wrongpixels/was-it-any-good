import { VerifyCreateUser } from '../../../shared/types/models';
import { BLACKLISTED_USERNAMES } from '../constants/user-constants';

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
  } else if (!username || !password) {
    errorMessage = 'You need to provide both a username and a password';
    isError = true;
  } else if (BLACKLISTED_USERNAMES.includes(username.toLowerCase())) {
    errorMessage = 'You cannot use that username!';
    isError = true;
  } else if (username.length < 4) {
    errorMessage = 'The username has to be at least 4 characters long!';
    isError = true;
  } else if (password.length < 7) {
    errorMessage = 'The password has to be at least 7 characters long!';
    isError = true;
  } else if (!email) {
    errorMessage = 'Provide an e-mail address (just make one up!)';
    isError = true;
  }
  return { isError, errorMessage };
};
