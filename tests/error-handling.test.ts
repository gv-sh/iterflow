import { describe, it, expect } from "vitest";
import {
  iter,
  IterFlowError,
  ValidationError,
  OperationError,
  EmptySequenceError,
  IndexOutOfBoundsError,
  TypeConversionError,
  validatePositiveInteger,
  validateNonNegativeInteger,
  validateRange,
  validateFiniteNumber,
  validateNonZero,
  validateFunction,
  validateIterable,
  withErrorRecovery,
  withRetry,
  withDefault,
  tryOr,
  tryCatch,
  toResult,
  safePredicate,
  safeComparator,
  enableDebug,
  disableDebug,
  getTraces,
  clearTraces,
  traceOperation,
} from "../src/index.js";
import * as fn from "../src/fn/index.js";

describe("Error Classes", () => {
  describe("IterFlowError", () => {
    it("should create a basic error", () => {
      const error = new IterFlowError("Test error");
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("IterFlowError");
      expect(error.message).toBe("Test error");
    });

    it("should include operation and context", () => {
      const error = new IterFlowError("Test error", "map", { value: 42 });
      expect(error.operation).toBe("map");
      expect(error.context).toEqual({ value: 42 });
    });

    it("should format detailed error message", () => {
      const error = new IterFlowError("Test error", "filter", { index: 5 });
      const detailed = error.toDetailedString();
      expect(detailed).toContain("IterFlowError: Test error");
      expect(detailed).toContain("Operation: filter");
      expect(detailed).toContain("index");
    });
  });

  describe("ValidationError", () => {
    it("should create a validation error", () => {
      const error = new ValidationError("Invalid parameter", "map", { param: "fn" });
      expect(error).toBeInstanceOf(IterFlowError);
      expect(error.name).toBe("ValidationError");
      expect(error.message).toBe("Invalid parameter");
    });
  });

  describe("OperationError", () => {
    it("should create an operation error with cause", () => {
      const cause = new Error("Original error");
      const error = new OperationError("Operation failed", "map", cause);
      expect(error).toBeInstanceOf(IterFlowError);
      expect(error.name).toBe("OperationError");
      expect(error.cause).toBe(cause);
    });

    it("should format detailed error message with cause", () => {
      const cause = new Error("Original error");
      const error = new OperationError("Operation failed", "map", cause);
      const detailed = error.toDetailedString();
      expect(detailed).toContain("Caused by: Original error");
    });
  });

  describe("EmptySequenceError", () => {
    it("should create an empty sequence error", () => {
      const error = new EmptySequenceError("reduce");
      expect(error).toBeInstanceOf(IterFlowError);
      expect(error.name).toBe("EmptySequenceError");
      expect(error.message).toContain("reduce");
      expect(error.message).toContain("non-empty");
    });

    it("should accept custom message", () => {
      const error = new EmptySequenceError("reduce", "Custom message");
      expect(error.message).toBe("Custom message");
    });
  });

  describe("IndexOutOfBoundsError", () => {
    it("should create an index error", () => {
      const error = new IndexOutOfBoundsError(10, 5, "nth");
      expect(error).toBeInstanceOf(IterFlowError);
      expect(error.name).toBe("IndexOutOfBoundsError");
      expect(error.index).toBe(10);
      expect(error.size).toBe(5);
      expect(error.message).toContain("10");
      expect(error.message).toContain("5");
    });
  });

  describe("TypeConversionError", () => {
    it("should create a type conversion error", () => {
      const error = new TypeConversionError("abc", "number", "sum");
      expect(error).toBeInstanceOf(IterFlowError);
      expect(error.name).toBe("TypeConversionError");
      expect(error.value).toBe("abc");
      expect(error.expectedType).toBe("number");
    });
  });
});

