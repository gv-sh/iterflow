/**
 * A fluent interface wrapper for working with async iterators and async iterables.
 * Provides chainable methods for transforming, filtering, and analyzing async data streams.
 *
 * @template T The type of elements in the async iterator
 * @example
 * ```typescript
 * const result = await new AsyncIterflow(asyncIterable)
 *   .filter(async x => x % 2 === 0)
 *   .map(async x => x * 2)
 *   .toArray(); // [4, 8]
 * ```
 */
export class AsyncIterflow<T> implements AsyncIterable<T> {
  private source: AsyncIterator<T>;

  /**
   * Creates a new async iterflow instance from an async iterable or async iterator.
   *
   * @param source - The source async iterable or async iterator to wrap
   * @example
   * ```typescript
   * const flow1 = new AsyncIterflow(asyncIterable);
   * const flow2 = new AsyncIterflow(asyncIterator);
   * ```
   */
  constructor(source: AsyncIterable<T> | AsyncIterator<T>) {
    this.source =
      Symbol.asyncIterator in source ? source[Symbol.asyncIterator]() : source;
  }

  // Async Iterator protocol
  /**
   * Returns the async iterator for this iterflow instance.
   * This allows iterflow to be used in for await...of loops.
   *
   * @returns The underlying async iterator
   */
  [Symbol.asyncIterator](): AsyncIterator<T> {
    return this.source;
  }

  /**
   * Retrieves the next value from the async iterator.
   *
   * @returns A promise of an IteratorResult containing the next value or indicating completion
   */
  next(): Promise<IteratorResult<T>> {
    return this.source.next();
  }

