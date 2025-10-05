import { APIError } from "../types/errors";

export const AUTH_REQUIRED_ERROR: string = "AUTH_REQUIRED";
export const SESSION_AUTH_ERROR: string = "SESSION_EXPIRED";
export const NOT_FOUND_ERROR: string = "NOT_FOUND";
export const WRONG_FORMAT_ERROR: string = "WRONG_ID";

export const DEF_API_ERROR: APIError = {
  name: "Error",
  message: "There was an error with the request",
  status: 500,
};
