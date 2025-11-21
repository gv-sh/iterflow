/**
 * Input validation utilities for IterFlow operations
 * @module validation
 */

import { ValidationError, TypeConversionError } from "./errors.js";

/**
 * Validates that a value is a positive integer
 */
export function validatePositiveInteger(
  value: number,
  paramName: string,
  operation?: string,
): void {
  if (!Number.isInteger(value)) {
    throw new ValidationError(
      `${paramName} must be an integer, got ${value}`,
      operation,
      { paramName, value },
    );
  }

  if (value < 1) {
    throw new ValidationError(
      `${paramName} must be at least 1, got ${value}`,
      operation,
      { paramName, value },
    );
  }
}

/**
 * Validates that a value is a non-negative integer
 */
export function validateNonNegativeInteger(
  value: number,
  paramName: string,
  operation?: string,
): void {
  if (!Number.isInteger(value)) {
    throw new ValidationError(
      `${paramName} must be an integer, got ${value}`,
      operation,
      { paramName, value },
    );
  }

  if (value < 0) {
    throw new ValidationError(
      `${paramName} must be non-negative, got ${value}`,
      operation,
      { paramName, value },
    );
  }
}

/**
 * Validates that a value is within a specific range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  paramName: string,
  operation?: string,
): void {
  if (value < min || value > max) {
    throw new ValidationError(
      `${paramName} must be between ${min} and ${max}, got ${value}`,
      operation,
      { paramName, value, min, max },
    );
  }
}

/**
 * Validates that a value is a finite number (not NaN or Infinity)
 */
export function validateFiniteNumber(
  value: number,
  paramName: string,
  operation?: string,
): void {
  if (!Number.isFinite(value)) {
    throw new ValidationError(
      `${paramName} must be a finite number, got ${value}`,
      operation,
      { paramName, value },
    );
  }
}

/**
 * Validates that a value is not zero
 */
export function validateNonZero(
  value: number,
  paramName: string,
  operation?: string,
): void {
  if (value === 0) {
    throw new ValidationError(`${paramName} cannot be zero`, operation, {
      paramName,
      value,
    });
  }
}

/**
 * Validates that a value is a function
 */
export function validateFunction(
  value: unknown,
  paramName: string,
  operation?: string,
): asserts value is Function {
  if (typeof value !== "function") {
    throw new ValidationError(
      `${paramName} must be a function, got ${typeof value}`,
      operation,
      { paramName, type: typeof value },
    );
  }
}

/**
 * Validates that a value is iterable
 */
export function validateIterable<T>(
  value: unknown,
  paramName: string,
  operation?: string,
): asserts value is Iterable<T> {
  if (value == null || typeof (value as any)[Symbol.iterator] !== "function") {
    throw new ValidationError(`${paramName} must be iterable`, operation, {
      paramName,
      type: typeof value,
    });
  }
}

/**
 * Validates that a value is a valid comparator function
 */
export function validateComparator<T>(
  fn: unknown,
  operation?: string,
): asserts fn is (a: T, b: T) => number {
  validateFunction(fn, "comparator", operation);

  // Optional: Test with sample values if needed
  // This is a basic check - actual validation happens at runtime
}

/**
 * Validates that an array is not empty
 */
export function validateNonEmpty<T>(arr: T[], operation?: string): void {
  if (arr.length === 0) {
    throw new ValidationError("Sequence cannot be empty", operation);
  }
}

/**
 * Safely converts a value to a number
 */
export function toNumber(
  value: unknown,
  paramName: string,
  operation?: string,
): number {
  const num = Number(value);

  if (Number.isNaN(num)) {
    throw new TypeConversionError(value, "number", operation);
  }

  return num;
}

/**
 * Safely converts a value to an integer
 */
export function toInteger(
  value: unknown,
  paramName: string,
  operation?: string,
): number {
  const num = toNumber(value, paramName, operation);
  const int = Math.trunc(num);

  if (num !== int) {
    throw new TypeConversionError(value, "integer", operation);
  }

  return int;
}

/**
 * Validates array index
 */
export function validateIndex(
  index: number,
  size: number,
  operation?: string,
): void {
  validateNonNegativeInteger(index, "index", operation);

  if (index >= size) {
    throw new ValidationError(
      `Index ${index} is out of bounds for size ${size}`,
      operation,
      { index, size },
    );
  }
}

/**
 * Validates that a number is a safe integer within JavaScript's safe integer range
 * @param value - The value to validate
 * @param paramName - The parameter name for error messages
 * @param operation - The operation name for error context
 */
export function validateSafeInteger(
  value: number,
  paramName: string,
  operation?: string,
): void {
  if (!Number.isSafeInteger(value)) {
    throw new ValidationError(
      `${paramName} must be a safe integer (${Number.MIN_SAFE_INTEGER} to ${Number.MAX_SAFE_INTEGER}), got ${value}`,
      operation,
      { paramName, value },
    );
  }
}

/**
 * Validates that a window/chunk size is within reasonable bounds
 * @param size - The size to validate
 * @param maxSize - The maximum allowed size (default: 1,000,000)
 * @param operation - The operation name for error context
 */
export function validateWindowSize(
  size: number,
  maxSize: number = 1_000_000,
  operation?: string,
): void {
  validatePositiveInteger(size, "size", operation);

  if (size > maxSize) {
    throw new ValidationError(
      `Window size ${size} exceeds maximum allowed size ${maxSize}. Consider using smaller windows or streaming operations.`,
      operation,
      { size, maxSize },
    );
  }
}

/**
 * Validates that an array size is within reasonable memory bounds
 * @param size - The estimated size
 * @param maxElements - The maximum allowed elements (default: 10,000,000)
 * @param operation - The operation name for error context
 */
export function validateMemoryLimit(
  size: number,
  maxElements: number = 10_000_000,
  operation?: string,
): void {
  validateNonNegativeInteger(size, "size", operation);

  if (size > maxElements) {
    throw new ValidationError(
      `Operation would exceed memory limit (${size} elements > ${maxElements} maximum). Consider using streaming operations with take() or chunk().`,
      operation,
      { size, maxElements },
    );
  }
}
