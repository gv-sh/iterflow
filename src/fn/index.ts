// Functional API exports - for functional programming style usage
// Usage: import { sum, filter, map } from 'iterflow/fn';

import {
  validateRange,
  validatePositiveInteger,
  validateNonZero,
} from "../validation.js";

// Statistical operations
/**
 * Calculates the sum of all numeric elements in an iterable.
 *
 * @param iterable - The iterable of numbers to sum
 * @returns The sum of all elements
 * @example
 * ```typescript
 * sum([1, 2, 3, 4, 5]); // 15
 * ```
 */
export function sum(iterable: Iterable<number>): number {
  let total = 0;
  for (const value of iterable) {
    total += value;
  }
  return total;
}

/**
 * Calculates the arithmetic mean (average) of all numeric elements.
 *
 * @param iterable - The iterable of numbers
 * @returns The mean value, or undefined if the iterable is empty
 * @example
 * ```typescript
 * mean([1, 2, 3, 4, 5]); // 3
 * mean([]); // undefined
 * ```
 */
export function mean(iterable: Iterable<number>): number | undefined {
  let total = 0;
  let count = 0;
  for (const value of iterable) {
    total += value;
    count++;
  }
  return count === 0 ? undefined : total / count;
}

/**
 * Finds the minimum value among all numeric elements.
 *
 * @param iterable - The iterable of numbers
 * @returns The minimum value, or undefined if the iterable is empty
 * @example
 * ```typescript
 * min([3, 1, 4, 1, 5]); // 1
 * min([]); // undefined
 * ```
 */
export function min(iterable: Iterable<number>): number | undefined {
  let minimum: number | undefined = undefined;
  for (const value of iterable) {
    if (minimum === undefined || value < minimum) {
      minimum = value;
    }
  }
  return minimum;
}

/**
 * Finds the maximum value among all numeric elements.
 *
 * @param iterable - The iterable of numbers
 * @returns The maximum value, or undefined if the iterable is empty
 * @example
 * ```typescript
 * max([3, 1, 4, 1, 5]); // 5
 * max([]); // undefined
 * ```
 */
export function max(iterable: Iterable<number>): number | undefined {
  let maximum: number | undefined = undefined;
  for (const value of iterable) {
    if (maximum === undefined || value > maximum) {
      maximum = value;
    }
  }
  return maximum;
}

/**
 * Counts the total number of elements in an iterable.
 *
 * @template T The type of elements in the iterable
 * @param iterable - The iterable to count
 * @returns The total count of elements
 * @example
 * ```typescript
 * count([1, 2, 3, 4, 5]); // 5
 * count([]); // 0
 * ```
 */
export function count<T>(iterable: Iterable<T>): number {
  let count = 0;
  for (const _ of iterable) {
    count++;
  }
  return count;
}

/**
 * Calculates the median value of all numeric elements.
 * The median is the middle value when elements are sorted.
 *
 * @param iterable - The iterable of numbers
 * @returns The median value, or undefined if the iterable is empty
 * @example
 * ```typescript
 * median([1, 2, 3, 4, 5]); // 3
 * median([1, 2, 3, 4]); // 2.5
 * median([]); // undefined
 * ```
 */
export function median(iterable: Iterable<number>): number | undefined {
  const values = Array.from(iterable);
  if (values.length === 0) return undefined;

  values.sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);

  if (values.length % 2 === 0) {
    return (values[mid - 1]! + values[mid]!) / 2;
  } else {
    return values[mid]!;
  }
}

/**
 * Calculates the variance of all numeric elements.
 * Variance measures how far each number in the set is from the mean.
 *
 * @param iterable - The iterable of numbers
 * @returns The variance, or undefined if the iterable is empty
 * @example
 * ```typescript
 * variance([1, 2, 3, 4, 5]); // 2
 * variance([]); // undefined
 * ```
 */
export function variance(iterable: Iterable<number>): number | undefined {
  const values = Array.from(iterable);
  if (values.length === 0) return undefined;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Optimize: calculate sum of squared differences in single pass without intermediate array
  let sumSquaredDiffs = 0;
  for (let i = 0; i < values.length; i++) {
    const diff = values[i] - mean;
    sumSquaredDiffs += diff * diff;
  }

  return sumSquaredDiffs / values.length;
}

/**
 * Calculates the standard deviation of all numeric elements.
 * Standard deviation is the square root of variance and measures dispersion.
 *
 * @param iterable - The iterable of numbers
 * @returns The standard deviation, or undefined if the iterable is empty
 * @example
 * ```typescript
 * stdDev([2, 4, 4, 4, 5, 5, 7, 9]); // ~2
 * stdDev([]); // undefined
 * ```
 */
export function stdDev(iterable: Iterable<number>): number | undefined {
  const varianceValue = variance(iterable);
  return varianceValue === undefined ? undefined : Math.sqrt(varianceValue);
}

/**
 * Calculates the specified percentile of all numeric elements.
 * Uses linear interpolation between closest ranks.
 *
 * @param iterable - The iterable of numbers
 * @param p - The percentile to calculate (0-100)
 * @returns The percentile value, or undefined if the iterable is empty
 * @throws {Error} If p is not between 0 and 100
 * @example
 * ```typescript
 * percentile([1, 2, 3, 4, 5], 50); // 3 (median)
 * percentile([1, 2, 3, 4, 5], 75); // 4
 * percentile([], 50); // undefined
 * ```
 */
