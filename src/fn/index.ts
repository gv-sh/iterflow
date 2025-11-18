// Functional API exports - for functional programming style usage
// Usage: import { sum, filter, map } from 'iterflow/fn';

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
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));

  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
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
  if (p < 0 || p > 100) {
    throw new Error("Percentile must be between 0 and 100");
  }

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
  if (size < 1) {
    throw new Error("Window size must be at least 1");
  }

  return function* (iterable: Iterable<T>): IterableIterator<T[]> {
    const buffer: T[] = [];

    for (const value of iterable) {
      buffer.push(value);

      if (buffer.length === size) {
        yield [...buffer];
        buffer.shift();
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
  if (size < 1) {
    throw new Error("Chunk size must be at least 1");
  }

  return function* (iterable: Iterable<T>): IterableIterator<T[]> {
    let buffer: T[] = [];

    for (const value of iterable) {
      buffer.push(value);

      if (buffer.length === size) {
        yield buffer;
        buffer = [];
      }
    }

    if (buffer.length > 0) {
      yield buffer;
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
    if (step === 0) {
      throw new Error("Range step cannot be zero");
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
