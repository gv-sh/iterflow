import { IterFlow } from "./iter-flow.js";
import { validateNonZero } from "./validation.js";

/**
 * Creates an iterflow instance from an iterable.
 * This is the main entry point for working with iterables in a fluent API style.
 *
 * @template T The type of elements in the iterable
 * @param source - The iterable to wrap
 * @returns A new iterflow instance
 * @example
 * ```typescript
 * iter([1, 2, 3, 4, 5])
 *   .filter(x => x % 2 === 0)
 *   .map(x => x * 2)
 *   .toArray(); // [4, 8]
 * ```
 */
export function iter<T>(source: Iterable<T>): IterFlow<T> {
  return new IterFlow(source);
}

// Static helper methods namespace
export namespace iter {
  /**
   * Combines two iterables into an iterator of tuples.
   * Stops when the shorter iterable is exhausted.
   *
   * @template T The type of elements in the first iterable
   * @template U The type of elements in the second iterable
   * @param iter1 - The first iterable
   * @param iter2 - The second iterable
   * @returns A new iterflow of tuples pairing elements from both iterables
   * @example
   * ```typescript
   * iter.zip([1, 2, 3], ['a', 'b', 'c']).toArray();
   * // [[1, 'a'], [2, 'b'], [3, 'c']]
   * ```
   */
  export function zip<T, U>(
    iter1: Iterable<T>,
    iter2: Iterable<U>,
  ): IterFlow<[T, U]> {
    return new IterFlow({
      *[Symbol.iterator]() {
        const it1 = iter1[Symbol.iterator]();
        const it2 = iter2[Symbol.iterator]();

        while (true) {
          const result1 = it1.next();
          const result2 = it2.next();

          if (result1.done || result2.done) {
            break;
          }

          yield [result1.value, result2.value];
        }
      },
    });
  }

  /**
   * Combines two iterables using a combining function.
   * Stops when the shorter iterable is exhausted.
   *
   * @template T The type of elements in the first iterable
   * @template U The type of elements in the second iterable
   * @template R The type of the result
   * @param iter1 - The first iterable
   * @param iter2 - The second iterable
   * @param fn - Function to combine elements from both iterables
   * @returns A new iterflow with combined results
   * @example
   * ```typescript
   * iter.zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b).toArray();
   * // [11, 22, 33]
   * ```
   */
  export function zipWith<T, U, R>(
    iter1: Iterable<T>,
    iter2: Iterable<U>,
    fn: (a: T, b: U) => R,
  ): IterFlow<R> {
    return zip(iter1, iter2).map(([a, b]) => fn(a, b));
  }

  /**
   * Generates a sequence of numbers.
   * Supports three call signatures:
   * - range(stop): generates [0, stop) with step 1
   * - range(start, stop): generates [start, stop) with step 1
   * - range(start, stop, step): generates [start, stop) with custom step
   *
   * @param stop - The end value (exclusive) when called with one argument
   * @returns A new iterflow of numbers
   * @throws {Error} If step is zero
   * @example
   * ```typescript
   * iter.range(5).toArray(); // [0, 1, 2, 3, 4]
   * iter.range(2, 5).toArray(); // [2, 3, 4]
   * iter.range(0, 10, 2).toArray(); // [0, 2, 4, 6, 8]
   * iter.range(5, 0, -1).toArray(); // [5, 4, 3, 2, 1]
   * ```
   */
  export function range(stop: number): IterFlow<number>;
  /**
   * Generates a sequence of numbers from start to stop (exclusive).
   *
   * @param start - The starting value (inclusive)
   * @param stop - The end value (exclusive)
   * @returns A new iterflow of numbers
   */
  export function range(start: number, stop: number): IterFlow<number>;
  /**
   * Generates a sequence of numbers from start to stop (exclusive) with a custom step.
   *
   * @param start - The starting value (inclusive)
   * @param stop - The end value (exclusive)
   * @param step - The increment between values
   * @returns A new iterflow of numbers
   */
  export function range(
    start: number,
    stop: number,
    step: number,
  ): IterFlow<number>;
  export function range(
    startOrStop: number,
    stop?: number,
    step = 1,
  ): IterFlow<number> {
    const actualStart = stop === undefined ? 0 : startOrStop;
    const actualStop = stop === undefined ? startOrStop : stop;

    return new IterFlow({
      *[Symbol.iterator]() {
        validateNonZero(step, "step", "range");

        if (step > 0) {
          for (let i = actualStart; i < actualStop; i += step) {
            yield i;
          }
        } else {
          for (let i = actualStart; i > actualStop; i += step) {
            yield i;
          }
        }
      },
    });
  }

