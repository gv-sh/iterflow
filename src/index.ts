import { IterFlow } from "./iter-flow.js";

/**
 * Creates an IterFlow instance from an iterable.
 * This is the main entry point for working with iterables in a fluent API style.
 *
 * @template T The type of elements in the iterable
 * @param source - The iterable to wrap
 * @returns A new IterFlow instance
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
   * @returns A new IterFlow of tuples pairing elements from both iterables
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
   * @returns A new IterFlow with combined results
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
   * @returns A new IterFlow of numbers
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
   * @returns A new IterFlow of numbers
   */
  export function range(start: number, stop: number): IterFlow<number>;
  /**
   * Generates a sequence of numbers from start to stop (exclusive) with a custom step.
   *
   * @param start - The starting value (inclusive)
   * @param stop - The end value (exclusive)
   * @param step - The increment between values
   * @returns A new IterFlow of numbers
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
   * @returns A new IterFlow repeating the value
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
}

// Export the class as well
export { IterFlow } from "./iter-flow.js";