  // Transformation operations
  /**
   * Transforms each element using the provided async or sync function.
   *
   * @template U The type of the transformed elements
   * @param fn - Async or sync function to transform each element
   * @returns A new async iterflow with transformed elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3]).map(async x => x * 2).toArray(); // [2, 4, 6]
   * ```
   */
  map<U>(fn: (value: T) => U | Promise<U>): AsyncIterflow<U> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        for await (const value of self) {
          yield await fn(value);
        }
      },
    });
  }

  /**
   * Filters elements based on an async or sync predicate function.
   * Only elements for which the predicate returns true are included.
   *
   * @param predicate - Async or sync function to test each element
   * @returns A new async iterflow with only elements that pass the predicate
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4]).filter(async x => x % 2 === 0).toArray(); // [2, 4]
   * ```
   */
  filter(
    predicate: (value: T) => boolean | Promise<boolean>,
  ): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        for await (const value of self) {
          if (await predicate(value)) {
            yield value;
          }
        }
      },
    });
  }

  /**
   * Takes only the first `limit` elements from the async iterator.
   *
   * @param limit - Maximum number of elements to take
   * @returns A new async iterflow with at most `limit` elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).take(3).toArray(); // [1, 2, 3]
   * ```
   */
  take(limit: number): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        let count = 0;
        for await (const value of self) {
          if (count >= limit) break;
          yield value;
          count++;
        }
      },
    });
  }

  /**
   * Skips the first `count` elements from the async iterator.
   *
   * @param count - Number of elements to skip
   * @returns A new async iterflow without the first `count` elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).drop(2).toArray(); // [3, 4, 5]
   * ```
   */
  drop(count: number): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        let dropped = 0;
        for await (const value of self) {
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
   * Maps each element to an async iterable and flattens the results.
   *
   * @template U The type of elements in the resulting iterator
   * @param fn - Async or sync function that maps each element to an async iterable
   * @returns A new async iterflow with all mapped iterables flattened
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3]).flatMap(async x => [x, x * 2]).toArray(); // [1, 2, 2, 4, 3, 6]
   * ```
   */
  flatMap<U>(
    fn: (
      value: T,
    ) =>
      | AsyncIterable<U>
      | Iterable<U>
      | Promise<AsyncIterable<U> | Iterable<U>>,
  ): AsyncIterflow<U> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        for await (const value of self) {
          const result = await fn(value);
          if (Symbol.asyncIterator in result) {
            yield* result;
          } else {
            yield* result;
          }
        }
      },
    });
  }

  /**
   * Concatenates multiple async iterators sequentially.
   *
   * @param iterables - Additional async iterables to concatenate
   * @returns A new async iterflow with all elements from all iterables
   * @example
   * ```typescript
   * await asyncIter([1, 2]).concat([3, 4], [5, 6]).toArray();
   * // [1, 2, 3, 4, 5, 6]
   * ```
   */
  concat(
    ...iterables: Array<AsyncIterable<T> | Iterable<T>>
  ): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        yield* self;
        for (const iterable of iterables) {
          if (Symbol.asyncIterator in iterable) {
            yield* iterable;
          } else {
            yield* iterable;
          }
        }
      },
    });
  }

  /**
   * Inserts a separator element between each item.
   *
   * @param separator - The element to insert between items
   * @returns A new async iterflow with separators interspersed
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3]).intersperse(0).toArray();
   * // [1, 0, 2, 0, 3]
   * ```
   */
  intersperse(separator: T): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        let isFirst = true;
        for await (const value of self) {
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
   *
   * @template U The type of the accumulated value
   * @param fn - Async or sync function to combine the accumulator with each element
   * @param initial - The initial value for the accumulator
   * @returns A new async iterflow of intermediate accumulator values
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4]).scan((acc, x) => acc + x, 0).toArray();
   * // [0, 1, 3, 6, 10]
   * ```
   */
  scan<U>(
    fn: (accumulator: U, value: T) => U | Promise<U>,
    initial: U,
  ): AsyncIterflow<U> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        let accumulator = initial;
        yield accumulator;
        for await (const value of self) {
          accumulator = await fn(accumulator, value);
          yield accumulator;
        }
      },
    });
  }

  /**
   * Adds index as tuple with each element [index, value].
   *
   * @returns A new async iterflow of tuples containing [index, value]
   * @example
   * ```typescript
   * await asyncIter(['a', 'b', 'c']).enumerate().toArray();
   * // [[0, 'a'], [1, 'b'], [2, 'c']]
   * ```
   */
  enumerate(): AsyncIterflow<[number, T]> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        let index = 0;
        for await (const value of self) {
          yield [index, value];
          index++;
        }
      },
    });
  }

  /**
   * Reverses the async iterator order.
   * ⚠️ Warning: This operation buffers all elements in memory.
   *
   * @returns A new async iterflow with elements in reverse order
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).reverse().toArray();
   * // [5, 4, 3, 2, 1]
   * ```
   */
  reverse(): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const buffer = await self.toArray();
        for (let i = buffer.length - 1; i >= 0; i--) {
          yield buffer[i]!;
        }
      },
    });
  }

  /**
   * Sorts elements using default comparison.
   * ⚠️ Warning: This operation buffers all elements in memory.
   *
   * @param this - async iterflow instance constrained to numbers or strings
   * @returns A new async iterflow with elements sorted
   * @example
   * ```typescript
   * await asyncIter([3, 1, 4, 1, 5]).sort().toArray();
   * // [1, 1, 3, 4, 5]
   * ```
   */
  sort(this: AsyncIterflow<number | string>): AsyncIterflow<number | string> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const buffer = await self.toArray();
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
   * ⚠️ Warning: This operation buffers all elements in memory.
   *
   * @param compareFn - Function that compares two elements
   * @returns A new async iterflow with elements sorted
   * @example
   * ```typescript
   * await asyncIter([3, 1, 4, 1, 5]).sortBy((a, b) => a - b).toArray();
   * // [1, 1, 3, 4, 5]
   * ```
   */
  sortBy(compareFn: (a: T, b: T) => number): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const buffer = await self.toArray();
        buffer.sort(compareFn);
        yield* buffer;
      },
    });
  }

  // Terminal operations
  /**
   * Collects all elements into an array.
   * This is a terminal operation that consumes the async iterator.
   *
   * @returns A promise of an array containing all elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3]).map(async x => x * 2).toArray(); // [2, 4, 6]
   * ```
   */
  async toArray(): Promise<T[]> {
    const result: T[] = [];
    for await (const value of this) {
      result.push(value);
    }
    return result;
  }

  /**
   * Counts the total number of elements in the async iterator.
   * This is a terminal operation that consumes the async iterator.
   *
   * @returns A promise of the total count of elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).count(); // 5
   * ```
   */
  async count(): Promise<number> {
    let count = 0;
    for await (const _ of this) {
      count++;
    }
    return count;
  }

  /**
   * Executes a function for each element.
   * This is a terminal operation that consumes the async iterator.
   *
   * @param fn - Async or sync function to execute for each element
   * @returns A promise that resolves when all elements have been processed
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3]).forEach(async x => console.log(x));
   * ```
   */
  async forEach(fn: (value: T) => void | Promise<void>): Promise<void> {
    for await (const value of this) {
      await fn(value);
    }
  }

  // Statistical operations
  /**
   * Calculates the sum of all numeric elements.
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @returns A promise of the sum of all elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).sum(); // 15
   * ```
   */
  async sum(this: AsyncIterflow<number>): Promise<number> {
    let total = 0;
    for await (const value of this) {
      total += value;
    }
    return total;
  }

  /**
   * Calculates the arithmetic mean (average) of all numeric elements.
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @returns A promise of the mean value, or undefined if empty
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).mean(); // 3
   * ```
   */
  async mean(this: AsyncIterflow<number>): Promise<number | undefined> {
    let total = 0;
    let count = 0;
    for await (const value of this) {
      total += value;
      count++;
    }
    return count === 0 ? undefined : total / count;
  }

  /**
   * Finds the minimum value among all numeric elements.
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @returns A promise of the minimum value, or undefined if empty
   * @example
   * ```typescript
   * await asyncIter([3, 1, 4, 1, 5]).min(); // 1
   * ```
   */
  async min(this: AsyncIterflow<number>): Promise<number | undefined> {
    let minimum: number | undefined = undefined;
    for await (const value of this) {
      if (minimum === undefined || value < minimum) {
        minimum = value;
      }
    }
    return minimum;
  }

  /**
   * Finds the maximum value among all numeric elements.
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @returns A promise of the maximum value, or undefined if empty
   * @example
   * ```typescript
   * await asyncIter([3, 1, 4, 1, 5]).max(); // 5
   * ```
   */
  async max(this: AsyncIterflow<number>): Promise<number | undefined> {
    let maximum: number | undefined = undefined;
    for await (const value of this) {
      if (maximum === undefined || value > maximum) {
        maximum = value;
      }
    }
    return maximum;
  }

  /**
   * Calculates the median value of all numeric elements.
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @returns A promise of the median value, or undefined if empty
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).median(); // 3
   * ```
   */
  async median(this: AsyncIterflow<number>): Promise<number | undefined> {
    const values = await this.toArray();
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
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @returns A promise of the variance, or undefined if empty
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).variance(); // 2
   * ```
   */
  async variance(this: AsyncIterflow<number>): Promise<number | undefined> {
    const values = await this.toArray();
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
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @returns A promise of the standard deviation, or undefined if empty
   * @example
   * ```typescript
   * await asyncIter([2, 4, 4, 4, 5, 5, 7, 9]).stdDev(); // ~2
   * ```
   */
  async stdDev(this: AsyncIterflow<number>): Promise<number | undefined> {
    const variance = await this.variance();
    return variance === undefined ? undefined : Math.sqrt(variance);
  }

  /**
   * Calculates the specified percentile of all numeric elements.
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @param p - The percentile to calculate (0-100)
   * @returns A promise of the percentile value, or undefined if empty
   * @throws {Error} If p is not between 0 and 100
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).percentile(50); // 3
   * ```
   */
  async percentile(
    this: AsyncIterflow<number>,
    p: number,
  ): Promise<number | undefined> {
    validateRange(p, 0, 100, "percentile", "percentile");

    const values = await this.toArray();
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
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @returns A promise of an array of the most frequent value(s), or undefined if empty
   * @example
   * ```typescript
   * await asyncIter([1, 2, 2, 3, 3, 3]).mode(); // [3]
   * ```
   */
  async mode(this: AsyncIterflow<number>): Promise<number[] | undefined> {
    const values = await this.toArray();
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
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @returns A promise of an object with Q1, Q2, and Q3 values, or undefined if empty
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5, 6, 7, 8, 9]).quartiles();
   * // { Q1: 3, Q2: 5, Q3: 7 }
   * ```
   */
  async quartiles(
    this: AsyncIterflow<number>,
  ): Promise<{ Q1: number; Q2: number; Q3: number } | undefined> {
    const values = await this.toArray();
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
   * Calculates the span (range from minimum to maximum value).
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @returns A promise of the span (max - min), or undefined if empty
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).span(); // 4
   * ```
   */
  async span(this: AsyncIterflow<number>): Promise<number | undefined> {
    let minimum: number | undefined = undefined;
    let maximum: number | undefined = undefined;

    for await (const value of this) {
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
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @returns A promise of the product of all elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).product(); // 120
   * ```
   */
  async product(this: AsyncIterflow<number>): Promise<number> {
    let result = 1;
    for await (const value of this) {
      result *= value;
    }
    return result;
  }

  /**
   * Calculates the covariance between two numeric sequences.
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @param other - An async iterable of numbers to compare with
   * @returns A promise of the covariance, or undefined if sequences are empty or have different lengths
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).covariance([2, 4, 6, 8, 10]); // 4
   * ```
   */
  async covariance(
    this: AsyncIterflow<number>,
    other: AsyncIterable<number> | Iterable<number>,
  ): Promise<number | undefined> {
    const values1 = await this.toArray();
    const values2: number[] = [];

    if (Symbol.asyncIterator in other) {
      for await (const value of other) {
        values2.push(value);
      }
    } else {
      for (const value of other) {
        values2.push(value);
      }
    }

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
   * This is a terminal operation that consumes the async iterator.
   *
   * @param this - async iterflow instance constrained to numbers
   * @param other - An async iterable of numbers to compare with
   * @returns A promise of the correlation coefficient, or undefined if sequences are empty or have different lengths
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).correlation([2, 4, 6, 8, 10]); // 1
   * ```
   */
  async correlation(
    this: AsyncIterflow<number>,
    other: AsyncIterable<number> | Iterable<number>,
  ): Promise<number | undefined> {
    const values1 = await this.toArray();
    const values2: number[] = [];

    if (Symbol.asyncIterator in other) {
      for await (const value of other) {
        values2.push(value);
      }
    } else {
      for (const value of other) {
        values2.push(value);
      }
    }

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
   *
   * @param size - The size of each window
   * @returns A new async iterflow of arrays, each containing `size` consecutive elements
   * @throws {Error} If size is less than 1
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).window(3).toArray();
   * // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
   * ```
   */
  window(size: number): AsyncIterflow<T[]> {
    validatePositiveInteger(size, "size", "window");

    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        // Use circular buffer to avoid O(n) shift() operations
        const buffer: T[] = new Array(size);
        let count = 0;
        let index = 0;

        for await (const value of self) {
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
   *
   * @param size - The size of each chunk
   * @returns A new async iterflow of arrays, each containing up to `size` elements
   * @throws {Error} If size is less than 1
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).chunk(2).toArray();
   * // [[1, 2], [3, 4], [5]]
   * ```
   */
  chunk(size: number): AsyncIterflow<T[]> {
    validatePositiveInteger(size, "size", "chunk");

    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        // Preallocate buffer to avoid dynamic resizing
        let buffer: T[] = new Array(size);
        let bufferIndex = 0;

        for await (const value of self) {
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
   *
   * @returns A new async iterflow of tuples, each containing two consecutive elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4]).pairwise().toArray();
   * // [[1, 2], [2, 3], [3, 4]]
   * ```
   */
  pairwise(): AsyncIterflow<[T, T]> {
    return this.window(2).map((arr) => [arr[0]!, arr[1]!] as [T, T]);
  }

  // Set operations
  /**
   * Removes duplicate elements, keeping only the first occurrence.
   *
   * @returns A new async iterflow with duplicate elements removed
   * @example
   * ```typescript
   * await asyncIter([1, 2, 2, 3, 1, 4]).distinct().toArray();
   * // [1, 2, 3, 4]
   * ```
   */
  distinct(): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const seen = new Set<T>();

        for await (const value of self) {
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
   *
   * @template K The type of the key used for comparison
   * @param keyFn - Async or sync function to extract the comparison key
   * @returns A new async iterflow with duplicate elements (by key) removed
   * @example
   * ```typescript
   * const users = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Charlie'}];
   * await asyncIter(users).distinctBy(async u => u.id).toArray();
   * // [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}]
   * ```
   */
  distinctBy<K>(keyFn: (value: T) => K | Promise<K>): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const seenKeys = new Set<K>();

        for await (const value of self) {
          const key = await keyFn(value);
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
   *
   * @param fn - Async or sync function to execute for each element
   * @returns A new async iterflow with the same elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3])
   *   .tap(async x => console.log('Processing:', x))
   *   .map(async x => x * 2)
   *   .toArray(); // logs each value, returns [2, 4, 6]
   * ```
   */
  tap(fn: (value: T) => void | Promise<void>): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        for await (const value of self) {
          await fn(value);
          yield value;
        }
      },
    });
  }

  /**
   * Takes elements while the predicate returns true, then stops.
   *
   * @param predicate - Async or sync function to test each element
   * @returns A new async iterflow with elements up to the first failing predicate
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 1, 2]).takeWhile(async x => x < 4).toArray();
   * // [1, 2, 3]
   * ```
   */
  takeWhile(
    predicate: (value: T) => boolean | Promise<boolean>,
  ): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        for await (const value of self) {
          if (!(await predicate(value))) break;
          yield value;
        }
      },
    });
  }

  /**
   * Skips elements while the predicate returns true, then yields all remaining.
   *
   * @param predicate - Async or sync function to test each element
   * @returns A new async iterflow starting from the first element that fails the predicate
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 1, 2]).dropWhile(async x => x < 3).toArray();
   * // [3, 4, 1, 2]
   * ```
   */
  dropWhile(
    predicate: (value: T) => boolean | Promise<boolean>,
  ): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        let dropping = true;
        for await (const value of self) {
          if (dropping && (await predicate(value))) {
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
   * This is a terminal operation that consumes the async iterator.
   *
   * @param predicate - Async or sync function to test each element
   * @returns A promise of a tuple of two arrays
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).partition(async x => x % 2 === 0);
   * // [[2, 4], [1, 3, 5]]
   * ```
   */
  async partition(
    predicate: (value: T) => boolean | Promise<boolean>,
  ): Promise<[T[], T[]]> {
    const truthy: T[] = [];
    const falsy: T[] = [];

    for await (const value of this) {
      if (await predicate(value)) {
        truthy.push(value);
      } else {
        falsy.push(value);
      }
    }

    return [truthy, falsy];
  }

  /**
   * Groups elements by a key function into a Map.
   * This is a terminal operation that consumes the async iterator.
   *
   * @template K The type of the grouping key
   * @param keyFn - Async or sync function to extract the grouping key
   * @returns A promise of a Map where keys are the result of keyFn and values are arrays of elements
   * @example
   * ```typescript
   * await asyncIter(['alice', 'bob', 'charlie', 'dave'])
   *   .groupBy(async name => name.length);
   * // Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'], 4 => ['dave'] }
   * ```
   */
  async groupBy<K>(keyFn: (value: T) => K | Promise<K>): Promise<Map<K, T[]>> {
    const groups = new Map<K, T[]>();

    for await (const value of this) {
      const key = await keyFn(value);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(value);
    }

    return groups;
  }

  // Additional terminal operations
  /**
   * Reduces the async iterator to a single value using an accumulator function.
   * This is a terminal operation that consumes the async iterator.
   *
   * @template U The type of the accumulated value
   * @param fn - Async or sync function to combine the accumulator with each element
   * @param initial - The initial value for the accumulator
   * @returns A promise of the final accumulated value
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4]).reduce(async (acc, x) => acc + x, 0); // 10
   * ```
   */
  async reduce<U>(
    fn: (accumulator: U, value: T) => U | Promise<U>,
    initial: U,
  ): Promise<U> {
    let accumulator = initial;
    for await (const value of this) {
      accumulator = await fn(accumulator, value);
    }
    return accumulator;
  }

  /**
   * Finds the first element that matches the predicate.
   * This is a terminal operation that may consume part of the async iterator.
   *
   * @param predicate - Async or sync function to test each element
   * @returns A promise of the first matching element, or undefined if none found
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).find(async x => x > 3); // 4
   * ```
   */
  async find(
    predicate: (value: T) => boolean | Promise<boolean>,
  ): Promise<T | undefined> {
    for await (const value of this) {
      if (await predicate(value)) {
        return value;
      }
    }
    return undefined;
  }

  /**
   * Finds the index of the first element that matches the predicate.
   * This is a terminal operation that may consume part of the async iterator.
   *
   * @param predicate - Async or sync function to test each element
   * @returns A promise of the index of the first matching element, or -1 if none found
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).findIndex(async x => x > 3); // 3
   * ```
   */
  async findIndex(
    predicate: (value: T) => boolean | Promise<boolean>,
  ): Promise<number> {
    let index = 0;
    for await (const value of this) {
      if (await predicate(value)) {
        return index;
      }
      index++;
    }
    return -1;
  }

  /**
   * Tests whether at least one element matches the predicate.
   * This is a terminal operation that may consume part of the async iterator.
   *
   * @param predicate - Async or sync function to test each element
   * @returns A promise of true if any element matches, false otherwise
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).some(async x => x > 3); // true
   * ```
   */
  async some(
    predicate: (value: T) => boolean | Promise<boolean>,
  ): Promise<boolean> {
    for await (const value of this) {
      if (await predicate(value)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Tests whether all elements match the predicate.
   * This is a terminal operation that may consume part or all of the async iterator.
   *
   * @param predicate - Async or sync function to test each element
   * @returns A promise of true if all elements match, false otherwise
   * @example
   * ```typescript
   * await asyncIter([2, 4, 6]).every(async x => x % 2 === 0); // true
   * ```
   */
  async every(
    predicate: (value: T) => boolean | Promise<boolean>,
  ): Promise<boolean> {
    for await (const value of this) {
      if (!(await predicate(value))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Gets the first element from the async iterator.
   * This is a terminal operation that consumes the first element.
   *
   * @param defaultValue - Optional default value to return if iterator is empty
   * @returns A promise of the first element, the default value, or undefined if empty and no default
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3]).first(); // 1
   * ```
   */
  async first(defaultValue?: T): Promise<T | undefined> {
    const result = await this.source.next();
    return result.done ? defaultValue : result.value;
  }

  /**
   * Gets the last element from the async iterator.
   * This is a terminal operation that consumes the entire async iterator.
   *
   * @param defaultValue - Optional default value to return if iterator is empty
   * @returns A promise of the last element, the default value, or undefined if empty and no default
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3]).last(); // 3
   * ```
   */
  async last(defaultValue?: T): Promise<T | undefined> {
    let lastValue: T | undefined = defaultValue;
    let hasValue = false;
    for await (const value of this) {
      lastValue = value;
      hasValue = true;
    }
    return hasValue ? lastValue : defaultValue;
  }

  /**
   * Gets the element at the specified index.
   * This is a terminal operation that may consume part of the async iterator.
   *
   * @param index - Zero-based index of the element to retrieve
   * @returns A promise of the element at the index, or undefined if index is out of bounds
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).nth(2); // 3
   * ```
   */
  async nth(index: number): Promise<T | undefined> {
    if (index < 0) {
      return undefined;
    }
    let currentIndex = 0;
    for await (const value of this) {
      if (currentIndex === index) {
        return value;
      }
      currentIndex++;
    }
    return undefined;
  }

  /**
   * Checks if the async iterator is empty.
   * This is a terminal operation that may consume the first element.
   *
   * @returns A promise of true if the iterator has no elements, false otherwise
   * @example
   * ```typescript
   * await asyncIter([]).isEmpty(); // true
   * ```
   */
  async isEmpty(): Promise<boolean> {
    const result = await this.source.next();
    return result.done === true;
  }

  /**
   * Checks if the async iterator includes a specific value.
   * This is a terminal operation that may consume part or all of the async iterator.
   *
   * @param searchValue - The value to search for
   * @returns A promise of true if the value is found, false otherwise
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).includes(3); // true
   * ```
   */
  async includes(searchValue: T): Promise<boolean> {
    for await (const value of this) {
      if (value === searchValue) {
        return true;
      }
    }
    return false;
  }

  // Concurrent/Parallel processing operations
  /**
   * Maps elements in parallel with a concurrency limit.
   * Processes multiple elements simultaneously while respecting the concurrency limit.
   *
   * @template U The type of the transformed elements
   * @param fn - Async function to transform each element
   * @param concurrency - Maximum number of concurrent operations (default: 10)
   * @returns A new async iterflow with transformed elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5])
   *   .mapParallel(async x => {
   *     await sleep(100);
   *     return x * 2;
   *   }, 3)
   *   .toArray(); // Processes 3 items at a time
   * ```
   */
  mapParallel<U>(
    fn: (value: T) => Promise<U>,
    concurrency = 10,
  ): AsyncIterflow<U> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const promises: Array<Promise<{ index: number; value: U }>> = [];
        const results: Map<number, U> = new Map();
        let nextIndex = 0;
        let completedIndex = 0;

        for await (const value of self) {
          const currentIndex = nextIndex++;
          const promise = fn(value).then((result) => ({
            index: currentIndex,
            value: result,
          }));

          promises.push(promise);

          if (promises.length >= concurrency) {
            const completed = await Promise.race(promises);
            results.set(completed.index, completed.value);
            promises.splice(
              promises.findIndex((p) =>
                p.then((r) => r.index === completed.index),
              ),
              1,
            );

            while (results.has(completedIndex)) {
              yield results.get(completedIndex)!;
              results.delete(completedIndex);
              completedIndex++;
            }
          }
        }

        // Process remaining promises
        while (promises.length > 0) {
          const completed = await Promise.race(promises);
          results.set(completed.index, completed.value);
          promises.splice(
            promises.findIndex((p) =>
              p.then((r) => r.index === completed.index),
            ),
            1,
          );

          while (results.has(completedIndex)) {
            yield results.get(completedIndex)!;
            results.delete(completedIndex);
            completedIndex++;
          }
        }
      },
    });
  }

  /**
   * Filters elements in parallel with a concurrency limit.
   *
   * @param predicate - Async function to test each element
   * @param concurrency - Maximum number of concurrent operations (default: 10)
   * @returns A new async iterflow with only elements that pass the predicate
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5])
   *   .filterParallel(async x => {
   *     await sleep(100);
   *     return x % 2 === 0;
   *   }, 3)
   *   .toArray(); // [2, 4]
   * ```
   */
  filterParallel(
    predicate: (value: T) => Promise<boolean>,
    concurrency = 10,
  ): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const promises: Array<
          Promise<{ index: number; value: T; keep: boolean }>
        > = [];
        const results: Map<number, { value: T; keep: boolean }> = new Map();
        let nextIndex = 0;
        let completedIndex = 0;

        for await (const value of self) {
          const currentIndex = nextIndex++;
          const promise = predicate(value).then((keep) => ({
            index: currentIndex,
            value,
            keep,
          }));

          promises.push(promise);

          if (promises.length >= concurrency) {
            const completed = await Promise.race(promises);
            results.set(completed.index, {
              value: completed.value,
              keep: completed.keep,
            });
            promises.splice(
              promises.findIndex((p) =>
                p.then((r) => r.index === completed.index),
              ),
              1,
            );

            while (results.has(completedIndex)) {
              const result = results.get(completedIndex)!;
              if (result.keep) {
                yield result.value;
              }
              results.delete(completedIndex);
              completedIndex++;
            }
          }
        }

        // Process remaining promises
        while (promises.length > 0) {
          const completed = await Promise.race(promises);
          results.set(completed.index, {
            value: completed.value,
            keep: completed.keep,
          });
          promises.splice(
            promises.findIndex((p) =>
              p.then((r) => r.index === completed.index),
            ),
            1,
          );

          while (results.has(completedIndex)) {
            const result = results.get(completedIndex)!;
            if (result.keep) {
              yield result.value;
            }
            results.delete(completedIndex);
            completedIndex++;
          }
        }
      },
    });
  }

  /**
   * FlatMaps elements in parallel with a concurrency limit.
   *
   * @template U The type of elements in the resulting iterator
   * @param fn - Async function that maps each element to an async iterable
   * @param concurrency - Maximum number of concurrent operations (default: 10)
   * @returns A new async iterflow with all mapped iterables flattened
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3])
   *   .flatMapParallel(async x => [x, x * 2], 2)
   *   .toArray(); // [1, 2, 2, 4, 3, 6]
   * ```
   */
  flatMapParallel<U>(
    fn: (value: T) => Promise<AsyncIterable<U> | Iterable<U>>,
    concurrency = 10,
  ): AsyncIterflow<U> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const promises: Array<
          Promise<{ index: number; values: AsyncIterable<U> | Iterable<U> }>
        > = [];
        const results: Map<number, AsyncIterable<U> | Iterable<U>> = new Map();
        let nextIndex = 0;
        let completedIndex = 0;

        for await (const value of self) {
          const currentIndex = nextIndex++;
          const promise = fn(value).then((values) => ({
            index: currentIndex,
            values,
          }));

          promises.push(promise);

          if (promises.length >= concurrency) {
            const completed = await Promise.race(promises);
            results.set(completed.index, completed.values);
            promises.splice(
              promises.findIndex((p) =>
                p.then((r) => r.index === completed.index),
              ),
              1,
            );

            while (results.has(completedIndex)) {
              const result = results.get(completedIndex)!;
              if (Symbol.asyncIterator in result) {
                yield* result;
              } else {
                yield* result;
              }
              results.delete(completedIndex);
              completedIndex++;
            }
          }
        }

        // Process remaining promises
        while (promises.length > 0) {
          const completed = await Promise.race(promises);
          results.set(completed.index, completed.values);
          promises.splice(
            promises.findIndex((p) =>
              p.then((r) => r.index === completed.index),
            ),
            1,
          );

          while (results.has(completedIndex)) {
            const result = results.get(completedIndex)!;
            if (Symbol.asyncIterator in result) {
              yield* result;
            } else {
              yield* result;
            }
            results.delete(completedIndex);
            completedIndex++;
          }
        }
      },
    });
  }

  // Backpressure handling
  /**
   * Buffers elements up to a specified size.
   *
   * @param size - Maximum buffer size
   * @returns A new async iterflow with buffered elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).buffer(2).toArray();
   * // [[1, 2], [3, 4], [5]]
   * ```
   */
  buffer(size: number): AsyncIterflow<T[]> {
    return this.chunk(size);
  }

  /**
   * Throttles the stream to emit at most one value per time interval.
   *
   * @param intervalMs - Minimum time between emissions in milliseconds
   * @returns A new async iterflow with throttled elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).throttle(100).toArray();
   * // Emits one value every 100ms
   * ```
   */
  throttle(intervalMs: number): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        let lastEmitTime = 0;

        for await (const value of self) {
          const now = Date.now();
          const timeSinceLastEmit = now - lastEmitTime;

          if (timeSinceLastEmit < intervalMs) {
            await new Promise((resolve) =>
              setTimeout(resolve, intervalMs - timeSinceLastEmit),
            );
          }

          lastEmitTime = Date.now();
          yield value;
        }
      },
    });
  }

  /**
   * Debounces the stream, only emitting values after a period of silence.
   *
   * @param waitMs - Time to wait for silence in milliseconds
   * @returns A new async iterflow with debounced elements
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3, 4, 5]).debounce(100).toArray();
   * // Only emits values after 100ms of no new values
   * ```
   */
  debounce(waitMs: number): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const buffer: T[] = [];
        let lastValue: T | undefined;
        let hasValue = false;

        for await (const value of self) {
          hasValue = true;
          lastValue = value;
          buffer.push(value);

          // Wait for the debounce period
          await new Promise((resolve) => setTimeout(resolve, waitMs));

          // If this is still the last value after waiting, emit it
          if (lastValue === value && buffer[buffer.length - 1] === value) {
            yield value;
            buffer.length = 0;
          }
        }

        // Emit the last value if it hasn't been emitted yet
        if (hasValue && buffer.length > 0 && lastValue !== undefined) {
          yield lastValue;
        }
      },
    });
  }

  // Error handling
  /**
   * Catches errors and continues with a fallback value or stream.
   *
   * @param handler - Function to handle errors and return a fallback value or async iterable
   * @returns A new async iterflow with error handling
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3])
   *   .map(async x => {
   *     if (x === 2) throw new Error('Error!');
   *     return x;
   *   })
   *   .catchError(async (error) => [-1])
   *   .toArray(); // [1, -1, 3]
   * ```
   */
  catchError(
    handler: (
      error: unknown,
    ) =>
      | T
      | AsyncIterable<T>
      | Iterable<T>
      | Promise<T | AsyncIterable<T> | Iterable<T>>,
  ): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        try {
          for await (const value of self) {
            yield value;
          }
        } catch (error) {
          const fallback = await handler(error);
          if (
            typeof fallback === "object" &&
            fallback !== null &&
            (Symbol.asyncIterator in fallback || Symbol.iterator in fallback)
          ) {
            if (Symbol.asyncIterator in fallback) {
              yield* fallback as AsyncIterable<T>;
            } else {
              yield* fallback as Iterable<T>;
            }
          } else {
            yield fallback as T;
          }
        }
      },
    });
  }

  /**
   * Retries failed operations a specified number of times.
   *
   * @param maxRetries - Maximum number of retry attempts
   * @param delayMs - Optional delay between retries in milliseconds
   * @returns A new async iterflow with retry logic
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3])
   *   .map(async x => {
   *     if (Math.random() > 0.5) throw new Error('Random error');
   *     return x;
   *   })
   *   .retry(3, 100)
   *   .toArray(); // Retries up to 3 times with 100ms delay
   * ```
   */
  retry(maxRetries: number, delayMs = 0): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const iterator = self[Symbol.asyncIterator]();
        let retryCount = 0;

        while (true) {
          try {
            const result = await iterator.next();
            if (result.done) break;
            yield result.value;
            retryCount = 0; // Reset retry count on success
          } catch (error) {
            if (retryCount < maxRetries) {
              retryCount++;
              if (delayMs > 0) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
              }
              // Don't re-throw, continue to next iteration for retry
            } else {
              throw error;
            }
          }
        }
      },
    });
  }

  /**
   * Handles errors for each element individually.
   *
   * @param handler - Async or sync function to handle errors for each element
   * @returns A new async iterflow with error handling
   * @example
   * ```typescript
   * await asyncIter([1, 2, 3])
   *   .map(async x => {
   *     if (x === 2) throw new Error('Error!');
   *     return x;
   *   })
   *   .onError(async (error, value) => console.error('Error:', error))
   *   .toArray(); // [1, 3] (2 is skipped)
   * ```
   */
  onError(
    handler: (error: unknown, value?: T) => void | Promise<void>,
  ): AsyncIterflow<T> {
    const self = this;
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        for await (const value of self) {
          try {
            yield value;
          } catch (error) {
            await handler(error, value);
            // Continue to next element
          }
        }
      },
    });
  }
}

