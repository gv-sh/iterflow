import { validateRange, validatePositiveInteger } from "./validation.js";

/**
 * A fluent interface wrapper for working with iterators and iterables.
 * Provides chainable methods for transforming, filtering, and analyzing data streams.
 *
 * @template T The type of elements in the iterator
 * @example
 * ```typescript
 * const result = new IterFlow([1, 2, 3, 4, 5])
 *   .filter(x => x % 2 === 0)
 *   .map(x => x * 2)
 *   .toArray(); // [4, 8]
 * ```
 */
export class IterFlow<T> implements Iterable<T> {
  private source: Iterator<T>;

  /**
   * Creates a new iterflow instance from an iterable or iterator.
   *
   * @param source - The source iterable or iterator to wrap
   * @example
   * ```typescript
   * const flow1 = new IterFlow([1, 2, 3]);
   * const flow2 = new IterFlow(someIterator);
   * ```
   */
  constructor(source: Iterable<T> | Iterator<T>) {
    this.source =
      Symbol.iterator in source ? source[Symbol.iterator]() : source;
  }

  // Iterator protocol
  /**
   * Returns the iterator for this iterflow instance.
   * This allows iterflow to be used in for...of loops.
   *
   * @returns The underlying iterator
   */
  [Symbol.iterator](): Iterator<T> {
    return this.source;
  }

  /**
   * Retrieves the next value from the iterator.
   *
   * @returns An IteratorResult containing the next value or indicating completion
   */
  next(): IteratorResult<T> {
    return this.source.next();
  }