describe("Validation Utilities", () => {
  describe("validatePositiveInteger", () => {
    it("should accept positive integers", () => {
      expect(() => validatePositiveInteger(1, "size")).not.toThrow();
      expect(() => validatePositiveInteger(100, "size")).not.toThrow();
    });

    it("should reject zero", () => {
      expect(() => validatePositiveInteger(0, "size", "window")).toThrow(ValidationError);
      expect(() => validatePositiveInteger(0, "size", "window")).toThrow(/at least 1/);
    });

    it("should reject negative numbers", () => {
      expect(() => validatePositiveInteger(-1, "size", "chunk")).toThrow(ValidationError);
    });

    it("should reject non-integers", () => {
      expect(() => validatePositiveInteger(1.5, "size", "window")).toThrow(ValidationError);
      expect(() => validatePositiveInteger(1.5, "size", "window")).toThrow(/integer/);
    });
  });

  describe("validateNonNegativeInteger", () => {
    it("should accept zero and positive integers", () => {
      expect(() => validateNonNegativeInteger(0, "index")).not.toThrow();
      expect(() => validateNonNegativeInteger(5, "index")).not.toThrow();
    });

    it("should reject negative numbers", () => {
      expect(() => validateNonNegativeInteger(-1, "index")).toThrow(ValidationError);
      expect(() => validateNonNegativeInteger(-1, "index")).toThrow(/non-negative/);
    });
  });

  describe("validateRange", () => {
    it("should accept values within range", () => {
      expect(() => validateRange(50, 0, 100, "percentile")).not.toThrow();
      expect(() => validateRange(0, 0, 100, "percentile")).not.toThrow();
      expect(() => validateRange(100, 0, 100, "percentile")).not.toThrow();
    });

    it("should reject values outside range", () => {
      expect(() => validateRange(-1, 0, 100, "percentile", "percentile")).toThrow(ValidationError);
      expect(() => validateRange(101, 0, 100, "percentile", "percentile")).toThrow(ValidationError);
      expect(() => validateRange(101, 0, 100, "percentile", "percentile")).toThrow(/between 0 and 100/);
    });
  });

  describe("validateFiniteNumber", () => {
    it("should accept finite numbers", () => {
      expect(() => validateFiniteNumber(0, "value")).not.toThrow();
      expect(() => validateFiniteNumber(-100.5, "value")).not.toThrow();
    });

    it("should reject NaN", () => {
      expect(() => validateFiniteNumber(NaN, "value", "sum")).toThrow(ValidationError);
      expect(() => validateFiniteNumber(NaN, "value", "sum")).toThrow(/finite number/);
    });

    it("should reject Infinity", () => {
      expect(() => validateFiniteNumber(Infinity, "value")).toThrow(ValidationError);
      expect(() => validateFiniteNumber(-Infinity, "value")).toThrow(ValidationError);
    });
  });

  describe("validateNonZero", () => {
    it("should accept non-zero numbers", () => {
      expect(() => validateNonZero(1, "step")).not.toThrow();
      expect(() => validateNonZero(-1, "step")).not.toThrow();
    });

    it("should reject zero", () => {
      expect(() => validateNonZero(0, "step", "range")).toThrow(ValidationError);
      expect(() => validateNonZero(0, "step", "range")).toThrow(/cannot be zero/);
    });
  });

  describe("validateFunction", () => {
    it("should accept functions", () => {
      expect(() => validateFunction(() => {}, "fn")).not.toThrow();
      expect(() => validateFunction(function () {}, "fn")).not.toThrow();
    });

    it("should reject non-functions", () => {
      expect(() => validateFunction("not a function", "fn", "map")).toThrow(ValidationError);
      expect(() => validateFunction(null, "fn", "map")).toThrow(ValidationError);
      expect(() => validateFunction(undefined, "fn", "map")).toThrow(ValidationError);
    });
  });

  describe("validateIterable", () => {
    it("should accept iterables", () => {
      expect(() => validateIterable([1, 2, 3], "source")).not.toThrow();
      expect(() => validateIterable("string", "source")).not.toThrow();
      expect(() => validateIterable(new Set([1, 2, 3]), "source")).not.toThrow();
    });

    it("should reject non-iterables", () => {
      expect(() => validateIterable(42, "source", "iter")).toThrow(ValidationError);
      expect(() => validateIterable(null, "source", "iter")).toThrow(ValidationError);
      expect(() => validateIterable({}, "source", "iter")).toThrow(ValidationError);
    });
  });
});