export function percentile(
  iterable: Iterable<number>,
  p: number,
): number | undefined {
  validateRange(p, 0, 100, "percentile", "percentile");

  const values = Array.from(iterable);
  if (values.length === 0) return undefined;

  values.sort((a, b) => a - b);

  if (p === 0) return values[0];
  if (p === 100) return values[values.length - 1];

  const index = (p / 100) * (values.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return values[lower]!;
  }

  const weight = index - lower;
  return values[lower]! * (1 - weight) + values[upper]! * weight;
}

/**
 * Finds the most frequent value(s) in the dataset.
 * Returns an array of all values that appear most frequently.
 *
 * @param iterable - The iterable of numbers
 * @returns An array of the most frequent value(s), or undefined if the iterable is empty
 * @example
 * ```typescript
 * mode([1, 2, 2, 3, 3, 3]); // [3]
 * mode([1, 1, 2, 2, 3]); // [1, 2] (bimodal)
 * mode([]); // undefined
 * ```
 */
export function mode(iterable: Iterable<number>): number[] | undefined {
  const values = Array.from(iterable);
  if (values.length === 0) return undefined;

  const frequency = new Map<number, number>();
  let maxFreq = 0;

  for (const value of values) {
    const count = (frequency.get(value) || 0) + 1;
    frequency.set(value, count);
    maxFreq = Math.max(maxFreq, count);
  }

  const modes: number[] = [];
  for (const [value, freq] of frequency) {
    if (freq === maxFreq) {
      modes.push(value);
    }
  }

  return modes.sort((a, b) => a - b);
}

/**
 * Calculates the quartiles (Q1, Q2, Q3) of all numeric elements.
 * Q1 is the 25th percentile, Q2 is the median (50th percentile), Q3 is the 75th percentile.
 *
 * @param iterable - The iterable of numbers
 * @returns An object with Q1, Q2, and Q3 values, or undefined if the iterable is empty
 * @example
 * ```typescript
 * quartiles([1, 2, 3, 4, 5, 6, 7, 8, 9]);
 * // { Q1: 3, Q2: 5, Q3: 7 }
 * quartiles([]); // undefined
 * ```
 */
export function quartiles(
  iterable: Iterable<number>,
): { Q1: number; Q2: number; Q3: number } | undefined {
  const values = Array.from(iterable);
  if (values.length === 0) return undefined;

  values.sort((a, b) => a - b);

  const calculatePercentile = (p: number): number => {
    if (p === 0) return values[0]!;
    if (p === 100) return values[values.length - 1]!;

    const index = (p / 100) * (values.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) {
      return values[lower]!;
    }

    const weight = index - lower;
    return values[lower]! * (1 - weight) + values[upper]! * weight;
  };

  return {
    Q1: calculatePercentile(25),
    Q2: calculatePercentile(50),
    Q3: calculatePercentile(75),
  };
}

/**
 * Calculates the span (range from minimum to maximum value) of all numeric elements.
 *
 * @param iterable - The iterable of numbers
 * @returns The span (max - min), or undefined if the iterable is empty
 * @example
 * ```typescript
 * span([1, 2, 3, 4, 5]); // 4
 * span([10]); // 0
 * span([]); // undefined
 * ```
 */
export function span(iterable: Iterable<number>): number | undefined {
  let minimum: number | undefined = undefined;
  let maximum: number | undefined = undefined;

  for (const value of iterable) {
    if (minimum === undefined || value < minimum) {
      minimum = value;
    }
    if (maximum === undefined || value > maximum) {
      maximum = value;
    }
  }

  return minimum === undefined || maximum === undefined
    ? undefined
    : maximum - minimum;
}

/**
 * Calculates the product of all numeric elements.
 *
 * @param iterable - The iterable of numbers
 * @returns The product of all elements, or 1 if the iterable is empty
 * @example
 * ```typescript
 * product([1, 2, 3, 4, 5]); // 120
 * product([2, 3, 4]); // 24
 * product([]); // 1
 * ```
 */
export function product(iterable: Iterable<number>): number {
  let result = 1;
  for (const value of iterable) {
    result *= value;
  }
  return result;
}

/**
 * Calculates the covariance between two numeric sequences.
 * Covariance measures the joint variability of two random variables.
 *
 * @param iter1 - The first iterable of numbers
 * @param iter2 - The second iterable of numbers
 * @returns The covariance, or undefined if either sequence is empty or sequences have different lengths
 * @example
 * ```typescript
 * covariance([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]); // 4
 * covariance([], [1, 2, 3]); // undefined
 * ```
 */
export function covariance(
  iter1: Iterable<number>,
  iter2: Iterable<number>,
): number | undefined {
  const values1 = Array.from(iter1);
  const values2 = Array.from(iter2);

  if (
    values1.length === 0 ||
    values2.length === 0 ||
    values1.length !== values2.length
  ) {
    return undefined;
  }

  const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
  const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;

  let covariance = 0;
  for (let i = 0; i < values1.length; i++) {
    covariance += (values1[i]! - mean1) * (values2[i]! - mean2);
  }

  return covariance / values1.length;
}

/**
 * Calculates the Pearson correlation coefficient between two numeric sequences.
 * Correlation measures the strength and direction of the linear relationship between two variables.
 * Values range from -1 (perfect negative correlation) to 1 (perfect positive correlation).
 *
 * @param iter1 - The first iterable of numbers
 * @param iter2 - The second iterable of numbers
 * @returns The correlation coefficient, or undefined if either sequence is empty or sequences have different lengths
 * @example
 * ```typescript
 * correlation([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]); // 1 (perfect positive correlation)
 * correlation([1, 2, 3], [3, 2, 1]); // -1 (perfect negative correlation)
 * correlation([], [1, 2, 3]); // undefined
 * ```
 */
