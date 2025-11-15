export class IterFlow<T> implements Iterable<T> {
  private source: Iterator<T>;

  constructor(source: Iterable<T> | Iterator<T>) {
    this.source =
      Symbol.iterator in source ? source[Symbol.iterator]() : source;
  }

  // Iterator protocol
  [Symbol.iterator](): Iterator<T> {
    return this.source;
  }

  next(): IteratorResult<T> {
    return this.source.next();
  }

  // ES2025 native passthrough methods (would normally delegate to native implementations)
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

  // Terminal operations (consume the iterator)
  toArray(): T[] {
    return Array.from(this);
  }

  count(): number {
    let count = 0;
    for (const _ of this) {
      count++;
    }
    return count;
  }

  // Statistical operations - type-constrained to numbers
  sum(this: IterFlow<number>): number {
    let total = 0;
    for (const value of this) {
      total += value;
    }
    return total;
  }

  mean(this: IterFlow<number>): number | undefined {
    let total = 0;
    let count = 0;
    for (const value of this) {
      total += value;
      count++;
    }
    return count === 0 ? undefined : total / count;
  }

  min(this: IterFlow<number>): number | undefined {
    let minimum: number | undefined = undefined;
    for (const value of this) {
      if (minimum === undefined || value < minimum) {
        minimum = value;
      }
    }
    return minimum;
  }

  max(this: IterFlow<number>): number | undefined {
    let maximum: number | undefined = undefined;
    for (const value of this) {
      if (maximum === undefined || value > maximum) {
        maximum = value;
      }
    }
    return maximum;
  }

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

  variance(this: IterFlow<number>): number | undefined {
    const values = this.toArray();
    if (values.length === 0) return undefined;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));

    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }

  stdDev(this: IterFlow<number>): number | undefined {
    const variance = this.variance();
    return variance === undefined ? undefined : Math.sqrt(variance);
  }

  percentile(this: IterFlow<number>, p: number): number | undefined {
    if (p < 0 || p > 100) {
      throw new Error("Percentile must be between 0 and 100");
    }

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

  // Windowing operations
  window(size: number): IterFlow<T[]> {
    if (size < 1) {
      throw new Error("Window size must be at least 1");
    }

    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        const buffer: T[] = [];

        for (const value of self) {
          buffer.push(value);

          if (buffer.length === size) {
            yield [...buffer];
            buffer.shift();
          }
        }
      },
    });
  }

  chunk(size: number): IterFlow<T[]> {
    if (size < 1) {
      throw new Error("Chunk size must be at least 1");
    }

    const self = this;
    return new IterFlow({
      *[Symbol.iterator]() {
        let buffer: T[] = [];

        for (const value of self) {
          buffer.push(value);

          if (buffer.length === size) {
            yield buffer;
            buffer = [];
          }
        }

        if (buffer.length > 0) {
          yield buffer;
        }
      },
    });
  }

  pairwise(): IterFlow<[T, T]> {
    return this.window(2).map((arr) => [arr[0]!, arr[1]!] as [T, T]);
  }

  // Set operations
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
}
