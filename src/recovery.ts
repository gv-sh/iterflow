/**
 * Error recovery utilities for IterFlow
 * @module recovery
 */

import { OperationError } from './errors.js';

/**
 * Error handler function type
 */
export type ErrorHandler<T, R = T> = (error: Error, element?: T, index?: number) => R;

/**
 * Options for retry behavior
 */
export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Wraps a function with error recovery
 */
export function withErrorRecovery<T, R>(
  fn: (value: T, index?: number) => R,
  errorHandler: ErrorHandler<T, R>,
  operation?: string
): (value: T, index?: number) => R {
  return (value: T, index?: number): R => {
    try {
      return fn(value, index);
    } catch (error) {
      return errorHandler(error as Error, value, index);
    }
  };
}

/**
 * Wraps a function with retry logic
 */
export function withRetry<T extends any[], R>(
  fn: (...args: T) => R,
  options: RetryOptions = {}
): (...args: T) => R {
  const {
    maxAttempts = 3,
    delay = 0,
    backoff = false,
    onRetry,
  } = options;

  return (...args: T): R => {
    let lastError: Error;
    let currentDelay = delay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return fn(...args);
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts) {
          if (onRetry) {
            onRetry(attempt, lastError);
          }

          if (currentDelay > 0) {
            // Synchronous delay (note: this blocks, use with caution)
            const start = Date.now();
            while (Date.now() - start < currentDelay) {
              // busy wait
            }
          }

          if (backoff) {
            currentDelay *= 2;
          }
        }
      }
    }

    throw new OperationError(
      `Operation failed after ${maxAttempts} attempts`,
      'retry',
      lastError!
    );
  };
}

/**
 * Async version of withRetry
 */
export function withRetryAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: RetryOptions = {}
): (...args: T) => Promise<R> {
  const {
    maxAttempts = 3,
    delay = 0,
    backoff = false,
    onRetry,
  } = options;

  return async (...args: T): Promise<R> => {
    let lastError: Error;
    let currentDelay = delay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxAttempts) {
          if (onRetry) {
            onRetry(attempt, lastError);
          }

          if (currentDelay > 0) {
            await new Promise((resolve) => setTimeout(resolve, currentDelay));
          }

          if (backoff) {
            currentDelay *= 2;
          }
        }
      }
    }

    throw new OperationError(
      `Operation failed after ${maxAttempts} attempts`,
      'retry',
      lastError!
    );
  };
}

/**
 * Returns a default value if an error occurs
 */
export function withDefault<T, R>(
  fn: (value: T) => R,
  defaultValue: R
): (value: T) => R {
  return (value: T): R => {
    try {
      return fn(value);
    } catch {
      return defaultValue;
    }
  };
}

/**
 * Returns undefined if an error occurs (swallows errors)
 */
export function tryOr<T, R>(
  fn: (value: T) => R,
  fallback: R
): (value: T) => R {
  return (value: T): R => {
    try {
      return fn(value);
    } catch {
      return fallback;
    }
  };
}

/**
 * Executes a function and returns [result, error] tuple
 */
export function tryCatch<T, R>(
  fn: (value: T) => R,
  value: T
): [R | undefined, Error | undefined] {
  try {
    return [fn(value), undefined];
  } catch (error) {
    return [undefined, error as Error];
  }
}

/**
 * Async version of tryCatch
 */
export async function tryCatchAsync<T, R>(
  fn: (value: T) => Promise<R>,
  value: T
): Promise<[R | undefined, Error | undefined]> {
  try {
    return [await fn(value), undefined];
  } catch (error) {
    return [undefined, error as Error];
  }
}

/**
 * Result type for safe operations
 */
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Wraps a function to return a Result type
 */
export function toResult<T, R>(
  fn: (value: T) => R
): (value: T) => Result<R> {
  return (value: T): Result<R> => {
    try {
      return { success: true, value: fn(value) };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  };
}

/**
 * Async version of toResult
 */
export function toResultAsync<T, R>(
  fn: (value: T) => Promise<R>
): (value: T) => Promise<Result<R>> {
  return async (value: T): Promise<Result<R>> => {
    try {
      return { success: true, value: await fn(value) };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  };
}

/**
 * Guards a predicate function to return false on error instead of throwing
 */
export function safePredicate<T>(
  predicate: (value: T, index?: number) => boolean,
  defaultValue = false
): (value: T, index?: number) => boolean {
  return (value: T, index?: number): boolean => {
    try {
      return predicate(value, index);
    } catch {
      return defaultValue;
    }
  };
}

/**
 * Guards a comparator function to handle errors gracefully
 */
export function safeComparator<T>(
  comparator: (a: T, b: T) => number,
  defaultComparison = 0
): (a: T, b: T) => number {
  return (a: T, b: T): number => {
    try {
      return comparator(a, b);
    } catch {
      return defaultComparison;
    }
  };
}

/**
 * Creates an error boundary that catches and logs errors
 */
export function errorBoundary<T extends any[], R>(
  fn: (...args: T) => R,
  options: {
    onError?: (error: Error, args: T) => void;
    rethrow?: boolean;
    defaultValue?: R;
  } = {}
): (...args: T) => R | undefined {
  const { onError, rethrow = true, defaultValue } = options;

  return (...args: T): R | undefined => {
    try {
      return fn(...args);
    } catch (error) {
      if (onError) {
        onError(error as Error, args);
      }

      if (rethrow) {
        throw error;
      }

      return defaultValue;
    }
  };
}
