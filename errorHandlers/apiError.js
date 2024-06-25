class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = APIError;