describe("Validation in Operations", () => {
  describe("percentile validation", () => {
    it("should throw for invalid percentile in IterFlow", () => {
      expect(() => iter([1, 2, 3]).percentile(-1)).toThrow(ValidationError);
      expect(() => iter([1, 2, 3]).percentile(101)).toThrow(ValidationError);
    });

    it("should throw for invalid percentile in functional API", () => {
      expect(() => fn.percentile([1, 2, 3], -1)).toThrow(ValidationError);
      expect(() => fn.percentile([1, 2, 3], 101)).toThrow(ValidationError);
    });
  });

  describe("window validation", () => {
    it("should throw for invalid window size in IterFlow", () => {
      expect(() => iter([1, 2, 3]).window(0).toArray()).toThrow(ValidationError);
      expect(() => iter([1, 2, 3]).window(-1).toArray()).toThrow(ValidationError);
      expect(() => iter([1, 2, 3]).window(1.5).toArray()).toThrow(ValidationError);
    });

    it("should throw for invalid window size in functional API", () => {
      expect(() => Array.from(fn.window(0)([1, 2, 3]))).toThrow(ValidationError);
      expect(() => Array.from(fn.window(-1)([1, 2, 3]))).toThrow(ValidationError);
    });
  });

  describe("chunk validation", () => {
    it("should throw for invalid chunk size in IterFlow", () => {
      expect(() => iter([1, 2, 3]).chunk(0).toArray()).toThrow(ValidationError);
      expect(() => iter([1, 2, 3]).chunk(-1).toArray()).toThrow(ValidationError);
    });

    it("should throw for invalid chunk size in functional API", () => {
      expect(() => Array.from(fn.chunk(0)([1, 2, 3]))).toThrow(ValidationError);
      expect(() => Array.from(fn.chunk(-1)([1, 2, 3]))).toThrow(ValidationError);
    });
  });

  describe("range validation", () => {
    it("should throw for zero step in iter.range", () => {
      expect(() => iter.range(0, 10, 0).toArray()).toThrow(ValidationError);
    });

    it("should throw for zero step in functional range", () => {
      expect(() => Array.from(fn.range(0, 10, 0))).toThrow(ValidationError);
    });
  });
});

