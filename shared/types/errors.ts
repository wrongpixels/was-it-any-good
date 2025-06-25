export interface APIError {
  status: number;
  name: string;
  message: string;
}

export const isApiError = (error: unknown): error is APIError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' &&
    'name' &&
    'message' in error
  );
};

export const isAuthError = (error: unknown): error is APIError =>
  isApiError(error) && error.status === 401;
