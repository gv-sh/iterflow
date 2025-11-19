// Composition utilities for functional programming with iterables

/**
 * Type representing a function that transforms an iterable.
 * Used for composing transformations in a type-safe way.
 *
 * @template T The input element type
 * @template U The output element type
 */
export type IterableTransformer<T, U> = (
  iterable: Iterable<T>,
) => IterableIterator<U>;

/**
 * Type representing a terminal operation that produces a final result.
 *
 * @template T The input element type
 * @template R The result type
 */
export type TerminalOperation<T, R> = (iterable: Iterable<T>) => R;

/**
 * Composes functions from left to right (Unix pipe style).
 * Each function takes an iterable and returns an iterable, except the last
 * function which can return any type.
 *
 * The pipe flows data from left to right:
 * pipe(f, g, h)(x) === h(g(f(x)))
 *
 * @param fns - Functions to compose from left to right
 * @returns A function that applies all transformations in sequence
 * @example
 * ```typescript
 * import { pipe, map, filter, toArray } from 'iterflow/fn';
 *
 * const process = pipe(
 *   map((x: number) => x * 2),
 *   filter((x: number) => x > 5),
 *   toArray
 * );
 *
 * process([1, 2, 3, 4, 5]); // [6, 8, 10]
 * ```
 */
export function pipe<A, B>(
  fn1: (input: A) => B,
): (input: A) => B;

export function pipe<A, B, C>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
): (input: A) => C;

export function pipe<A, B, C, D>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
): (input: A) => D;

export function pipe<A, B, C, D, E>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
): (input: A) => E;

export function pipe<A, B, C, D, E, F>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
): (input: A) => F;

export function pipe<A, B, C, D, E, F, G>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
): (input: A) => G;

export function pipe<A, B, C, D, E, F, G, H>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
): (input: A) => H;

export function pipe<A, B, C, D, E, F, G, H, I>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
  fn8: (input: H) => I,
): (input: A) => I;

export function pipe<A, B, C, D, E, F, G, H, I, J>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
  fn8: (input: H) => I,
  fn9: (input: I) => J,
): (input: A) => J;

export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
  fn8: (input: H) => I,
  fn9: (input: I) => J,
  fn10: (input: J) => K,
): (input: A) => K;

export function pipe(...fns: Array<(input: any) => any>): (input: any) => any {
  return (input: any) => fns.reduce((acc, fn) => fn(acc), input);
}

/**
 * Composes functions from right to left (traditional mathematical composition).
 * Each function takes an iterable and returns an iterable, except the last
 * function which can return any type.
 *
 * The composition flows from right to left:
 * compose(h, g, f)(x) === h(g(f(x)))
 *
 * @param fns - Functions to compose from right to left
 * @returns A function that applies all transformations in sequence
 * @example
 * ```typescript
 * import { compose, map, filter, toArray } from 'iterflow/fn';
 *
 * const process = compose(
 *   toArray,
 *   filter((x: number) => x > 5),
 *   map((x: number) => x * 2)
 * );
 *
 * process([1, 2, 3, 4, 5]); // [6, 8, 10]
 * ```
 */
export function compose<A, B>(
  fn1: (input: A) => B,
): (input: A) => B;

export function compose<A, B, C>(
  fn2: (input: B) => C,
  fn1: (input: A) => B,
): (input: A) => C;

export function compose<A, B, C, D>(
  fn3: (input: C) => D,
  fn2: (input: B) => C,
  fn1: (input: A) => B,
): (input: A) => D;

export function compose<A, B, C, D, E>(
  fn4: (input: D) => E,
  fn3: (input: C) => D,
  fn2: (input: B) => C,
  fn1: (input: A) => B,
): (input: A) => E;

export function compose<A, B, C, D, E, F>(
  fn5: (input: E) => F,
  fn4: (input: D) => E,
  fn3: (input: C) => D,
  fn2: (input: B) => C,
  fn1: (input: A) => B,
): (input: A) => F;