export function correlation(
  iter1: Iterable<number>,
  iter2: Iterable<number>,
): number | undefined {
  const values1 = Array.from(iter1);
  const values2 = Array.from(iter2);

  if (
    values1.length === 0 ||
    values2.length === 0 ||
    values1.length !== values2.length
  ) {
    return undefined;
  }

  const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
  const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;

  let covariance = 0;
  let variance1 = 0;
  let variance2 = 0;

  for (let i = 0; i < values1.length; i++) {
    const diff1 = values1[i]! - mean1;
    const diff2 = values2[i]! - mean2;
    covariance += diff1 * diff2;
    variance1 += diff1 * diff1;
    variance2 += diff2 * diff2;
  }

  const stdDev1 = Math.sqrt(variance1 / values1.length);
  const stdDev2 = Math.sqrt(variance2 / values2.length);

  if (stdDev1 === 0 || stdDev2 === 0) {
    return undefined;
  }

  return covariance / (values1.length * stdDev1 * stdDev2);
}

// Transforming operations
/**
 * Creates a curried function that transforms each element using the provided function.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of input elements
 * @template U The type of output elements
 * @param fn - Function to transform each element
 * @returns A function that transforms an iterable
 * @example
 * ```typescript
 * const double = map((x: number) => x * 2);
 * Array.from(double([1, 2, 3])); // [2, 4, 6]
 * ```
 */
export function map<T, U>(
  fn: (value: T) => U,
): (iterable: Iterable<T>) => IterableIterator<U> {
  return function* (iterable: Iterable<T>): IterableIterator<U> {
    for (const value of iterable) {
      yield fn(value);
    }
  };
}

/**
 * Creates a curried function that filters elements based on a predicate.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of elements
 * @param predicate - Function to test each element
 * @returns A function that filters an iterable
 * @example
 * ```typescript
 * const evens = filter((x: number) => x % 2 === 0);
 * Array.from(evens([1, 2, 3, 4])); // [2, 4]
 * ```
 */
export function filter<T>(
  predicate: (value: T) => boolean,
): (iterable: Iterable<T>) => IterableIterator<T> {
  return function* (iterable: Iterable<T>): IterableIterator<T> {
    for (const value of iterable) {
      if (predicate(value)) {
        yield value;
      }
    }
  };
}

/**
 * Creates a curried function that takes only the first `limit` elements.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of elements
 * @param limit - Maximum number of elements to take
 * @returns A function that takes elements from an iterable
 * @example
 * ```typescript
 * const takeThree = take(3);
 * Array.from(takeThree([1, 2, 3, 4, 5])); // [1, 2, 3]
 * ```
 */
export function take<T>(
  limit: number,
): (iterable: Iterable<T>) => IterableIterator<T> {
  return function* (iterable: Iterable<T>): IterableIterator<T> {
    let count = 0;
    for (const value of iterable) {
      if (count >= limit) break;
      yield value;
      count++;
    }
  };
}

/**
 * Creates a curried function that skips the first `count` elements.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of elements
 * @param count - Number of elements to skip
 * @returns A function that drops elements from an iterable
 * @example
 * ```typescript
 * const dropTwo = drop(2);
 * Array.from(dropTwo([1, 2, 3, 4, 5])); // [3, 4, 5]
 * ```
 */
export function drop<T>(
  count: number,
): (iterable: Iterable<T>) => IterableIterator<T> {
  return function* (iterable: Iterable<T>): IterableIterator<T> {
    let dropped = 0;
    for (const value of iterable) {
      if (dropped < count) {
        dropped++;
        continue;
      }
      yield value;
    }
  };
}

/**
 * Creates a curried function that maps each element to an iterable and flattens the results.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of input elements
 * @template U The type of output elements
 * @param fn - Function that maps each element to an iterable
 * @returns A function that flat maps an iterable
 * @example
 * ```typescript
 * const duplicateEach = flatMap((x: number) => [x, x * 2]);
 * Array.from(duplicateEach([1, 2, 3])); // [1, 2, 2, 4, 3, 6]
 * ```
 */
export function flatMap<T, U>(
  fn: (value: T) => Iterable<U>,
): (iterable: Iterable<T>) => IterableIterator<U> {
  return function* (iterable: Iterable<T>): IterableIterator<U> {
    for (const value of iterable) {
      yield* fn(value);
    }
  };
}

/**
 * Creates a curried function that concatenates multiple iterables sequentially.
 * Returns a function that takes any number of iterables and yields all elements in order.
 *
 * @template T The type of elements
 * @returns A function that concatenates iterables
 * @example
 * ```typescript
 * const concatAll = concat<number>();
 * Array.from(concatAll([1, 2], [3, 4], [5, 6]));
 * // [1, 2, 3, 4, 5, 6]
 * ```
 */
export function concat<T>(): (
  ...iterables: Iterable<T>[]
) => IterableIterator<T> {
  return function* (...iterables: Iterable<T>[]): IterableIterator<T> {
    for (const iterable of iterables) {
      yield* iterable;
    }
  };
}

/**
 * Creates a curried function that inserts a separator element between each item.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of elements
 * @param separator - The element to insert between items
 * @returns A function that intersperses an iterable
 * @example
 * ```typescript
 * const addCommas = intersperse(',');
 * Array.from(addCommas(['a', 'b', 'c']));
 * // ['a', ',', 'b', ',', 'c']
 * ```
 */
export function intersperse<T>(
  separator: T,
): (iterable: Iterable<T>) => IterableIterator<T> {
  return function* (iterable: Iterable<T>): IterableIterator<T> {
    let isFirst = true;
    for (const value of iterable) {
      if (!isFirst) {
        yield separator;
      }
      yield value;
      isFirst = false;
    }
  };
}

