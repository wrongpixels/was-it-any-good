export const NOTI_WRONG_LOGIN_DATA: string = "Wrong username or password";
export const NOTI_MISSING_USER_AND_PASSWORD: string =
  "User and Password are required!";

export const NOTI_MISSING_USER_OR_PASSWORD: string = "cannot be empty!";

export const NOTI_WELCOME_USER: string = "Welcome back,";
export const NOTI_BYE_USER: string = "See you soon,";

export const getMissingUserOrPasswordMessage = (username: string): string =>
  `${username ? "Username" : "Password"} ${NOTI_MISSING_USER_OR_PASSWORD}`;
export const getWelcomeUserMessage = (username: string): string =>
  `${NOTI_WELCOME_USER} ${username}!`;
export const getByeUserMessage = (username: string): string =>
  `${NOTI_BYE_USER} ${username}!`;