export function compose<A, B, C, D, E, F, G>(
  fn6: (input: F) => G,
  fn5: (input: E) => F,
  fn4: (input: D) => E,
  fn3: (input: C) => D,
  fn2: (input: B) => C,
  fn1: (input: A) => B,
): (input: A) => G;

export function compose<A, B, C, D, E, F, G, H>(
  fn7: (input: G) => H,
  fn6: (input: F) => G,
  fn5: (input: E) => F,
  fn4: (input: D) => E,
  fn3: (input: C) => D,
  fn2: (input: B) => C,
  fn1: (input: A) => B,
): (input: A) => H;

export function compose<A, B, C, D, E, F, G, H, I>(
  fn8: (input: H) => I,
  fn7: (input: G) => H,
  fn6: (input: F) => G,
  fn5: (input: E) => F,
  fn4: (input: D) => E,
  fn3: (input: C) => D,
  fn2: (input: B) => C,
  fn1: (input: A) => B,
): (input: A) => I;

export function compose<A, B, C, D, E, F, G, H, I, J>(
  fn9: (input: I) => J,
  fn8: (input: H) => I,
  fn7: (input: G) => H,
  fn6: (input: F) => G,
  fn5: (input: E) => F,
  fn4: (input: D) => E,
  fn3: (input: C) => D,
  fn2: (input: B) => C,
  fn1: (input: A) => B,
): (input: A) => J;

export function compose<A, B, C, D, E, F, G, H, I, J, K>(
  fn10: (input: J) => K,
  fn9: (input: I) => J,
  fn8: (input: H) => I,
  fn7: (input: G) => H,
  fn6: (input: F) => G,
  fn5: (input: E) => F,
  fn4: (input: D) => E,
  fn3: (input: C) => D,
  fn2: (input: B) => C,
  fn1: (input: A) => B,
): (input: A) => K;

export function compose(
  ...fns: Array<(input: any) => any>
): (input: any) => any {
  return (input: any) => fns.reduceRight((acc, fn) => fn(acc), input);
}

/**
 * Helper function to create custom iterable operations that follow the
 * iterflow functional API pattern.
 *
 * Creates a curried function that takes configuration parameters and returns
 * a function that transforms an iterable. The transformation uses a generator
 * function for lazy evaluation.
 *
 * @template TConfig The type of configuration parameters
 * @template TInput The type of input elements
 * @template TOutput The type of output elements
 * @param name - Name of the operation (for debugging)
 * @param generator - Generator function that performs the transformation
 * @returns A curried function following the iterflow pattern
 * @example
 * ```typescript
 * import { createOperation } from 'iterflow/fn';
 *
 * // Create a custom operation that multiplies by a factor
 * const multiplyBy = createOperation(
 *   'multiplyBy',
 *   function* (iterable: Iterable<number>, factor: number) {
 *     for (const value of iterable) {
 *       yield value * factor;
 *     }
 *   }
 * );
 *
 * // Use it in a pipeline
 * const double = multiplyBy(2);
 * Array.from(double([1, 2, 3])); // [2, 4, 6]
 *
 * // Create a custom filtering operation
 * const between = createOperation(
 *   'between',
 *   function* (iterable: Iterable<number>, min: number, max: number) {
 *     for (const value of iterable) {
 *       if (value >= min && value <= max) {
 *         yield value;
 *       }
 *     }
 *   }
 * );
 *
 * const between5And10 = between(5, 10);
 * Array.from(between5And10([1, 6, 3, 8, 12, 4])); // [6, 8]
 * ```
 */
export function createOperation<TInput, TOutput>(
  name: string,
  generator: (iterable: Iterable<TInput>) => Generator<TOutput>,
): (iterable: Iterable<TInput>) => IterableIterator<TOutput>;