/**
 * Creates a curried function that emits all intermediate accumulator values.
 * Like reduce but yields each intermediate result.
 *
 * @template T The type of elements in the iterable
 * @template U The type of the accumulated value
 * @param fn - Function to combine the accumulator with each element
 * @param initial - The initial value for the accumulator
 * @returns A function that scans an iterable
 * @example
 * ```typescript
 * const runningSum = scan((acc: number, x: number) => acc + x, 0);
 * Array.from(runningSum([1, 2, 3, 4]));
 * // [0, 1, 3, 6, 10]
 * ```
 */
export function scan<T, U>(
  fn: (accumulator: U, value: T) => U,
  initial: U,
): (iterable: Iterable<T>) => IterableIterator<U> {
  return function* (iterable: Iterable<T>): IterableIterator<U> {
    let accumulator = initial;
    yield accumulator;
    for (const value of iterable) {
      accumulator = fn(accumulator, value);
      yield accumulator;
    }
  };
}

/**
 * Creates a curried function that adds index as tuple with each element [index, value].
 * Returns a function that creates tuples pairing each element with its zero-based index.
 *
 * @template T The type of elements
 * @returns A function that enumerates an iterable
 * @example
 * ```typescript
 * const enumerateItems = enumerate<string>();
 * Array.from(enumerateItems(['a', 'b', 'c']));
 * // [[0, 'a'], [1, 'b'], [2, 'c']]
 * ```
 */
export function enumerate<T>(): (
  iterable: Iterable<T>,
) => IterableIterator<[number, T]> {
  return function* (iterable: Iterable<T>): IterableIterator<[number, T]> {
    let index = 0;
    for (const value of iterable) {
      yield [index, value];
      index++;
    }
  };
}

/**
 * Creates a curried function that reverses the iterator order.
 * Returns a function that takes an iterable and returns an iterable iterator.
 * ⚠️ Warning: This operation buffers all elements in memory and may cause
 * performance issues with large iterables.
 *
 * @template T The type of elements
 * @returns A function that reverses an iterable
 * @example
 * ```typescript
 * const reverseItems = reverse<number>();
 * Array.from(reverseItems([1, 2, 3, 4, 5]));
 * // [5, 4, 3, 2, 1]
 * ```
 */
export function reverse<T>(): (iterable: Iterable<T>) => IterableIterator<T> {
  return function* (iterable: Iterable<T>): IterableIterator<T> {
    const buffer = Array.from(iterable);
    for (let i = buffer.length - 1; i >= 0; i--) {
      yield buffer[i]!;
    }
  };
}

/**
 * Sorts elements using default comparison.
 * Numbers are sorted numerically, strings lexicographically.
 * Note: This operation requires buffering all elements in memory.
 *
 * @param iterable - The iterable to sort
 * @returns An iterable iterator with elements sorted
 * @example
 * ```typescript
 * Array.from(sort([3, 1, 4, 1, 5]));
 * // [1, 1, 3, 4, 5]
 * Array.from(sort(['c', 'a', 'b']));
 * // ['a', 'b', 'c']
 * ```
 */
export function sort(
  iterable: Iterable<number | string>,
): IterableIterator<number | string> {
  return (function* (): IterableIterator<number | string> {
    const buffer = Array.from(iterable);
    buffer.sort((a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a - b;
      }
      return String(a).localeCompare(String(b));
    });
    yield* buffer;
  })();
}

/**
 * Creates a curried function that sorts elements using a custom comparison function.
 * Returns a function that takes an iterable and returns an iterable iterator.
 * Note: This operation requires buffering all elements in memory.
 *
 * @template T The type of elements
 * @param compareFn - Function that compares two elements
 * @returns A function that sorts an iterable
 * @example
 * ```typescript
 * const sortAsc = sortBy((a: number, b: number) => a - b);
 * Array.from(sortAsc([3, 1, 4, 1, 5]));
 * // [1, 1, 3, 4, 5]
 * const sortDesc = sortBy((a: number, b: number) => b - a);
 * Array.from(sortDesc([3, 1, 4, 1, 5]));
 * // [5, 4, 3, 1, 1]
 * ```
 */
export function sortBy<T>(
  compareFn: (a: T, b: T) => number,
): (iterable: Iterable<T>) => IterableIterator<T> {
  return function* (iterable: Iterable<T>): IterableIterator<T> {
    const buffer = Array.from(iterable);
    buffer.sort(compareFn);
    yield* buffer;
  };
}

// Windowing operations
/**
 * Creates a curried function that creates a sliding window of the specified size.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of elements
 * @param size - The size of each window (must be at least 1)
 * @returns A function that creates windows from an iterable
 * @throws {Error} If size is less than 1
 * @example
 * ```typescript
 * const windowThree = window(3);
 * Array.from(windowThree([1, 2, 3, 4, 5]));
 * // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
 * ```
 */
export function window<T>(
  size: number,
): (iterable: Iterable<T>) => IterableIterator<T[]> {
  validatePositiveInteger(size, "size", "window");

  return function* (iterable: Iterable<T>): IterableIterator<T[]> {
    // Use circular buffer to avoid O(n) shift() operations
    const buffer: T[] = new Array(size);
    let count = 0;
    let index = 0;

    for (const value of iterable) {
      buffer[index] = value;
      count++;
      index = (index + 1) % size;

      if (count >= size) {
        // Build window array in correct order from circular buffer
        const window = new Array(size);
        for (let i = 0; i < size; i++) {
          window[i] = buffer[(index + i) % size];
        }
        yield window;
      }
    }
  };
}

