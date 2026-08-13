class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation error") {
    super(message, 400);
  }
}

module.exports = {
  AppError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ValidationError
};