/**
 * Creates an async iterflow instance from an async iterable or iterable.
 * This is the main entry point for working with async iterables in a fluent API style.
 *
 * @template T The type of elements in the iterable
 * @param source - The async iterable or iterable to wrap
 * @returns A new async iterflow instance
 * @example
 * ```typescript
 * await asyncIter(asyncIterable)
 *   .filter(async x => x % 2 === 0)
 *   .map(async x => x * 2)
 *   .toArray(); // [4, 8]
 * ```
 */
export function asyncIter<T>(
  source: AsyncIterable<T> | Iterable<T>,
): AsyncIterflow<T> {
  if (Symbol.asyncIterator in source) {
    return new AsyncIterflow(source);
  }
  // Convert sync iterable to async iterable
  return new AsyncIterflow({
    async *[Symbol.asyncIterator]() {
      yield* source as Iterable<T>;
    },
  });
}

// Static helper methods namespace
export namespace asyncIter {
  /**
   * Combines two async iterables into an async iterator of tuples.
   * Stops when the shorter iterable is exhausted.
   *
   * @template T The type of elements in the first iterable
   * @template U The type of elements in the second iterable
   * @param iter1 - The first async iterable
   * @param iter2 - The second async iterable
   * @returns A new async iterflow of tuples pairing elements from both iterables
   * @example
   * ```typescript
   * await asyncIter.zip(asyncIter1, asyncIter2).toArray();
   * // [[1, 'a'], [2, 'b'], [3, 'c']]
   * ```
   */
  export function zip<T, U>(
    iter1: AsyncIterable<T> | Iterable<T>,
    iter2: AsyncIterable<U> | Iterable<U>,
  ): AsyncIterflow<[T, U]> {
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const it1 =
          Symbol.asyncIterator in iter1
            ? iter1[Symbol.asyncIterator]()
            : (async function* () {
                yield* iter1 as Iterable<T>;
              })();
        const it2 =
          Symbol.asyncIterator in iter2
            ? iter2[Symbol.asyncIterator]()
            : (async function* () {
                yield* iter2 as Iterable<U>;
              })();

        while (true) {
          const result1 = await it1.next();
          const result2 = await it2.next();

          if (result1.done || result2.done) {
            break;
          }

          yield [result1.value, result2.value];
        }
      },
    });
  }

  /**
   * Combines two async iterables using a combining function.
   * Stops when the shorter iterable is exhausted.
   *
   * @template T The type of elements in the first iterable
   * @template U The type of elements in the second iterable
   * @template R The type of the result
   * @param iter1 - The first async iterable
   * @param iter2 - The second async iterable
   * @param fn - Async or sync function to combine elements
   * @returns A new async iterflow with combined results
   * @example
   * ```typescript
   * await asyncIter.zipWith(asyncIter1, asyncIter2, async (a, b) => a + b).toArray();
   * // [11, 22, 33]
   * ```
   */
  export function zipWith<T, U, R>(
    iter1: AsyncIterable<T> | Iterable<T>,
    iter2: AsyncIterable<U> | Iterable<U>,
    fn: (a: T, b: U) => R | Promise<R>,
  ): AsyncIterflow<R> {
    return zip(iter1, iter2).map(async ([a, b]) => await fn(a, b));
  }

  /**
   * Generates an async sequence of numbers.
   *
   * @param stop - The end value (exclusive)
   * @returns A new async iterflow of numbers
   * @example
   * ```typescript
   * await asyncIter.range(5).toArray(); // [0, 1, 2, 3, 4]
   * ```
   */
  export function range(stop: number): AsyncIterflow<number>;
  export function range(start: number, stop: number): AsyncIterflow<number>;
  export function range(
    start: number,
    stop: number,
    step: number,
  ): AsyncIterflow<number>;
  export function range(
    startOrStop: number,
    stop?: number,
    step = 1,
  ): AsyncIterflow<number> {
    const actualStart = stop === undefined ? 0 : startOrStop;
    const actualStop = stop === undefined ? startOrStop : stop;

    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        if (step === 0) {
          validateNonZero(step, "step", "range");
        }

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
   *
   * @template T The type of the value to repeat
   * @param value - The value to repeat
   * @param times - Optional number of times to repeat (infinite if omitted)
   * @returns A new async iterflow repeating the value
   * @example
   * ```typescript
   * await asyncIter.repeat('x', 3).toArray(); // ['x', 'x', 'x']
   * ```
   */
  export function repeat<T>(value: T, times?: number): AsyncIterflow<T> {
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
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
   * Alternates elements from multiple async iterables in a round-robin fashion.
   *
   * @template T The type of elements in all iterables
   * @param iterables - Variable number of async iterables to interleave
   * @returns A new async iterflow with elements from all iterables interleaved
   * @example
   * ```typescript
   * await asyncIter.interleave(asyncIter1, asyncIter2).toArray();
   * // [1, 4, 2, 5, 3, 6]
   * ```
   */
  export function interleave<T>(
    ...iterables: Array<AsyncIterable<T> | Iterable<T>>
  ): AsyncIterflow<T> {
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        if (iterables.length === 0) return;

        const iterators = iterables.map((it) =>
          Symbol.asyncIterator in it
            ? it[Symbol.asyncIterator]()
            : (async function* () {
                yield* it as Iterable<T>;
              })(),
        );
        const active = new Set(iterators);

        while (active.size > 0) {
          for (const iterator of iterators) {
            if (!active.has(iterator)) continue;

            const result = await iterator.next();
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
   * Merges multiple sorted async iterables into a single sorted async iterator.
   *
   * @template T The type of elements in all iterables
   * @param iterables - Variable number of sorted async iterables to merge
   * @returns A new async iterflow with all elements merged in sorted order
   * @example
   * ```typescript
   * await asyncIter.merge(asyncIter1, asyncIter2).toArray();
   * // [1, 2, 3, 4, 5, 6]
   * ```
   */
  export function merge<T>(
    ...iterables: Array<AsyncIterable<T> | Iterable<T>>
  ): AsyncIterflow<T>;
  export function merge<T>(
    compareFn: (a: T, b: T) => number,
    ...iterables: Array<AsyncIterable<T> | Iterable<T>>
  ): AsyncIterflow<T>;
  export function merge<T>(
    ...args: (AsyncIterable<T> | Iterable<T> | ((a: T, b: T) => number))[]
  ): AsyncIterflow<T> {
    let compareFn: (a: T, b: T) => number;
    let iterables: Array<AsyncIterable<T> | Iterable<T>>;

    // Check if first argument is a function (comparator)
    if (typeof args[0] === "function") {
      compareFn = args[0] as (a: T, b: T) => number;
      iterables = args.slice(1) as Array<AsyncIterable<T> | Iterable<T>>;
    } else {
      // Default comparator for numbers/strings
      compareFn = (a: T, b: T) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      };
      iterables = args as Array<AsyncIterable<T> | Iterable<T>>;
    }

    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        if (iterables.length === 0) return;

        // Initialize all iterators with their first value
        const heap: Array<{
          value: T;
          iterator: AsyncIterator<T>;
          index: number;
        }> = [];

        for (let i = 0; i < iterables.length; i++) {
          const iterable = iterables[i]!;
          const iterator =
            Symbol.asyncIterator in iterable
              ? iterable[Symbol.asyncIterator]()
              : (async function* () {
                  yield* iterable as Iterable<T>;
                })();

          const result = await iterator.next();
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

          const result = await iterator.next();
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
   * Chains multiple async iterables sequentially, one after another.
   *
   * @template T The type of elements in all iterables
   * @param iterables - Variable number of async iterables to chain
   * @returns A new async iterflow with all elements chained sequentially
   * @example
   * ```typescript
   * await asyncIter.chain(asyncIter1, asyncIter2).toArray();
   * // [1, 2, 3, 4, 5, 6]
   * ```
   */
  export function chain<T>(
    ...iterables: Array<AsyncIterable<T> | Iterable<T>>
  ): AsyncIterflow<T> {
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        for (const iterable of iterables) {
          if (Symbol.asyncIterator in iterable) {
            yield* iterable;
          } else {
            yield* iterable as Iterable<T>;
          }
        }
      },
    });
  }

  /**
   * Creates an async iterator from a generator function.
   *
   * @template T The type of elements to generate
   * @param fn - Async generator function
   * @returns A new async iterflow
   * @example
   * ```typescript
   * const fibonacci = asyncIter.fromGenerator(async function* () {
   *   let [a, b] = [0, 1];
   *   while (true) {
   *     yield a;
   *     [a, b] = [b, a + b];
   *   }
   * });
   * await fibonacci.take(10).toArray(); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
   * ```
   */
  export function fromGenerator<T>(
    fn: () => AsyncGenerator<T>,
  ): AsyncIterflow<T> {
    return new AsyncIterflow(fn());
  }

  /**
   * Creates an async iterator from a promise.
   *
   * @template T The type of the resolved value
   * @param promise - Promise to convert to async iterator
   * @returns A new async iterflow
   * @example
   * ```typescript
   * await asyncIter.fromPromise(fetch('/api/data').then(r => r.json())).toArray();
   * ```
   */
  export function fromPromise<T>(promise: Promise<T>): AsyncIterflow<T> {
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        yield await promise;
      },
    });
  }

  /**
   * Creates an async iterator from an array of promises, yielding results as they resolve.
   *
   * @template T The type of the resolved values
   * @param promises - Array of promises
   * @returns A new async iterflow
   * @example
   * ```typescript
   * const promises = [fetch('/api/1'), fetch('/api/2'), fetch('/api/3')];
   * await asyncIter.fromPromises(promises).map(r => r.json()).toArray();
   * ```
   */
  export function fromPromises<T>(promises: Promise<T>[]): AsyncIterflow<T> {
    return new AsyncIterflow({
      async *[Symbol.asyncIterator]() {
        const pending = new Set(promises);
        const results: Map<number, T> = new Map();
        const indexed = promises.map((p, i) => p.then((v) => ({ i, v })));

        while (pending.size > 0) {
          const result = await Promise.race(indexed);
          results.set(result.i, result.v);
          pending.delete(promises[result.i]!);

          // Yield in order
          let nextIndex = promises.length - pending.size - 1;
          while (results.has(nextIndex)) {
            yield results.get(nextIndex)!;
            results.delete(nextIndex);
            nextIndex++;
          }
        }
      },
    });
  }
}