export function createOperation<TConfig, TInput, TOutput>(
  name: string,
  generator: (iterable: Iterable<TInput>, config: TConfig) => Generator<TOutput>,
): (config: TConfig) => (iterable: Iterable<TInput>) => IterableIterator<TOutput>;

export function createOperation<TConfig1, TConfig2, TInput, TOutput>(
  name: string,
  generator: (
    iterable: Iterable<TInput>,
    config1: TConfig1,
    config2: TConfig2,
  ) => Generator<TOutput>,
): (
  config1: TConfig1,
  config2: TConfig2,
) => (iterable: Iterable<TInput>) => IterableIterator<TOutput>;

export function createOperation<TConfig1, TConfig2, TConfig3, TInput, TOutput>(
  name: string,
  generator: (
    iterable: Iterable<TInput>,
    config1: TConfig1,
    config2: TConfig2,
    config3: TConfig3,
  ) => Generator<TOutput>,
): (
  config1: TConfig1,
  config2: TConfig2,
  config3: TConfig3,
) => (iterable: Iterable<TInput>) => IterableIterator<TOutput>;

export function createOperation<TInput, TOutput>(
  name: string,
  generator: (iterable: Iterable<TInput>, ...configs: any[]) => Generator<TOutput>,
): (...configs: any[]) => (iterable: Iterable<TInput>) => IterableIterator<TOutput> {
  // Handle operations with no configuration parameters
  if (generator.length === 1) {
    return (iterable: Iterable<TInput>): IterableIterator<TOutput> => {
      const result = generator(iterable);
      // Add operation name for debugging
      Object.defineProperty(result, 'name', { value: name });
      return result;
    };
  }

  // Handle operations with configuration parameters (curried)
  return (...configs: any[]) => {
    return (iterable: Iterable<TInput>): IterableIterator<TOutput> => {
      const result = generator(iterable, ...configs);
      // Add operation name for debugging
      Object.defineProperty(result, 'name', { value: name });
      return result;
    };
  };
}

/**
 * Type representing a transducer - a composable algorithmic transformation.
 * Transducers are independent of the context of their input and output sources.
 *
 * @template TInput The input element type
 * @template TOutput The output element type
 */
export type Transducer<TInput, TOutput> = <TResult>(
  reducer: Reducer<TOutput, TResult>,
) => Reducer<TInput, TResult>;

/**
 * Type representing a reducer function that combines values into an accumulator.
 *
 * @template T The type of values being reduced
 * @template TResult The type of the accumulator
 */
export type Reducer<T, TResult> = (
  accumulator: TResult,
  value: T,
) => TResult;

/**
 * Creates a transducer from a map function.
 * Transducers enable efficient composition of transformations without
 * creating intermediate iterables.
 *
 * @template TInput The input element type
 * @template TOutput The output element type
 * @param fn - Function to transform each element
 * @returns A transducer that applies the transformation
 * @example
 * ```typescript
 * import { mapTransducer, transduce } from 'iterflow/fn';
 *
 * const xf = mapTransducer((x: number) => x * 2);
 * const result = transduce(
 *   xf,
 *   (acc: number[], x: number) => [...acc, x],
 *   [],
 *   [1, 2, 3]
 * );
 * // [2, 4, 6]
 * ```
 */
export function mapTransducer<TInput, TOutput>(
  fn: (value: TInput) => TOutput,
): Transducer<TInput, TOutput> {
  return <TResult>(reducer: Reducer<TOutput, TResult>) => {
    return (accumulator: TResult, value: TInput): TResult => {
      return reducer(accumulator, fn(value));
    };
  };
}