  /**
   * Repeats a value a specified number of times, or infinitely.
   * If times is not specified, creates an infinite iterator.
   *
   * @template T The type of the value to repeat
   * @param value - The value to repeat
   * @param times - Optional number of times to repeat (infinite if omitted)
   * @returns A new iterflow repeating the value
   * @example
   * ```typescript
   * iter.repeat('x', 3).toArray(); // ['x', 'x', 'x']
   * iter.repeat(0, 5).toArray(); // [0, 0, 0, 0, 0]
   * iter.repeat(1).take(3).toArray(); // [1, 1, 1] (infinite, limited by take)
   * ```
   */
  export function repeat<T>(value: T, times?: number): IterFlow<T> {
    return new IterFlow({
      *[Symbol.iterator]() {
        if (times === undefined) {
          while (true) {
            yield value;
          }
        } else {
          for (let i = 0; i < times; i++) {
            yield value;
          }
        }
      },
    });
  }

  /**
   * Alternates elements from multiple iterables in a round-robin fashion.
   * Continues until all iterables are exhausted.
   *
   * @template T The type of elements in all iterables
   * @param iterables - Variable number of iterables to interleave
   * @returns A new iterflow with elements from all iterables interleaved
   * @example
   * ```typescript
   * iter.interleave([1, 2, 3], [4, 5, 6]).toArray();
   * // [1, 4, 2, 5, 3, 6]
   * iter.interleave([1, 2], [3, 4, 5], [6]).toArray();
   * // [1, 3, 6, 2, 4, 5]
   * ```
   */
  export function interleave<T>(...iterables: Iterable<T>[]): IterFlow<T> {
    return new IterFlow({
      *[Symbol.iterator]() {
        if (iterables.length === 0) return;

        const iterators = iterables.map((it) => it[Symbol.iterator]());
        const active = new Set(iterators);

        while (active.size > 0) {
          for (const iterator of iterators) {
            if (!active.has(iterator)) continue;

            const result = iterator.next();
            if (result.done) {
              active.delete(iterator);
            } else {
              yield result.value;
            }
          }
        }
      },
    });
  }

  /**
   * Merges multiple sorted iterables into a single sorted iterator.
   * Assumes input iterables are already sorted in ascending order.
   * Uses a custom comparator if provided, otherwise uses default < comparison.
   *
   * @template T The type of elements in all iterables
   * @param iterables - Variable number of sorted iterables to merge
   * @param compareFn - Optional comparison function (returns negative if a < b, positive if a > b, 0 if equal)
   * @returns A new iterflow with all elements merged in sorted order
   * @example
   * ```typescript
   * iter.merge([1, 3, 5], [2, 4, 6]).toArray();
   * // [1, 2, 3, 4, 5, 6]
   * iter.merge([1, 5, 9], [2, 6, 10], [3, 7, 11]).toArray();
   * // [1, 2, 3, 5, 6, 7, 9, 10, 11]
   * ```
   */
  export function merge<T>(...iterables: Iterable<T>[]): IterFlow<T>;
  export function merge<T>(
    compareFn: (a: T, b: T) => number,
    ...iterables: Iterable<T>[]
  ): IterFlow<T>;
  export function merge<T>(
    ...args: (Iterable<T> | ((a: T, b: T) => number))[]
  ): IterFlow<T> {
    let compareFn: (a: T, b: T) => number;
    let iterables: Iterable<T>[];

    // Check if first argument is a function (comparator)
    if (typeof args[0] === "function") {
      compareFn = args[0] as (a: T, b: T) => number;
      iterables = args.slice(1) as Iterable<T>[];
    } else {
      // Default comparator for numbers/strings
      compareFn = (a: T, b: T) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      };
      iterables = args as Iterable<T>[];
    }

