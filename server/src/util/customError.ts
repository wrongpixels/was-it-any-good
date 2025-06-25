class CustomError extends Error {
  status: number;
  constructor(
    message: string = 'There was an error with the request',
    status: number = 500,
    name: string = 'Error'
  ) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export default CustomError;