/**
 * Creates a transducer from a filter predicate.
 * Transducers enable efficient composition of transformations without
 * creating intermediate iterables.
 *
 * @template T The element type
 * @param predicate - Function to test each element
 * @returns A transducer that filters elements
 * @example
 * ```typescript
 * import { filterTransducer, transduce } from 'iterflow/fn';
 *
 * const xf = filterTransducer((x: number) => x % 2 === 0);
 * const result = transduce(
 *   xf,
 *   (acc: number[], x: number) => [...acc, x],
 *   [],
 *   [1, 2, 3, 4, 5]
 * );
 * // [2, 4]
 * ```
 */
export function filterTransducer<T>(
  predicate: (value: T) => boolean,
): Transducer<T, T> {
  return <TResult>(reducer: Reducer<T, TResult>) => {
    return (accumulator: TResult, value: T): TResult => {
      return predicate(value) ? reducer(accumulator, value) : accumulator;
    };
  };
}

/**
 * Creates a transducer from a take operation.
 * Transducers enable efficient composition of transformations without
 * creating intermediate iterables.
 *
 * Note: This transducer requires special handling in transduce() to support
 * early termination. Use the '@@transducer/reduced' protocol.
 *
 * @template T The element type
 * @param n - Number of elements to take
 * @returns A transducer that takes the first n elements
 * @example
 * ```typescript
 * import { takeTransducer, transduce } from 'iterflow/fn';
 *
 * const xf = takeTransducer(3);
 * const result = transduce(
 *   xf,
 *   (acc: number[], x: number) => [...acc, x],
 *   [],
 *   [1, 2, 3, 4, 5]
 * );
 * // [1, 2, 3]
 * ```
 */
export function takeTransducer<T>(n: number): Transducer<T, T> {
  return <TResult>(reducer: Reducer<T, TResult>) => {
    let taken = 0;
    return (accumulator: TResult, value: T): TResult => {
      if (taken < n) {
        taken++;
        const result = reducer(accumulator, value);
        // Mark as reduced if we've taken enough
        if (taken === n) {
          return reduced(result);
        }
        return result;
      }
      return accumulator;
    };
  };
}

/**
 * Composes multiple transducers into a single transducer.
 * Composition happens from right to left (like compose).
 *
 * @param transducers - Transducers to compose
 * @returns A composed transducer
 * @example
 * ```typescript
 * import { composeTransducers, mapTransducer, filterTransducer, transduce } from 'iterflow/fn';
 *
 * const xf = composeTransducers(
 *   filterTransducer((x: number) => x > 2),
 *   mapTransducer((x: number) => x * 2)
 * );
 *
 * const result = transduce(
 *   xf,
 *   (acc: number[], x: number) => [...acc, x],
 *   [],
 *   [1, 2, 3, 4, 5]
 * );
 * // [6, 8, 10]
 * ```
 */
export function composeTransducers<A, B>(
  xf1: Transducer<A, B>,
): Transducer<A, B>;

export function composeTransducers<A, B, C>(
  xf2: Transducer<B, C>,
  xf1: Transducer<A, B>,
): Transducer<A, C>;

export function composeTransducers<A, B, C, D>(
  xf3: Transducer<C, D>,
  xf2: Transducer<B, C>,
  xf1: Transducer<A, B>,
): Transducer<A, D>;

export function composeTransducers<A, B, C, D, E>(
  xf4: Transducer<D, E>,
  xf3: Transducer<C, D>,
  xf2: Transducer<B, C>,
  xf1: Transducer<A, B>,
): Transducer<A, E>;

export function composeTransducers(
  ...transducers: Array<Transducer<any, any>>
): Transducer<any, any> {
  return (reducer: Reducer<any, any>) => {
    return transducers.reduceRight(
      (acc, xf) => xf(acc),
      reducer,
    );
  };
}

/**
 * Symbol used to mark a reduced value (for early termination in transducers).
 */
const REDUCED = Symbol('@@transducer/reduced');

/**
 * Interface for a reduced value (supports early termination).
 */
interface Reduced<T> {
  [REDUCED]: true;
  value: T;
}

