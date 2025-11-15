import { IterFlow } from "./iter-flow.js";

export function iter<T>(source: Iterable<T>): IterFlow<T> {
  return new IterFlow(source);
}

// Static helper methods namespace
export namespace iter {
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

  export function zipWith<T, U, R>(
    iter1: Iterable<T>,
    iter2: Iterable<U>,
    fn: (a: T, b: U) => R,
  ): IterFlow<R> {
    return zip(iter1, iter2).map(([a, b]) => fn(a, b));
  }

  export function range(stop: number): IterFlow<number>;
  export function range(start: number, stop: number): IterFlow<number>;
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
