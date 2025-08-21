export interface APIError {
  status: number;
  name: string;
  message: string;
  code?: string | number;
}