/**
 * Marks a value as reduced (for early termination in transducers).
 *
 * @template T The value type
 * @param value - The value to mark as reduced
 * @returns A reduced value
 */
export function reduced<T>(value: T): Reduced<T> {
  return {
    [REDUCED]: true,
    value,
  };
}

/**
 * Checks if a value is reduced.
 *
 * @template T The value type
 * @param value - The value to check
 * @returns true if the value is reduced
 */
export function isReduced<T>(value: any): value is Reduced<T> {
  return value != null && value[REDUCED] === true;
}

/**
 * Applies a transducer to an iterable and reduces it to a final value.
 * This is the main entry point for using transducers.
 *
 * @template TInput The input element type
 * @template TOutput The output element type (after transducer transformation)
 * @template TResult The final result type
 * @param transducer - The transducer to apply
 * @param reducer - The reducer function to combine values
 * @param initial - The initial accumulator value
 * @param iterable - The iterable to process
 * @returns The final reduced value
 * @example
 * ```typescript
 * import { transduce, composeTransducers, mapTransducer, filterTransducer } from 'iterflow/fn';
 *
 * const xf = composeTransducers(
 *   filterTransducer((x: number) => x % 2 === 0),
 *   mapTransducer((x: number) => x * 2)
 * );
 *
 * const sum = transduce(
 *   xf,
 *   (acc: number, x: number) => acc + x,
 *   0,
 *   [1, 2, 3, 4, 5]
 * );
 * // 12 (2*2 + 4*2)
 *
 * const toArray = transduce(
 *   xf,
 *   (acc: number[], x: number) => [...acc, x],
 *   [],
 *   [1, 2, 3, 4, 5]
 * );
 * // [4, 8]
 * ```
 */
export function transduce<TInput, TOutput, TResult>(
  transducer: Transducer<TInput, TOutput>,
  reducer: Reducer<TOutput, TResult>,
  initial: TResult,
  iterable: Iterable<TInput>,
): TResult {
  const xform = transducer(reducer);
  let accumulator = initial;

  for (const value of iterable) {
    accumulator = xform(accumulator, value);
    // Check for early termination
    if (isReduced(accumulator)) {
      return accumulator.value;
    }
  }

  return accumulator;
}

/**
 * Converts a transducer into an iterable transformer.
 * This allows transducers to be used in pipe() and compose() with other
 * iterable operations.
 *
 * @template TInput The input element type
 * @template TOutput The output element type
 * @param transducer - The transducer to convert
 * @returns An iterable transformer function
 * @example
 * ```typescript
 * import { pipe, transducerToIterator, mapTransducer, filterTransducer, toArray } from 'iterflow/fn';
 *
 * const xf = composeTransducers(
 *   filterTransducer((x: number) => x % 2 === 0),
 *   mapTransducer((x: number) => x * 2)
 * );
 *
 * const process = pipe(
 *   transducerToIterator(xf),
 *   toArray
 * );
 *
 * process([1, 2, 3, 4, 5]); // [4, 8]
 * ```
 */
export function transducerToIterator<TInput, TOutput>(
  transducer: Transducer<TInput, TOutput>,
): (iterable: Iterable<TInput>) => IterableIterator<TOutput> {
  return function* (iterable: Iterable<TInput>): IterableIterator<TOutput> {
    // Create a reducer that yields values immediately
    const results: TOutput[] = [];
    const reducer = (acc: TOutput[], value: TOutput): TOutput[] => {
      acc.push(value);
      return acc;
    };

    const xform = transducer(reducer);

    for (const value of iterable) {
      const before = results.length;
      const result = xform(results, value);

      // Check for early termination
      if (isReduced(result)) {
        // Yield any new values that were added
        for (let i = before; i < result.value.length; i++) {
          yield result.value[i]!;
        }
        return;
      }

      // Yield any new values that were added
      for (let i = before; i < results.length; i++) {
        yield results[i]!;
      }
    }
  };
}