/**
 * Creates a curried function that splits elements into chunks of the specified size.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of elements
 * @param size - The size of each chunk (must be at least 1)
 * @returns A function that creates chunks from an iterable
 * @throws {Error} If size is less than 1
 * @example
 * ```typescript
 * const chunkTwo = chunk(2);
 * Array.from(chunkTwo([1, 2, 3, 4, 5]));
 * // [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(
  size: number,
): (iterable: Iterable<T>) => IterableIterator<T[]> {
  validatePositiveInteger(size, "size", "chunk");

  return function* (iterable: Iterable<T>): IterableIterator<T[]> {
    // Preallocate buffer to avoid dynamic resizing
    let buffer: T[] = new Array(size);
    let bufferIndex = 0;

    for (const value of iterable) {
      buffer[bufferIndex++] = value;

      if (bufferIndex === size) {
        yield buffer;
        buffer = new Array(size);
        bufferIndex = 0;
      }
    }

    if (bufferIndex > 0) {
      // Slice to remove unused preallocated slots
      yield buffer.slice(0, bufferIndex);
    }
  };
}

/**
 * Creates pairs of consecutive elements from an iterable.
 * Returns an iterable iterator of tuples.
 *
 * @template T The type of elements
 * @param iterable - The iterable to create pairs from
 * @returns An iterable iterator of tuples containing consecutive elements
 * @example
 * ```typescript
 * Array.from(pairwise([1, 2, 3, 4]));
 * // [[1, 2], [2, 3], [3, 4]]
 * ```
 */
export function pairwise<T>(iterable: Iterable<T>): IterableIterator<[T, T]> {
  return (function* (): IterableIterator<[T, T]> {
    const windowIter = window<T>(2)(iterable);
    for (const arr of { [Symbol.iterator]: () => windowIter }) {
      yield [arr[0]!, arr[1]!] as [T, T];
    }
  })();
}

// Grouping operations
/**
 * Creates a curried function that splits elements into two arrays based on a predicate.
 * Returns a function that takes an iterable and returns a tuple of arrays.
 *
 * @template T The type of elements
 * @param predicate - Function to test each element
 * @returns A function that partitions an iterable
 * @example
 * ```typescript
 * const partitionEvens = partition((x: number) => x % 2 === 0);
 * partitionEvens([1, 2, 3, 4, 5]);
 * // [[2, 4], [1, 3, 5]]
 * ```
 */
export function partition<T>(
  predicate: (value: T) => boolean,
): (iterable: Iterable<T>) => [T[], T[]] {
  return function (iterable: Iterable<T>): [T[], T[]] {
    const truthy: T[] = [];
    const falsy: T[] = [];

    for (const value of iterable) {
      if (predicate(value)) {
        truthy.push(value);
      } else {
        falsy.push(value);
      }
    }

    return [truthy, falsy];
  };
}

/**
 * Creates a curried function that groups elements by a key function into a Map.
 * Returns a function that takes an iterable and returns a Map.
 *
 * @template T The type of elements
 * @template K The type of the grouping key
 * @param keyFn - Function to extract the grouping key from each element
 * @returns A function that groups an iterable
 * @example
 * ```typescript
 * const groupByLength = groupBy((s: string) => s.length);
 * groupByLength(['alice', 'bob', 'charlie', 'dave']);
 * // Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'], 4 => ['dave'] }
 * ```
 */
export function groupBy<T, K>(
  keyFn: (value: T) => K,
): (iterable: Iterable<T>) => Map<K, T[]> {
  return function (iterable: Iterable<T>): Map<K, T[]> {
    const groups = new Map<K, T[]>();

    for (const value of iterable) {
      const key = keyFn(value);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(value);
    }

    return groups;
  };
}

// Set operations
/**
 * Removes duplicate elements from an iterable, keeping only the first occurrence of each.
 * Uses strict equality (===) to compare elements.
 *
 * @template T The type of elements
 * @param iterable - The iterable to deduplicate
 * @returns An iterable iterator with duplicate elements removed
 * @example
 * ```typescript
 * Array.from(distinct([1, 2, 2, 3, 1, 4]));
 * // [1, 2, 3, 4]
 * ```
 */
export function distinct<T>(iterable: Iterable<T>): IterableIterator<T> {
  return (function* (): IterableIterator<T> {
    const seen = new Set<T>();

    for (const value of iterable) {
      if (!seen.has(value)) {
        seen.add(value);
        yield value;
      }
    }
  })();
}

/**
 * Creates a curried function that removes duplicate elements based on a key function.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of elements
 * @template K The type of the key used for comparison
 * @param keyFn - Function to extract the comparison key from each element
 * @returns A function that deduplicates an iterable by key
 * @example
 * ```typescript
 * const users = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Charlie'}];
 * const distinctById = distinctBy((u: typeof users[0]) => u.id);
 * Array.from(distinctById(users));
 * // [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}]
 * ```
 */
export function distinctBy<T, K>(
  keyFn: (value: T) => K,
): (iterable: Iterable<T>) => IterableIterator<T> {
  return function* (iterable: Iterable<T>): IterableIterator<T> {
    const seenKeys = new Set<K>();

    for (const value of iterable) {
      const key = keyFn(value);
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        yield value;
      }
    }
  };
}

// Utility operations
/**
 * Creates a curried function that executes a side-effect function on each element.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of elements
 * @param fn - Function to execute for each element
 * @returns A function that taps an iterable
 * @example
 * ```typescript
 * const log = tap((x: number) => console.log('Processing:', x));
 * Array.from(log([1, 2, 3])); // logs each value, returns [1, 2, 3]
 * ```
 */
