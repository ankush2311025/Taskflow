export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    isOperational = true,
    errors?: unknown
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}