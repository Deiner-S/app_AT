export type ValidationSource = 'user_input' | 'api_contract' | 'domain';

export default class ValidationException extends Error {
  public readonly source: ValidationSource;

  constructor(message: string, source: ValidationSource, cause?: unknown) {
    super(message);
    this.name = 'ValidationException';
    this.source = source;

    if (cause !== undefined) {
      Object.defineProperty(this, 'cause', {
        value: cause,
        enumerable: false,
        configurable: true,
        writable: true,
      });
    }
  }
}

export function isValidationException(error: unknown): error is ValidationException {
  return error instanceof ValidationException;
}

export function isUserInputValidationException(error: unknown): error is ValidationException {
  return isValidationException(error) && error.source === 'user_input';
}

export function rethrowAsValidationException<T>(
  source: ValidationSource,
  operation: () => T
): T {
  try {
    return operation();
  } catch (error) {
    if (isValidationException(error)) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ValidationException(error.message, source, error);
    }

    throw new ValidationException(String(error), source, error);
  }
}
