type ErrorOptions = {
  statusCode?: number;
  isOperational?: boolean;
  metadata?: Record<string, unknown>;
};

export const createAppError = (errorName: string, defaultStatusCode: number) => {
  return class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    metadata?: Record<string, unknown>;

    constructor(message: string, options: ErrorOptions = {}) {
      super(message);
      this.name = errorName;
      this.statusCode = options.statusCode || defaultStatusCode;
      this.isOperational = options.isOperational ?? true;
      this.metadata = options.metadata;

      Error.captureStackTrace(this, this.constructor);
    }
  };
};