    return new IterFlow({
      *[Symbol.iterator]() {
        if (iterables.length === 0) return;

        // Initialize all iterators with their first value
        const heap: Array<{
          value: T;
          iterator: Iterator<T>;
          index: number;
        }> = [];

        for (let i = 0; i < iterables.length; i++) {
          const iterator = iterables[i]![Symbol.iterator]();
          const result = iterator.next();
          if (!result.done) {
            heap.push({ value: result.value, iterator, index: i });
          }
        }

        // Helper to maintain min-heap property
        const bubbleDown = (index: number) => {
          const length = heap.length;
          while (true) {
            let smallest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (
              leftChild < length &&
              compareFn(heap[leftChild]!.value, heap[smallest]!.value) < 0
            ) {
              smallest = leftChild;
            }

            if (
              rightChild < length &&
              compareFn(heap[rightChild]!.value, heap[smallest]!.value) < 0
            ) {
              smallest = rightChild;
            }

            if (smallest === index) break;

            [heap[index], heap[smallest]] = [heap[smallest]!, heap[index]!];
            index = smallest;
          }
        };

        // Build initial heap
        for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
          bubbleDown(i);
        }

        // Extract minimum and refill from same iterator
        while (heap.length > 0) {
          const { value, iterator } = heap[0]!;
          yield value;

          const result = iterator.next();
          if (result.done) {
            // Remove this iterator from heap
            heap[0] = heap[heap.length - 1]!;
            heap.pop();
            if (heap.length > 0) {
              bubbleDown(0);
            }
          } else {
            // Replace with next value from same iterator
            heap[0]!.value = result.value;
            bubbleDown(0);
          }
        }
      },
    });
  }

  /**
   * Chains multiple iterables sequentially, one after another.
   * Yields all elements from the first iterable, then all from the second, etc.
   *
   * @template T The type of elements in all iterables
   * @param iterables - Variable number of iterables to chain
   * @returns A new iterflow with all elements chained sequentially
   * @example
   * ```typescript
   * iter.chain([1, 2], [3, 4], [5, 6]).toArray();
   * // [1, 2, 3, 4, 5, 6]
   * iter.chain([1], [2, 3], [], [4, 5, 6]).toArray();
   * // [1, 2, 3, 4, 5, 6]
   * ```
   */
  export function chain<T>(...iterables: Iterable<T>[]): IterFlow<T> {
    return new IterFlow({
      *[Symbol.iterator]() {
        for (const iterable of iterables) {
          yield* iterable;
        }
      },
    });
  }
}

// Export the sync class
export { IterFlow } from "./iter-flow.js";

// Export async functionality
export { AsyncIterflow, asyncIter } from "./async-iter-flow.js";

// Export error handling
export {
  IterFlowError,
  ValidationError,
  OperationError,
  EmptySequenceError,
  IndexOutOfBoundsError,
  TypeConversionError,
} from "./errors.js";

// Export validation utilities
export {
  validatePositiveInteger,
  validateNonNegativeInteger,
  validateRange,
  validateFiniteNumber,
  validateNonZero,
  validateFunction,
  validateIterable,
  validateComparator,
  validateNonEmpty,
  toNumber,
  toInteger,
  validateIndex,
} from "./validation.js";

// Export debug utilities
export {
  enableDebug,
  disableDebug,
  isDebugEnabled,
  getDebugConfig,
  addTrace,
  getTraces,
  clearTraces,
  getTracesForOperation,
  getTraceSummary,
  traceOperation,
  traceOperationAsync,
} from "./debug.js";
export type { TraceEntry, DebugConfig } from "./debug.js";

// Export error recovery utilities
export {
  withErrorRecovery,
  withRetry,
  withRetryAsync,
  withDefault,
  tryOr,
  tryCatch,
  tryCatchAsync,
  toResult,
  toResultAsync,
  safePredicate,
  safeComparator,
  errorBoundary,
} from "./recovery.js";
export type { ErrorHandler, RetryOptions, Result } from "./recovery.js";

// Export deprecation utilities
export {
  configureDeprecation,
  getDeprecationConfig,
  clearDeprecationWarnings,
  deprecate,
  deprecated,
  deprecatedFunction,
  hasDeprecationWarning,
} from "./deprecation.js";
export type { DeprecationConfig, DeprecationWarning } from "./deprecation.js";