describe("Error Recovery Utilities", () => {
  describe("withErrorRecovery", () => {
    it("should execute function normally on success", () => {
      const fn = (x: number) => x * 2;
      const safeFn = withErrorRecovery(fn, () => 0);
      expect(safeFn(5)).toBe(10);
    });

    it("should call error handler on failure", () => {
      const fn = (x: number) => {
        if (x === 0) throw new Error("Division by zero");
        return 10 / x;
      };
      const safeFn = withErrorRecovery(fn, () => -1);
      expect(safeFn(0)).toBe(-1);
      expect(safeFn(5)).toBe(2);
    });

    it("should pass error and element to handler", () => {
      const fn = () => {
        throw new Error("Test error");
      };
      const safeFn = withErrorRecovery(fn, (error, element) => {
        return `Error: ${error.message}, Element: ${element}`;
      });
      expect(safeFn(42)).toBe("Error: Test error, Element: 42");
    });
  });

  describe("withRetry", () => {
    it("should succeed on first attempt", () => {
      let attempts = 0;
      const fn = () => {
        attempts++;
        return "success";
      };
      const retryFn = withRetry(fn, { maxAttempts: 3 });
      expect(retryFn()).toBe("success");
      expect(attempts).toBe(1);
    });

    it("should retry on failure", () => {
      let attempts = 0;
      const fn = () => {
        attempts++;
        if (attempts < 3) throw new Error("Fail");
        return "success";
      };
      const retryFn = withRetry(fn, { maxAttempts: 3 });
      expect(retryFn()).toBe("success");
      expect(attempts).toBe(3);
    });

    it("should throw after max attempts", () => {
      const fn = () => {
        throw new Error("Always fails");
      };
      const retryFn = withRetry(fn, { maxAttempts: 3 });
      expect(() => retryFn()).toThrow(OperationError);
    });

    it("should call onRetry callback", () => {
      const retries: number[] = [];
      let attempts = 0;
      const fn = () => {
        attempts++;
        if (attempts < 2) throw new Error("Fail");
        return "success";
      };
      const retryFn = withRetry(fn, {
        maxAttempts: 3,
        onRetry: (attempt) => retries.push(attempt),
      });
      retryFn();
      expect(retries).toEqual([1]);
    });
  });

  describe("withDefault", () => {
    it("should return result on success", () => {
      const fn = withDefault((x: number) => x * 2, -1);
      expect(fn(5)).toBe(10);
    });

    it("should return default on error", () => {
      const fn = withDefault(() => {
        throw new Error("Fail");
      }, -1);
      expect(fn(42)).toBe(-1);
    });
  });

  describe("tryOr", () => {
    it("should return result on success", () => {
      const fn = tryOr((x: number) => x * 2, -1);
      expect(fn(5)).toBe(10);
    });

    it("should return fallback on error", () => {
      const fn = tryOr(() => {
        throw new Error("Fail");
      }, -1);
      expect(fn(42)).toBe(-1);
    });
  });

  describe("tryCatch", () => {
    it("should return [result, undefined] on success", () => {
      const [result, error] = tryCatch((x: number) => x * 2, 5);
      expect(result).toBe(10);
      expect(error).toBeUndefined();
    });

    it("should return [undefined, error] on failure", () => {
      const [result, error] = tryCatch(() => {
        throw new Error("Test error");
      }, 42);
      expect(result).toBeUndefined();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe("Test error");
    });
  });

  describe("toResult", () => {
    it("should return success result", () => {
      const fn = toResult((x: number) => x * 2);
      const result = fn(5);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(10);
      }
    });

    it("should return error result", () => {
      const fn = toResult(() => {
        throw new Error("Test error");
      });
      const result = fn(42);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe("Test error");
      }
    });
  });

  describe("safePredicate", () => {
    it("should return predicate result on success", () => {
      const pred = safePredicate((x: number) => x > 5);
      expect(pred(10)).toBe(true);
      expect(pred(3)).toBe(false);
    });

    it("should return default value on error", () => {
      const pred = safePredicate(
        () => {
          throw new Error("Fail");
        },
        false
      );
      expect(pred(42)).toBe(false);
    });

    it("should use custom default value", () => {
      const pred = safePredicate(
        () => {
          throw new Error("Fail");
        },
        true
      );
      expect(pred(42)).toBe(true);
    });
  });

  describe("safeComparator", () => {
    it("should return comparison result on success", () => {
      const cmp = safeComparator((a: number, b: number) => a - b);
      expect(cmp(5, 3)).toBeGreaterThan(0);
      expect(cmp(3, 5)).toBeLessThan(0);
      expect(cmp(5, 5)).toBe(0);
    });

    it("should return default value on error", () => {
      const cmp = safeComparator(() => {
        throw new Error("Fail");
      }, 0);
      expect(cmp(5, 3)).toBe(0);
    });
  });
});

describe("Debug Mode", () => {
  afterEach(() => {
    disableDebug();
    clearTraces();
  });

  it("should enable and disable debug mode", () => {
    enableDebug();
    expect(getTraces()).toBeDefined();
    disableDebug();
  });

  it("should trace operations", () => {
    enableDebug();
    clearTraces();

    const result = traceOperation("test-op", () => {
      return 42;
    });

    expect(result).toBe(42);
    const traces = getTraces();
    expect(traces.length).toBe(1);
    expect(traces[0]?.operation).toBe("test-op");
  });

  it("should trace errors", () => {
    enableDebug();
    clearTraces();

    expect(() => {
      traceOperation("failing-op", () => {
        throw new Error("Test error");
      });
    }).toThrow("Test error");

    const traces = getTraces();
    expect(traces.length).toBe(1);
    expect(traces[0]?.error).toBeDefined();
    expect(traces[0]?.error?.message).toBe("Test error");
  });

  it("should not trace when disabled", () => {
    disableDebug();
    clearTraces();

    traceOperation("test-op", () => 42);

    const traces = getTraces();
    expect(traces.length).toBe(0);
  });

  it("should clear traces", () => {
    enableDebug();
    traceOperation("op1", () => 1);
    traceOperation("op2", () => 2);

    expect(getTraces().length).toBe(2);

    clearTraces();
    expect(getTraces().length).toBe(0);
  });
});
