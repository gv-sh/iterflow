// Functional API exports - for functional programming style usage
// Usage: import { sum, filter, map } from 'iterflow/fn';

// Statistical operations
export function sum(iterable: Iterable<number>): number {
  let total = 0;
  for (const value of iterable) {
    total += value;
  }
  return total;
}

export function mean(iterable: Iterable<number>): number | undefined {
  let total = 0;
  let count = 0;
  for (const value of iterable) {
    total += value;
    count++;
  }
  return count === 0 ? undefined : total / count;
}

export function min(iterable: Iterable<number>): number | undefined {
  let minimum: number | undefined = undefined;
  for (const value of iterable) {
    if (minimum === undefined || value < minimum) {
      minimum = value;
    }
  }
  return minimum;
}

export function max(iterable: Iterable<number>): number | undefined {
  let maximum: number | undefined = undefined;
  for (const value of iterable) {
    if (maximum === undefined || value > maximum) {
      maximum = value;
    }
  }
  return maximum;
}

export function count<T>(iterable: Iterable<T>): number {
  let count = 0;
  for (const _ of iterable) {
    count++;
  }
  return count;
}

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

export function variance(iterable: Iterable<number>): number | undefined {
  const values = Array.from(iterable);
  if (values.length === 0) return undefined;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));

  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
}

export function stdDev(iterable: Iterable<number>): number | undefined {
  const varianceValue = variance(iterable);
  return varianceValue === undefined ? undefined : Math.sqrt(varianceValue);
}

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
export function map<T, U>(
  fn: (value: T) => U,
): (iterable: Iterable<T>) => IterableIterator<U> {
  return function* (iterable: Iterable<T>): IterableIterator<U> {
    for (const value of iterable) {
      yield fn(value);
    }
  };
}

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

export function pairwise<T>(iterable: Iterable<T>): IterableIterator<[T, T]> {
  return (function* (): IterableIterator<[T, T]> {
    const windowIter = window<T>(2)(iterable);
    for (const arr of { [Symbol.iterator]: () => windowIter }) {
      yield [arr[0]!, arr[1]!] as [T, T];
    }
  })();
}

// Grouping operations
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
export function toArray<T>(iterable: Iterable<T>): T[] {
  return Array.from(iterable);
}

// Combining operations
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
export function range(stop: number): IterableIterator<number>;
export function range(start: number, stop: number): IterableIterator<number>;
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