export function tap<T>(
  fn: (value: T) => void,
): (iterable: Iterable<T>) => IterableIterator<T> {
  return function* (iterable: Iterable<T>): IterableIterator<T> {
    for (const value of iterable) {
      fn(value);
      yield value;
    }
  };
}

/**
 * Creates a curried function that takes elements while the predicate returns true.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of elements
 * @param predicate - Function to test each element
 * @returns A function that takes elements while predicate is true
 * @example
 * ```typescript
 * const takeLessThanFour = takeWhile((x: number) => x < 4);
 * Array.from(takeLessThanFour([1, 2, 3, 4, 1, 2]));
 * // [1, 2, 3]
 * ```
 */
export function takeWhile<T>(
  predicate: (value: T) => boolean,
): (iterable: Iterable<T>) => IterableIterator<T> {
  return function* (iterable: Iterable<T>): IterableIterator<T> {
    for (const value of iterable) {
      if (!predicate(value)) break;
      yield value;
    }
  };
}

/**
 * Creates a curried function that skips elements while the predicate returns true.
 * Returns a function that takes an iterable and returns an iterable iterator.
 *
 * @template T The type of elements
 * @param predicate - Function to test each element
 * @returns A function that drops elements while predicate is true
 * @example
 * ```typescript
 * const dropLessThanThree = dropWhile((x: number) => x < 3);
 * Array.from(dropLessThanThree([1, 2, 3, 4, 1, 2]));
 * // [3, 4, 1, 2]
 * ```
 */
export function dropWhile<T>(
  predicate: (value: T) => boolean,
): (iterable: Iterable<T>) => IterableIterator<T> {
  return function* (iterable: Iterable<T>): IterableIterator<T> {
    let dropping = true;
    for (const value of iterable) {
      if (dropping && predicate(value)) {
        continue;
      }
      dropping = false;
      yield value;
    }
  };
}

// Terminal operations
/**
 * Collects all elements from an iterable into an array.
 *
 * @template T The type of elements
 * @param iterable - The iterable to convert to an array
 * @returns An array containing all elements
 * @example
 * ```typescript
 * toArray([1, 2, 3]); // [1, 2, 3]
 * ```
 */
export function toArray<T>(iterable: Iterable<T>): T[] {
  return Array.from(iterable);
}

/**
 * Creates a curried function that reduces an iterable to a single value.
 * Returns a function that takes an iterable and returns the reduced value.
 *
 * @template T The type of elements in the iterable
 * @template U The type of the accumulated value
 * @param fn - Function to combine the accumulator with each element
 * @param initial - The initial value for the accumulator
 * @returns A function that reduces an iterable
 * @example
 * ```typescript
 * const sumAll = reduce((acc: number, x: number) => acc + x, 0);
 * sumAll([1, 2, 3, 4]); // 10
 * const concat = reduce((acc: string, x: string) => acc + x, '');
 * concat(['a', 'b', 'c']); // 'abc'
 * ```
 */
export function reduce<T, U>(
  fn: (accumulator: U, value: T) => U,
  initial: U,
): (iterable: Iterable<T>) => U {
  return function (iterable: Iterable<T>): U {
    let accumulator = initial;
    for (const value of iterable) {
      accumulator = fn(accumulator, value);
    }
    return accumulator;
  };
}

/**
 * Creates a curried function that finds the first element matching a predicate.
 * Returns a function that takes an iterable and returns the first matching element or undefined.
 *
 * @template T The type of elements
 * @param predicate - Function to test each element
 * @returns A function that finds an element in an iterable
 * @example
 * ```typescript
 * const findGreaterThanThree = find((x: number) => x > 3);
 * findGreaterThanThree([1, 2, 3, 4, 5]); // 4
 * findGreaterThanThree([1, 2, 3]); // undefined
 * ```
 */
export function find<T>(
  predicate: (value: T) => boolean,
): (iterable: Iterable<T>) => T | undefined {
  return function (iterable: Iterable<T>): T | undefined {
    for (const value of iterable) {
      if (predicate(value)) {
        return value;
      }
    }
    return undefined;
  };
}

/**
 * Creates a curried function that finds the index of the first element matching a predicate.
 * Returns a function that takes an iterable and returns the index or -1.
 *
 * @template T The type of elements
 * @param predicate - Function to test each element
 * @returns A function that finds an index in an iterable
 * @example
 * ```typescript
 * const findIndexGreaterThanThree = findIndex((x: number) => x > 3);
 * findIndexGreaterThanThree([1, 2, 3, 4, 5]); // 3
 * findIndexGreaterThanThree([1, 2, 3]); // -1
 * ```
 */
export function findIndex<T>(
  predicate: (value: T) => boolean,
): (iterable: Iterable<T>) => number {
  return function (iterable: Iterable<T>): number {
    let index = 0;
    for (const value of iterable) {
      if (predicate(value)) {
        return index;
      }
      index++;
    }
    return -1;
  };
}

/**
 * Creates a curried function that tests if any element matches a predicate.
 * Returns a function that takes an iterable and returns a boolean.
 *
 * @template T The type of elements
 * @param predicate - Function to test each element
 * @returns A function that tests an iterable
 * @example
 * ```typescript
 * const hasGreaterThanThree = some((x: number) => x > 3);
 * hasGreaterThanThree([1, 2, 3, 4, 5]); // true
 * hasGreaterThanThree([1, 2, 3]); // false
 * ```
 */
export function some<T>(
  predicate: (value: T) => boolean,
): (iterable: Iterable<T>) => boolean {
  return function (iterable: Iterable<T>): boolean {
    for (const value of iterable) {
      if (predicate(value)) {
        return true;
      }
    }
    return false;
  };
}

