export class AppError extends Error {
  status: number;
  errorMessage?: string;
  constructor(status: number, message: string, errorMessage?: string) {
    super(message);
    this.status = status;
    this.errorMessage = errorMessage;
  }
  static badRequest(message = 'Bad Request', errorMessage = 'Invalid request') {
    return new AppError(400, message, errorMessage);
  }
  static unauthorized(message = 'Unauthorized', errorMessage = 'Please sign in') {
    return new AppError(401, message, errorMessage);
  }
  static forbidden(message = 'Forbidden', errorMessage = 'You do not have permission') {
    return new AppError(403, message, errorMessage);
  }
  static notFound(message = 'Not Found', errorMessage = 'Resource not found') {
    return new AppError(404, message, errorMessage);
  }
  static conflict(message = 'Conflict', errorMessage = 'Already exists') {
    return new AppError(409, message, errorMessage);
  }
  static internal(message = 'Internal Server Error', errorMessage = 'Something went wrong') {
    return new AppError(500, message, errorMessage);
  }
}