  // ES2025 native passthrough methods (would normally delegate to native implementations)
  /**
   * Transforms each element using the provided function.
   *
   * @template U The type of the transformed elements
   * @param fn - Function to transform each element
   * @returns A new iterflow with transformed elements
   * @example
   * ```typescript
   * iter([1, 2, 3]).map(x => x * 2).toArray(); // [2, 4, 6]
   * ```
   */
  map<U>(fn: (value: T) => U): IterFlow<U> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        for (const value of self) {
          yield fn(value);
        }
      },
    });
  }

  /**
   * Filters elements based on a predicate function.
   * Only elements for which the predicate returns true are included.
   *
   * @param predicate - Function to test each element
   * @returns A new iterflow with only elements that pass the predicate
   * @example
   * ```typescript
   * iter([1, 2, 3, 4]).filter(x => x % 2 === 0).toArray(); // [2, 4]
   * ```
   */
  filter(predicate: (value: T) => boolean): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        for (const value of self) {
          if (predicate(value)) {
            yield value;
          }
        }
      },
    });
  }

  /**
   * Takes only the first `limit` elements from the iterator.
   *
   * @param limit - Maximum number of elements to take
   * @returns A new iterflow with at most `limit` elements
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).take(3).toArray(); // [1, 2, 3]
   * ```
   */
  take(limit: number): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        let count = 0;
        for (const value of self) {
          if (count >= limit) break;
          yield value;
          count++;
        }
      },
    });
  }

  /**
   * Skips the first `count` elements from the iterator.
   *
   * @param count - Number of elements to skip
   * @returns A new iterflow without the first `count` elements
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).drop(2).toArray(); // [3, 4, 5]
   * ```
   */
  drop(count: number): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        let dropped = 0;
        for (const value of self) {
          if (dropped < count) {
            dropped++;
            continue;
          }
          yield value;
        }
      },
    });
  }

  /**
   * Maps each element to an iterable and flattens the results into a single iterator.
   *
   * @template U The type of elements in the resulting iterator
   * @param fn - Function that maps each element to an iterable
   * @returns A new iterflow with all mapped iterables flattened
   * @example
   * ```typescript
   * iter([1, 2, 3]).flatMap(x => [x, x * 2]).toArray(); // [1, 2, 2, 4, 3, 6]
   * ```
   */
  flatMap<U>(fn: (value: T) => Iterable<U>): IterFlow<U> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        for (const value of self) {
          yield* fn(value);
        }
      },
    });
  }

  /**
   * Concatenates multiple iterators sequentially.
   * Yields all elements from this iterator, then from each provided iterator.
   *
   * @param iterables - Additional iterables to concatenate
   * @returns A new iterflow with all elements from all iterables
   * @example
   * ```typescript
   * iter([1, 2]).concat([3, 4], [5, 6]).toArray();
   * // [1, 2, 3, 4, 5, 6]
   * ```
   */
  concat(...iterables: Iterable<T>[]): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        yield* self;
        for (const iterable of iterables) {
          yield* iterable;
        }
      },
    });
  }

  /**
   * Inserts a separator element between each item.
   * The separator is not added before the first element or after the last.
   *
   * @param separator - The element to insert between items
   * @returns A new iterflow with separators interspersed
   * @example
   * ```typescript
   * iter([1, 2, 3]).intersperse(0).toArray();
   * // [1, 0, 2, 0, 3]
   * iter(['a', 'b', 'c']).intersperse('-').toArray();
   * // ['a', '-', 'b', '-', 'c']
   * ```
   */
  intersperse(separator: T): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        let isFirst = true;
        for (const value of self) {
          if (!isFirst) {
            yield separator;
          }
          yield value;
          isFirst = false;
        }
      },
    });
  }

  /**
   * Like reduce, but emits all intermediate accumulator values.
   * Similar to reduce but returns an iterator of partial results.
   *
   * @template U The type of the accumulated value
   * @param fn - Function to combine the accumulator with each element
   * @param initial - The initial value for the accumulator
   * @returns A new iterflow of intermediate accumulator values
   * @example
   * ```typescript
   * iter([1, 2, 3, 4]).scan((acc, x) => acc + x, 0).toArray();
   * // [0, 1, 3, 6, 10]
   * iter([1, 2, 3]).scan((acc, x) => acc * x, 1).toArray();
   * // [1, 1, 2, 6]
   * ```
   */
  scan<U>(fn: (accumulator: U, value: T) => U, initial: U): IterFlow<U> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        let accumulator = initial;
        yield accumulator;
        for (const value of self) {
          accumulator = fn(accumulator, value);
          yield accumulator;
        }
      },
    });
  }

  /**
   * Adds index as tuple with each element [index, value].
   * Creates tuples pairing each element with its zero-based index.
   *
   * @returns A new iterflow of tuples containing [index, value]
   * @example
   * ```typescript
   * iter(['a', 'b', 'c']).enumerate().toArray();
   * // [[0, 'a'], [1, 'b'], [2, 'c']]
   * ```
   */
  enumerate(): IterFlow<[number, T]> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        let index = 0;
        for (const value of self) {
          yield [index, value];
          index++;
        }
      },
    });
  }

  /**
   * Reverses the iterator order.
   * ⚠️ Warning: This operation buffers all elements in memory and may cause
   * performance issues with large iterables. Consider using only when necessary.
   *
   * @returns A new iterflow with elements in reverse order
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).reverse().toArray();
   * // [5, 4, 3, 2, 1]
   * ```
   */
  reverse(): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        const buffer = Array.from(self);
        for (let i = buffer.length - 1; i >= 0; i--) {
          yield buffer[i]!;
        }
      },
    });
  }

  /**
   * Sorts elements using default comparison.
   * Numbers are sorted numerically, strings lexicographically.
   * ⚠️ Warning: This operation buffers all elements in memory. Avoid chaining
   * with other buffering operations (reverse, sort, sortBy) for better performance.
   *
   * @param this - iterflow instance constrained to numbers or strings
   * @returns A new iterflow with elements sorted
   * @example
   * ```typescript
   * iter([3, 1, 4, 1, 5]).sort().toArray();
   * // [1, 1, 3, 4, 5]
   * iter(['c', 'a', 'b']).sort().toArray();
   * // ['a', 'b', 'c']
   * ```
   */
  sort(this: IterFlow<number | string>): IterFlow<number | string> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        const buffer = Array.from(self);
        buffer.sort((a, b) => {
          if (typeof a === "number" && typeof b === "number") {
            return a - b;
          }
          return String(a).localeCompare(String(b));
        });
        yield* buffer;
      },
    });
  }

  /**
   * Sorts elements using a custom comparison function.
   * ⚠️ Warning: This operation buffers all elements in memory. Avoid chaining
   * with other buffering operations (reverse, sort, sortBy) for better performance.
   *
   * @param compareFn - Function that compares two elements (returns negative if a < b, 0 if equal, positive if a > b)
   * @returns A new iterflow with elements sorted
   * @example
   * ```typescript
   * iter([3, 1, 4, 1, 5]).sortBy((a, b) => a - b).toArray();
   * // [1, 1, 3, 4, 5]
   * iter([3, 1, 4, 1, 5]).sortBy((a, b) => b - a).toArray();
   * // [5, 4, 3, 1, 1]
   * iter(['alice', 'bob', 'charlie']).sortBy((a, b) => a.length - b.length).toArray();
   * // ['bob', 'alice', 'charlie']
   * ```
   */
  sortBy(compareFn: (a: T, b: T) => number): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        const buffer = Array.from(self);
        buffer.sort(compareFn);
        yield* buffer;
      },
    });
  }

  // Terminal operations (consume the iterator)
  /**
   * Collects all elements into an array.
   * This is a terminal operation that consumes the iterator.
   *
   * @returns An array containing all elements
   * @example
   * ```typescript
   * iter([1, 2, 3]).map(x => x * 2).toArray(); // [2, 4, 6]
   * ```
   */
  toArray(): T[] {
    return Array.from(this);
  }

  /**
   * Counts the total number of elements in the iterator.
   * This is a terminal operation that consumes the iterator.
   *
   * @returns The total count of elements
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).count(); // 5
   * ```
   */
  count(): number {
    let count = 0;
    for (const _ of this) {
      count++;
    }
    return count;
  }

  // Statistical operations - type-constrained to numbers
  /**
   * Calculates the sum of all numeric elements.
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @returns The sum of all elements
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).sum(); // 15
   * ```
   */
  sum(this: IterFlow<number>): number {
    let total = 0;
    for (const value of this) {
      total += value;
    }
    return total;
  }

  /**
   * Calculates the arithmetic mean (average) of all numeric elements.
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @returns The mean value, or undefined if the iterator is empty
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).mean(); // 3
   * iter([]).mean(); // undefined
   * ```
   */
  mean(this: IterFlow<number>): number | undefined {
    let total = 0;
    let count = 0;
    for (const value of this) {
      total += value;
      count++;
    }
    return count === 0 ? undefined : total / count;
  }

  /**
   * Finds the minimum value among all numeric elements.
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @returns The minimum value, or undefined if the iterator is empty
   * @example
   * ```typescript
   * iter([3, 1, 4, 1, 5]).min(); // 1
   * iter([]).min(); // undefined
   * ```
   */
  min(this: IterFlow<number>): number | undefined {
    let minimum: number | undefined = undefined;
    for (const value of this) {
      if (minimum === undefined || value < minimum) {
        minimum = value;
      }
    }
    return minimum;
  }

  /**
   * Finds the maximum value among all numeric elements.
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @returns The maximum value, or undefined if the iterator is empty
   * @example
   * ```typescript
   * iter([3, 1, 4, 1, 5]).max(); // 5
   * iter([]).max(); // undefined
   * ```
   */
  max(this: IterFlow<number>): number | undefined {
    let maximum: number | undefined = undefined;
    for (const value of this) {
      if (maximum === undefined || value > maximum) {
        maximum = value;
      }
    }
    return maximum;
  }

  /**
   * Calculates the median value of all numeric elements.
   * The median is the middle value when elements are sorted.
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @returns The median value, or undefined if the iterator is empty
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).median(); // 3
   * iter([1, 2, 3, 4]).median(); // 2.5
   * iter([]).median(); // undefined
   * ```
   */
  median(this: IterFlow<number>): number | undefined {
    const values = this.toArray();
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
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @returns The variance, or undefined if the iterator is empty
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).variance(); // 2
   * iter([]).variance(); // undefined
   * ```
   */
  variance(this: IterFlow<number>): number | undefined {
    const values = this.toArray();
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
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @returns The standard deviation, or undefined if the iterator is empty
   * @example
   * ```typescript
   * iter([2, 4, 4, 4, 5, 5, 7, 9]).stdDev(); // ~2
   * iter([]).stdDev(); // undefined
   * ```
   */
  stdDev(this: IterFlow<number>): number | undefined {
    const variance = this.variance();
    return variance === undefined ? undefined : Math.sqrt(variance);
  }

  /**
   * Calculates the specified percentile of all numeric elements.
   * Uses linear interpolation between closest ranks.
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @param p - The percentile to calculate (0-100)
   * @returns The percentile value, or undefined if the iterator is empty
   * @throws {Error} If p is not between 0 and 100
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).percentile(50); // 3 (median)
   * iter([1, 2, 3, 4, 5]).percentile(75); // 4
   * iter([]).percentile(50); // undefined
   * ```
   */
  percentile(this: IterFlow<number>, p: number): number | undefined {
    validateRange(p, 0, 100, "percentile", "percentile");

    const values = this.toArray();
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
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @returns An array of the most frequent value(s), or undefined if the iterator is empty
   * @example
   * ```typescript
   * iter([1, 2, 2, 3, 3, 3]).mode(); // [3]
   * iter([1, 1, 2, 2, 3]).mode(); // [1, 2] (bimodal)
   * iter([]).mode(); // undefined
   * ```
   */
  mode(this: IterFlow<number>): number[] | undefined {
    const values = this.toArray();
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
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @returns An object with Q1, Q2, and Q3 values, or undefined if the iterator is empty
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5, 6, 7, 8, 9]).quartiles();
   * // { Q1: 3, Q2: 5, Q3: 7 }
   * iter([]).quartiles(); // undefined
   * ```
   */
  quartiles(
    this: IterFlow<number>,
  ): { Q1: number; Q2: number; Q3: number } | undefined {
    const values = this.toArray();
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
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @returns The span (max - min), or undefined if the iterator is empty
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).span(); // 4
   * iter([10]).span(); // 0
   * iter([]).span(); // undefined
   * ```
   */
  span(this: IterFlow<number>): number | undefined {
    let minimum: number | undefined = undefined;
    let maximum: number | undefined = undefined;

    for (const value of this) {
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
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @returns The product of all elements, or 1 if the iterator is empty
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).product(); // 120
   * iter([2, 3, 4]).product(); // 24
   * iter([]).product(); // 1
   * ```
   */
  product(this: IterFlow<number>): number {
    let result = 1;
    for (const value of this) {
      result *= value;
    }
    return result;
  }

  /**
   * Calculates the covariance between two numeric sequences.
   * Covariance measures the joint variability of two random variables.
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @param other - An iterable of numbers to compare with
   * @returns The covariance, or undefined if either sequence is empty or sequences have different lengths
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).covariance([2, 4, 6, 8, 10]); // 4
   * iter([]).covariance([1, 2, 3]); // undefined
   * ```
   */
  covariance(
    this: IterFlow<number>,
    other: Iterable<number>,
  ): number | undefined {
    const values1 = this.toArray();
    const values2 = Array.from(other);

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
   * This method is only available when T is number.
   * This is a terminal operation that consumes the iterator.
   *
   * @param this - iterflow instance constrained to numbers
   * @param other - An iterable of numbers to compare with
   * @returns The correlation coefficient, or undefined if either sequence is empty or sequences have different lengths
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).correlation([2, 4, 6, 8, 10]); // 1 (perfect positive correlation)
   * iter([1, 2, 3]).correlation([3, 2, 1]); // -1 (perfect negative correlation)
   * iter([]).correlation([1, 2, 3]); // undefined
   * ```
   */
  correlation(
    this: IterFlow<number>,
    other: Iterable<number>,
  ): number | undefined {
    const values1 = this.toArray();
    const values2 = Array.from(other);

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

  // Windowing operations
  /**
   * Creates a sliding window of the specified size over the elements.
   * Each window contains `size` consecutive elements.
   *
   * @param size - The size of each window (must be at least 1)
   * @returns A new iterflow of arrays, each containing `size` consecutive elements
   * @throws {Error} If size is less than 1
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).window(3).toArray();
   * // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
   * ```
   */
  window(size: number): IterFlow<T[]> {
    validatePositiveInteger(size, "size", "window");

    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        // Use circular buffer to avoid O(n) shift() operations
        const buffer: T[] = new Array(size);
        let count = 0;
        let index = 0;

        for (const value of self) {
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
      },
    });
  }

  /**
   * Splits elements into chunks of the specified size.
   * Unlike window, chunks don't overlap. The last chunk may be smaller.
   *
   * @param size - The size of each chunk (must be at least 1)
   * @returns A new iterflow of arrays, each containing up to `size` elements
   * @throws {Error} If size is less than 1
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).chunk(2).toArray();
   * // [[1, 2], [3, 4], [5]]
   * ```
   */
  chunk(size: number): IterFlow<T[]> {
    validatePositiveInteger(size, "size", "chunk");

    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        // Preallocate buffer to avoid dynamic resizing
        let buffer: T[] = new Array(size);
        let bufferIndex = 0;

        for (const value of self) {
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
      },
    });
  }

  /**
   * Creates pairs of consecutive elements.
   * Equivalent to window(2) but returns tuples instead of arrays.
   *
   * @returns A new iterflow of tuples, each containing two consecutive elements
   * @example
   * ```typescript
   * iter([1, 2, 3, 4]).pairwise().toArray();
   * // [[1, 2], [2, 3], [3, 4]]
   * ```
   */
  pairwise(): IterFlow<[T, T]> {
    return this.window(2).map((arr) => [arr[0]!, arr[1]!] as [T, T]);
  }

  // Set operations
  /**
   * Removes duplicate elements, keeping only the first occurrence of each.
   * Uses strict equality (===) to compare elements.
   *
   * @returns A new iterflow with duplicate elements removed
   * @example
   * ```typescript
   * iter([1, 2, 2, 3, 1, 4]).distinct().toArray();
   * // [1, 2, 3, 4]
   * ```
   */
  distinct(): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        const seen = new Set<T>();

        for (const value of self) {
          if (!seen.has(value)) {
            seen.add(value);
            yield value;
          }
        }
      },
    });
  }

  /**
   * Removes duplicate elements based on a key function.
   * Keeps only the first occurrence of each unique key.
   *
   * @template K The type of the key used for comparison
   * @param keyFn - Function to extract the comparison key from each element
   * @returns A new iterflow with duplicate elements (by key) removed
   * @example
   * ```typescript
   * const users = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Charlie'}];
   * iter(users).distinctBy(u => u.id).toArray();
   * // [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}]
   * ```
   */
  distinctBy<K>(keyFn: (value: T) => K): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        const seenKeys = new Set<K>();

        for (const value of self) {
          const key = keyFn(value);
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            yield value;
          }
        }
      },
    });
  }

  // Utility operations
  /**
   * Executes a side-effect function on each element without modifying the stream.
   * Useful for debugging or performing operations like logging.
   *
   * @param fn - Function to execute for each element
   * @returns A new iterflow with the same elements
   * @example
   * ```typescript
   * iter([1, 2, 3])
   *   .tap(x => console.log('Processing:', x))
   *   .map(x => x * 2)
   *   .toArray(); // logs each value, returns [2, 4, 6]
   * ```
   */
  tap(fn: (value: T) => void): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        for (const value of self) {
          fn(value);
          yield value;
        }
      },
    });
  }

  /**
   * Takes elements while the predicate returns true, then stops.
   * Stops at the first element that fails the predicate.
   *
   * @param predicate - Function to test each element
   * @returns A new iterflow with elements up to the first failing predicate
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 1, 2]).takeWhile(x => x < 4).toArray();
   * // [1, 2, 3]
   * ```
   */
  takeWhile(predicate: (value: T) => boolean): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        for (const value of self) {
          if (!predicate(value)) break;
          yield value;
        }
      },
    });
  }

  /**
   * Skips elements while the predicate returns true, then yields all remaining elements.
   * Starts yielding from the first element that fails the predicate.
   *
   * @param predicate - Function to test each element
   * @returns A new iterflow starting from the first element that fails the predicate
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 1, 2]).dropWhile(x => x < 3).toArray();
   * // [3, 4, 1, 2]
   * ```
   */
  dropWhile(predicate: (value: T) => boolean): IterFlow<T> {
    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        let dropping = true;
        for (const value of self) {
          if (dropping && predicate(value)) {
            continue;
          }
          dropping = false;
          yield value;
        }
      },
    });
  }

  // Grouping operations (terminal)
  /**
   * Splits elements into two arrays based on a predicate.
   * This is a terminal operation that consumes the iterator.
   *
   * @param predicate - Function to test each element
   * @returns A tuple of two arrays: [elements passing predicate, elements failing predicate]
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).partition(x => x % 2 === 0);
   * // [[2, 4], [1, 3, 5]]
   * ```
   */
  partition(predicate: (value: T) => boolean): [T[], T[]] {
    const truthy: T[] = [];
    const falsy: T[] = [];

    for (const value of this) {
      if (predicate(value)) {
        truthy.push(value);
      } else {
        falsy.push(value);
      }
    }

    return [truthy, falsy];
  }

  /**
   * Groups elements by a key function into a Map.
   * This is a terminal operation that consumes the iterator.
   *
   * @template K The type of the grouping key
   * @param keyFn - Function to extract the grouping key from each element
   * @returns A Map where keys are the result of keyFn and values are arrays of elements
   * @example
   * ```typescript
   * iter(['alice', 'bob', 'charlie', 'dave'])
   *   .groupBy(name => name.length);
   * // Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'], 4 => ['dave'] }
   * ```
   */
  groupBy<K>(keyFn: (value: T) => K): Map<K, T[]> {
    const groups = new Map<K, T[]>();

    for (const value of this) {
      const key = keyFn(value);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(value);
    }

    return groups;
  }

  // Additional terminal operations
  /**
   * Reduces the iterator to a single value using an accumulator function.
   * This is a terminal operation that consumes the iterator.
   *
   * @template U The type of the accumulated value
   * @param fn - Function to combine the accumulator with each element
   * @param initial - The initial value for the accumulator
   * @returns The final accumulated value
   * @example
   * ```typescript
   * iter([1, 2, 3, 4]).reduce((acc, x) => acc + x, 0); // 10
   * iter(['a', 'b', 'c']).reduce((acc, x) => acc + x, ''); // 'abc'
   * ```
   */
  reduce<U>(fn: (accumulator: U, value: T) => U, initial: U): U {
    let accumulator = initial;
    for (const value of this) {
      accumulator = fn(accumulator, value);
    }
    return accumulator;
  }

  /**
   * Finds the first element that matches the predicate.
   * This is a terminal operation that may consume part of the iterator.
   *
   * @param predicate - Function to test each element
   * @returns The first matching element, or undefined if none found
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).find(x => x > 3); // 4
   * iter([1, 2, 3]).find(x => x > 10); // undefined
   * ```
   */
  find(predicate: (value: T) => boolean): T | undefined {
    for (const value of this) {
      if (predicate(value)) {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Finds the index of the first element that matches the predicate.
   * This is a terminal operation that may consume part of the iterator.
   *
   * @param predicate - Function to test each element
   * @returns The index of the first matching element, or -1 if none found
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).findIndex(x => x > 3); // 3
   * iter([1, 2, 3]).findIndex(x => x > 10); // -1
   * ```
   */
  findIndex(predicate: (value: T) => boolean): number {
    let index = 0;
    for (const value of this) {
      if (predicate(value)) {
        return index;
      }
      index++;
    }
    return -1;
  }

  /**
   * Tests whether at least one element matches the predicate.
   * This is a terminal operation that may consume part of the iterator.
   *
   * @param predicate - Function to test each element
   * @returns true if any element matches, false otherwise
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).some(x => x > 3); // true
   * iter([1, 2, 3]).some(x => x > 10); // false
   * ```
   */
  some(predicate: (value: T) => boolean): boolean {
    for (const value of this) {
      if (predicate(value)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Tests whether all elements match the predicate.
   * This is a terminal operation that may consume part or all of the iterator.
   *
   * @param predicate - Function to test each element
   * @returns true if all elements match, false otherwise
   * @example
   * ```typescript
   * iter([2, 4, 6]).every(x => x % 2 === 0); // true
   * iter([1, 2, 3]).every(x => x % 2 === 0); // false
   * ```
   */
  every(predicate: (value: T) => boolean): boolean {
    for (const value of this) {
      if (!predicate(value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Executes a function for each element in the iterator.
   * This is a terminal operation that consumes the entire iterator.
   *
   * @param fn - Function to execute for each element
   * @example
   * ```typescript
   * iter([1, 2, 3]).forEach(x => console.log(x));
   * // Logs: 1, 2, 3
   * ```
   */
  forEach(fn: (value: T) => void): void {
    for (const value of this) {
      fn(value);
    }
  }

  /**
   * Gets the first element from the iterator.
   * This is a terminal operation that consumes the first element.
   *
   * @param defaultValue - Optional default value to return if iterator is empty
   * @returns The first element, the default value, or undefined if empty and no default
   * @example
   * ```typescript
   * iter([1, 2, 3]).first(); // 1
   * iter([]).first(); // undefined
   * iter([]).first(0); // 0
   * ```
   */
  first(defaultValue?: T): T | undefined {
    const result = this.source.next();
    return result.done ? defaultValue : result.value;
  }

  /**
   * Gets the last element from the iterator.
   * This is a terminal operation that consumes the entire iterator.
   *
   * @param defaultValue - Optional default value to return if iterator is empty
   * @returns The last element, the default value, or undefined if empty and no default
   * @example
   * ```typescript
   * iter([1, 2, 3]).last(); // 3
   * iter([]).last(); // undefined
   * iter([]).last(0); // 0
   * ```
   */
  last(defaultValue?: T): T | undefined {
    let lastValue: T | undefined = defaultValue;
    let hasValue = false;
    for (const value of this) {
      lastValue = value;
      hasValue = true;
    }
    return hasValue ? lastValue : defaultValue;
  }

  /**
   * Gets the element at the specified index.
   * This is a terminal operation that may consume part of the iterator.
   *
   * @param index - Zero-based index of the element to retrieve
   * @returns The element at the index, or undefined if index is out of bounds
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).nth(2); // 3
   * iter([1, 2, 3]).nth(10); // undefined
   * iter([1, 2, 3]).nth(-1); // undefined
   * ```
   */
  nth(index: number): T | undefined {
    if (index < 0) {
      return undefined;
    }
    let currentIndex = 0;
    for (const value of this) {
      if (currentIndex === index) {
        return value;
      }
      currentIndex++;
    }
    return undefined;
  }

  /**
   * Checks if the iterator is empty.
   * This is a terminal operation that may consume the first element.
   *
   * @returns true if the iterator has no elements, false otherwise
   * @example
   * ```typescript
   * iter([]).isEmpty(); // true
   * iter([1, 2, 3]).isEmpty(); // false
   * ```
   */
  isEmpty(): boolean {
    const result = this.source.next();
    return result.done === true;
  }

  /**
   * Checks if the iterator includes a specific value.
   * Uses strict equality (===) for comparison.
   * This is a terminal operation that may consume part or all of the iterator.
   *
   * @param searchValue - The value to search for
   * @returns true if the value is found, false otherwise
   * @example
   * ```typescript
   * iter([1, 2, 3, 4, 5]).includes(3); // true
   * iter([1, 2, 3]).includes(10); // false
   * iter(['a', 'b', 'c']).includes('b'); // true
   * ```
   */
  includes(searchValue: T): boolean {
    for (const value of this) {
      if (value === searchValue) {
        return true;
      }
    }
    return false;
  }
}