/**
 * Creates a curried function that tests if all elements match a predicate.
 * Returns a function that takes an iterable and returns a boolean.
 *
 * @template T The type of elements
 * @param predicate - Function to test each element
 * @returns A function that tests an iterable
 * @example
 * ```typescript
 * const allEven = every((x: number) => x % 2 === 0);
 * allEven([2, 4, 6]); // true
 * allEven([1, 2, 3]); // false
 * ```
 */
export function every<T>(
  predicate: (value: T) => boolean,
): (iterable: Iterable<T>) => boolean {
  return function (iterable: Iterable<T>): boolean {
    for (const value of iterable) {
      if (!predicate(value)) {
        return false;
      }
    }
    return true;
  };
}

/**
 * Gets the first element from an iterable.
 *
 * @template T The type of elements
 * @param iterable - The iterable to get the first element from
 * @param defaultValue - Optional default value to return if iterable is empty
 * @returns The first element, the default value, or undefined if empty and no default
 * @example
 * ```typescript
 * first([1, 2, 3]); // 1
 * first([]); // undefined
 * first([], 0); // 0
 * ```
 */
export function first<T>(
  iterable: Iterable<T>,
  defaultValue?: T,
): T | undefined {
  const iterator = iterable[Symbol.iterator]();
  const result = iterator.next();
  return result.done ? defaultValue : result.value;
}

/**
 * Gets the last element from an iterable.
 *
 * @template T The type of elements
 * @param iterable - The iterable to get the last element from
 * @param defaultValue - Optional default value to return if iterable is empty
 * @returns The last element, the default value, or undefined if empty and no default
 * @example
 * ```typescript
 * last([1, 2, 3]); // 3
 * last([]); // undefined
 * last([], 0); // 0
 * ```
 */
export function last<T>(
  iterable: Iterable<T>,
  defaultValue?: T,
): T | undefined {
  let lastValue: T | undefined = defaultValue;
  let hasValue = false;
  for (const value of iterable) {
    lastValue = value;
    hasValue = true;
  }
  return hasValue ? lastValue : defaultValue;
}

/**
 * Creates a curried function that gets the element at a specified index.
 * Returns a function that takes an iterable and returns the element or undefined.
 *
 * @template T The type of elements
 * @param index - Zero-based index of the element to retrieve
 * @returns A function that gets an element from an iterable
 * @example
 * ```typescript
 * const getSecond = nth(2);
 * getSecond([1, 2, 3, 4, 5]); // 3
 * getSecond([1, 2]); // undefined
 * nth(-1)([1, 2, 3]); // undefined
 * ```
 */
export function nth<T>(
  index: number,
): (iterable: Iterable<T>) => T | undefined {
  return function (iterable: Iterable<T>): T | undefined {
    if (index < 0) {
      return undefined;
    }
    let currentIndex = 0;
    for (const value of iterable) {
      if (currentIndex === index) {
        return value;
      }
      currentIndex++;
    }
    return undefined;
  };
}

/**
 * Checks if an iterable is empty.
 *
 * @template T The type of elements
 * @param iterable - The iterable to check
 * @returns true if the iterable has no elements, false otherwise
 * @example
 * ```typescript
 * isEmpty([]); // true
 * isEmpty([1, 2, 3]); // false
 * ```
 */
export function isEmpty<T>(iterable: Iterable<T>): boolean {
  const iterator = iterable[Symbol.iterator]();
  const result = iterator.next();
  return result.done === true;
}

/**
 * Creates a curried function that checks if an iterable includes a specific value.
 * Uses strict equality (===) for comparison.
 * Returns a function that takes an iterable and returns a boolean.
 *
 * @template T The type of elements
 * @param searchValue - The value to search for
 * @returns A function that checks if an iterable includes the value
 * @example
 * ```typescript
 * const includesThree = includes(3);
 * includesThree([1, 2, 3, 4, 5]); // true
 * includesThree([1, 2, 4]); // false
 * includes('b')(['a', 'b', 'c']); // true
 * ```
 */
export function includes<T>(
  searchValue: T,
): (iterable: Iterable<T>) => boolean {
  return function (iterable: Iterable<T>): boolean {
    for (const value of iterable) {
      if (value === searchValue) {
        return true;
      }
    }
    return false;
  };
}

// Combining operations
/**
 * Combines two iterables into an iterator of tuples.
 * Stops when the shorter iterable is exhausted.
 *
 * @template T The type of elements in the first iterable
 * @template U The type of elements in the second iterable
 * @param iter1 - The first iterable
 * @param iter2 - The second iterable
 * @returns An iterable iterator of tuples pairing elements from both iterables
 * @example
 * ```typescript
 * Array.from(zip([1, 2, 3], ['a', 'b', 'c']));
 * // [[1, 'a'], [2, 'b'], [3, 'c']]
 * ```
 */
export function zip<T, U>(
  iter1: Iterable<T>,
  iter2: Iterable<U>,
): IterableIterator<[T, U]> {
  return (function* (): IterableIterator<[T, U]> {
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
  })();
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
 * @returns An iterable iterator with combined results
 * @example
 * ```typescript
 * Array.from(zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b));
 * // [11, 22, 33]
 * ```
 */
export function zipWith<T, U, R>(
  iter1: Iterable<T>,
  iter2: Iterable<U>,
  fn: (a: T, b: U) => R,
): IterableIterator<R> {
  return (function* (): IterableIterator<R> {
    const zipIter = zip(iter1, iter2);
    for (const [a, b] of { [Symbol.iterator]: () => zipIter }) {
      yield fn(a, b);
    }
  })();
}

// Generator functions
/**
 * Generates a sequence of numbers.
 * Supports three call signatures:
 * - range(stop): generates [0, stop) with step 1
 * - range(start, stop): generates [start, stop) with step 1
 * - range(start, stop, step): generates [start, stop) with custom step
 *
 * @param stop - The end value (exclusive) when called with one argument
 * @returns An iterable iterator of numbers
 * @throws {Error} If step is zero
 * @example
 * ```typescript
 * Array.from(range(5)); // [0, 1, 2, 3, 4]
 * Array.from(range(2, 5)); // [2, 3, 4]
 * Array.from(range(0, 10, 2)); // [0, 2, 4, 6, 8]
 * Array.from(range(5, 0, -1)); // [5, 4, 3, 2, 1]
 * ```
 */
export function range(stop: number): IterableIterator<number>;
/**
 * Generates a sequence of numbers from start to stop (exclusive).
 *
 * @param start - The starting value (inclusive)
 * @param stop - The end value (exclusive)
 * @returns An iterable iterator of numbers
 */
export function range(start: number, stop: number): IterableIterator<number>;
/**
 * Generates a sequence of numbers from start to stop (exclusive) with a custom step.
 *
 * @param start - The starting value (inclusive)
 * @param stop - The end value (exclusive)
 * @param step - The increment between values
 * @returns An iterable iterator of numbers
 */
export function range(
  start: number,
  stop: number,
  step: number,
): IterableIterator<number>;
export function range(
  startOrStop: number,
  stop?: number,
  step = 1,
): IterableIterator<number> {
  const actualStart = stop === undefined ? 0 : startOrStop;
  const actualStop = stop === undefined ? startOrStop : stop;

  return (function* (): IterableIterator<number> {
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
  })();
}

/**
 * Repeats a value a specified number of times, or infinitely.
 * If times is not specified, creates an infinite iterator.
 *
 * @template T The type of the value to repeat
 * @param value - The value to repeat
 * @param times - Optional number of times to repeat (infinite if omitted)
 * @returns An iterable iterator repeating the value
 * @example
 * ```typescript
 * Array.from(repeat('x', 3)); // ['x', 'x', 'x']
 * Array.from(repeat(0, 5)); // [0, 0, 0, 0, 0]
 * Array.from(take(3)(repeat(1))); // [1, 1, 1] (infinite, limited by take)
 * ```
 */
export function repeat<T>(value: T, times?: number): IterableIterator<T> {
  return (function* (): IterableIterator<T> {
    if (times === undefined) {
      while (true) {
        yield value;
      }
    } else {
      for (let i = 0; i < times; i++) {
        yield value;
      }
    }
  })();
}

// Interleaving operations
/**
 * Alternates elements from multiple iterables in a round-robin fashion.
 * Continues until all iterables are exhausted.
 *
 * @template T The type of elements in all iterables
 * @param iterables - Variable number of iterables to interleave
 * @returns An iterable iterator with elements from all iterables interleaved
 * @example
 * ```typescript
 * Array.from(interleave([1, 2, 3], [4, 5, 6]));
 * // [1, 4, 2, 5, 3, 6]
 * Array.from(interleave([1, 2], [3, 4, 5], [6]));
 * // [1, 3, 6, 2, 4, 5]
 * ```
 */
export function interleave<T>(
  ...iterables: Iterable<T>[]
): IterableIterator<T> {
  return (function* (): IterableIterator<T> {
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
  })();
}

/**
 * Merges multiple sorted iterables into a single sorted iterator.
 * Assumes input iterables are already sorted in ascending order.
 * Uses a custom comparator if provided, otherwise uses default < comparison.
 *
 * @template T The type of elements in all iterables
 * @param iterables - Variable number of sorted iterables to merge
 * @returns An iterable iterator with all elements merged in sorted order
 * @example
 * ```typescript
 * Array.from(merge([1, 3, 5], [2, 4, 6]));
 * // [1, 2, 3, 4, 5, 6]
 * Array.from(merge([1, 5, 9], [2, 6, 10], [3, 7, 11]));
 * // [1, 2, 3, 5, 6, 7, 9, 10, 11]
 * ```
 */
export function merge<T>(...iterables: Iterable<T>[]): IterableIterator<T>;
export function merge<T>(
  compareFn: (a: T, b: T) => number,
  ...iterables: Iterable<T>[]
): IterableIterator<T>;
export function merge<T>(
  ...args: (Iterable<T> | ((a: T, b: T) => number))[]
): IterableIterator<T> {
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

  return (function* (): IterableIterator<T> {
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
  })();
}

/**
 * Chains multiple iterables sequentially, one after another.
 * Yields all elements from the first iterable, then all from the second, etc.
 *
 * @template T The type of elements in all iterables
 * @param iterables - Variable number of iterables to chain
 * @returns An iterable iterator with all elements chained sequentially
 * @example
 * ```typescript
 * Array.from(chain([1, 2], [3, 4], [5, 6]));
 * // [1, 2, 3, 4, 5, 6]
 * Array.from(chain([1], [2, 3], [], [4, 5, 6]));
 * // [1, 2, 3, 4, 5, 6]
 * ```
 */
export function chain<T>(...iterables: Iterable<T>[]): IterableIterator<T> {
  return (function* (): IterableIterator<T> {
    for (const iterable of iterables) {
      yield* iterable;
    }
  })();
}

// Composition utilities
export {
  pipe,
  compose,
  createOperation,
  // Transducers
  mapTransducer,
  filterTransducer,
  takeTransducer,
  composeTransducers,
  transduce,
  transducerToIterator,
  reduced,
  isReduced,
  // Types
  type IterableTransformer,
  type TerminalOperation,
  type Transducer,
  type Reducer,
} from "./composition.js";
