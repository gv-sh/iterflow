import { describe, expect, it } from "vitest";
import {
  pipe,
  compose,
  createOperation,
  mapTransducer,
  filterTransducer,
  takeTransducer,
  composeTransducers,
  transduce,
  transducerToIterator,
  reduced,
  isReduced,
  map,
  filter,
  take,
  toArray,
  sum,
  reduce,
  range,
} from "../src/fn/index.js";

describe("Composition - pipe", () => {
  it("should compose functions left to right", () => {
    const process = pipe(
      map((x: number) => x * 2),
      filter((x: number) => x > 5),
      toArray,
    );

    const result = process([1, 2, 3, 4, 5]);
    expect(result).toEqual([6, 8, 10]);
  });

  it("should work with a single function", () => {
    const process = pipe(map((x: number) => x * 2));

    const result = Array.from(process([1, 2, 3]));
    expect(result).toEqual([2, 4, 6]);
  });

  it("should work with terminal operations", () => {
    const process = pipe(
      map((x: number) => x * 2),
      sum,
    );

    const result = process([1, 2, 3, 4, 5]);
    expect(result).toBe(30);
  });

  it("should handle complex pipelines", () => {
    const process = pipe(
      map((x: number) => x + 1),
      filter((x: number) => x % 2 === 0),
      map((x: number) => x * 10),
      take(2),
      toArray,
    );

    const result = process([1, 2, 3, 4, 5]);
    expect(result).toEqual([20, 40]);
  });

  it("should maintain type safety through pipeline", () => {
    const process = pipe(
      map((x: number) => x.toString()),
      map((s: string) => s.length),
      toArray,
    );

    const result = process([1, 22, 333]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should work with reduce", () => {
    const process = pipe(
      map((x: number) => x * 2),
      filter((x: number) => x > 5),
      reduce((acc: number, x: number) => acc + x, 0),
    );

    const result = process([1, 2, 3, 4, 5]);
    expect(result).toBe(24);
  });

  it("should handle empty iterables", () => {
    const process = pipe(
      map((x: number) => x * 2),
      filter((x: number) => x > 5),
      toArray,
    );

    const result = process([]);
    expect(result).toEqual([]);
  });

  it("should work with range generators", () => {
    const process = pipe(
      map((x: number) => x * x),
      filter((x: number) => x % 2 === 0),
      take(3),
      toArray,
    );

    const result = process(range(1, 10));
    expect(result).toEqual([4, 16, 36]);
  });
});

describe("Composition - compose", () => {
  it("should compose functions right to left", () => {
    const process = compose(
      toArray,
      filter((x: number) => x > 5),
      map((x: number) => x * 2),
    );

    const result = process([1, 2, 3, 4, 5]);
    expect(result).toEqual([6, 8, 10]);
  });

  it("should work with a single function", () => {
    const process = compose(map((x: number) => x * 2));

    const result = Array.from(process([1, 2, 3]));
    expect(result).toEqual([2, 4, 6]);
  });

  it("should work with terminal operations", () => {
    const process = compose(
      sum,
      map((x: number) => x * 2),
    );

    const result = process([1, 2, 3, 4, 5]);
    expect(result).toBe(30);
  });

  it("should handle complex compositions", () => {
    const process = compose(
      toArray,
      take(2),
      map((x: number) => x * 10),
      filter((x: number) => x % 2 === 0),
      map((x: number) => x + 1),
    );

    const result = process([1, 2, 3, 4, 5]);
    expect(result).toEqual([20, 40]);
  });

  it("should maintain type safety through composition", () => {
    const process = compose(
      toArray,
      map((s: string) => s.length),
      map((x: number) => x.toString()),
    );

    const result = process([1, 22, 333]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should be equivalent to pipe but reversed", () => {
    const pipeResult = pipe(
      map((x: number) => x * 2),
      filter((x: number) => x > 5),
      toArray,
    )([1, 2, 3, 4, 5]);

    const composeResult = compose(
      toArray,
      filter((x: number) => x > 5),
      map((x: number) => x * 2),
    )([1, 2, 3, 4, 5]);

    expect(pipeResult).toEqual(composeResult);
  });
});

describe("Composition - createOperation", () => {
  it("should create custom operations with no config", () => {
    const duplicate = createOperation(
      "duplicate",
      function* (iterable: Iterable<number>) {
        for (const value of iterable) {
          yield value;
          yield value;
        }
      },
    );

    const result = Array.from(duplicate([1, 2, 3]));
    expect(result).toEqual([1, 1, 2, 2, 3, 3]);
  });

  it("should create custom operations with one config parameter", () => {
    const multiplyBy = createOperation(
      "multiplyBy",
      function* (iterable: Iterable<number>, factor: number) {
        for (const value of iterable) {
          yield value * factor;
        }
      },
    );

    const double = multiplyBy(2);
    const result = Array.from(double([1, 2, 3]));
    expect(result).toEqual([2, 4, 6]);
  });

  it("should create custom operations with multiple config parameters", () => {
    const between = createOperation(
      "between",
      function* (iterable: Iterable<number>, min: number, max: number) {
        for (const value of iterable) {
          if (value >= min && value <= max) {
            yield value;
          }
        }
      },
    );

    const between5And10 = between(5, 10);
    const result = Array.from(between5And10([1, 6, 3, 8, 12, 4]));
    expect(result).toEqual([6, 8]);
  });

  it("should work in pipe composition", () => {
    const addPrefix = createOperation(
      "addPrefix",
      function* (iterable: Iterable<string>, prefix: string) {
        for (const value of iterable) {
          yield prefix + value;
        }
      },
    );

    const process = pipe(
      addPrefix(">> "),
      toArray,
    );

    const result = process(["a", "b", "c"]);
    expect(result).toEqual([">> a", ">> b", ">> c"]);
  });

  it("should work in compose composition", () => {
    const square = createOperation(
      "square",
      function* (iterable: Iterable<number>) {
        for (const value of iterable) {
          yield value * value;
        }
      },
    );

    const process = compose(
      toArray,
      take(3),
      square,
    );

    const result = process([1, 2, 3, 4, 5]);
    expect(result).toEqual([1, 4, 9]);
  });

  it("should create operations that work like built-in ones", () => {
    const customMap = createOperation(
      "customMap",
      function* <T, U>(iterable: Iterable<T>, fn: (value: T) => U) {
        for (const value of iterable) {
          yield fn(value);
        }
      },
    );

    const double = customMap((x: number) => x * 2);
    const result = Array.from(double([1, 2, 3]));
    expect(result).toEqual([2, 4, 6]);
  });

  it("should handle empty iterables", () => {
    const multiplyBy = createOperation(
      "multiplyBy",
      function* (iterable: Iterable<number>, factor: number) {
        for (const value of iterable) {
          yield value * factor;
        }
      },
    );

    const result = Array.from(multiplyBy(2)([]));
    expect(result).toEqual([]);
  });
});

describe("Transducers - mapTransducer", () => {
  it("should create a map transducer", () => {
    const xf = mapTransducer((x: number) => x * 2);
    const result = transduce(
      xf,
      (acc: number[], x: number) => [...acc, x],
      [],
      [1, 2, 3, 4, 5],
    );

    expect(result).toEqual([2, 4, 6, 8, 10]);
  });

  it("should work with reduce to sum", () => {
    const xf = mapTransducer((x: number) => x * 2);
    const result = transduce(
      xf,
      (acc: number, x: number) => acc + x,
      0,
      [1, 2, 3, 4, 5],
    );

    expect(result).toBe(30);
  });

  it("should handle type transformations", () => {
    const xf = mapTransducer((x: number) => x.toString());
    const result = transduce(
      xf,
      (acc: string[], x: string) => [...acc, x],
      [],
      [1, 2, 3],
    );

    expect(result).toEqual(["1", "2", "3"]);
  });
});

describe("Transducers - filterTransducer", () => {
  it("should create a filter transducer", () => {
    const xf = filterTransducer((x: number) => x % 2 === 0);
    const result = transduce(
      xf,
      (acc: number[], x: number) => [...acc, x],
      [],
      [1, 2, 3, 4, 5],
    );

    expect(result).toEqual([2, 4]);
  });

  it("should work with reduce", () => {
    const xf = filterTransducer((x: number) => x > 3);
    const result = transduce(
      xf,
      (acc: number, x: number) => acc + x,
      0,
      [1, 2, 3, 4, 5],
    );

    expect(result).toBe(9);
  });

  it("should handle empty results", () => {
    const xf = filterTransducer((x: number) => x > 10);
    const result = transduce(
      xf,
      (acc: number[], x: number) => [...acc, x],
      [],
      [1, 2, 3, 4, 5],
    );

    expect(result).toEqual([]);
  });
});

describe("Transducers - takeTransducer", () => {
  it("should take first n elements", () => {
    const xf = takeTransducer(3);
    const result = transduce(
      xf,
      (acc: number[], x: number) => [...acc, x],
      [],
      [1, 2, 3, 4, 5],
    );

    expect(result).toEqual([1, 2, 3]);
  });

  it("should handle taking more than available", () => {
    const xf = takeTransducer(10);
    const result = transduce(
      xf,
      (acc: number[], x: number) => [...acc, x],
      [],
      [1, 2, 3],
    );

    expect(result).toEqual([1, 2, 3]);
  });

  it("should take zero elements", () => {
    const xf = takeTransducer(0);
    const result = transduce(
      xf,
      (acc: number[], x: number) => [...acc, x],
      [],
      [1, 2, 3],
    );

    expect(result).toEqual([]);
  });
});

describe("Transducers - composeTransducers", () => {
  it("should compose map and filter transducers", () => {
    // composeTransducers applies right-to-left to the reducer
    // filter(x > 2) wraps the base reducer, then map(x * 2) wraps that
    // Data flow: value -> map(*2) -> filter(>2) -> base reducer
    // So: [1,2,3,4,5] -> [2,4,6,8,10] -> [4,6,8,10] (filter out 2)
    const xf = composeTransducers(
      mapTransducer((x: number) => x * 2),
      filterTransducer((x: number) => x > 2),
    );

    const result = transduce(
      xf,
      (acc: number[], x: number) => [...acc, x],
      [],
      [1, 2, 3, 4, 5],
    );

    expect(result).toEqual([4, 6, 8, 10]);
  });

  it("should compose multiple transducers", () => {
    // Composition: filter(take(map(reducer)))
    // Input: [1,2,3,4,5,6,7,8]
    // 1: filter (1%2===0) false -> skip
    // 2: filter (2%2===0) true -> take count=1 -> map(2+1=3) -> yield 3
    // 3: filter (3%2===0) false -> skip
    // 4: filter (4%2===0) true -> take count=2, stop -> map(4+1=5) -> yield 5
    const xf = composeTransducers(
      filterTransducer((x: number) => x % 2 === 0),
      takeTransducer(2),
      mapTransducer((x: number) => x + 1),
    );

    const result = transduce(
      xf,
      (acc: number[], x: number) => [...acc, x],
      [],
      [1, 2, 3, 4, 5, 6, 7, 8],
    );

    expect(result).toEqual([3, 5]);
  });

  it("should work with reduce to calculate sum", () => {
    const xf = composeTransducers(
      filterTransducer((x: number) => x % 2 === 0),
      mapTransducer((x: number) => x * 2),
    );

    const result = transduce(
      xf,
      (acc: number, x: number) => acc + x,
      0,
      [1, 2, 3, 4, 5],
    );

    expect(result).toBe(12); // (2*2) + (4*2) = 4 + 8 = 12
  });

  it("should compose in the right order (right to left)", () => {
    // Data flow: value -> +10 -> filter(even) -> *2
    // 1 -> 11 (odd) -> skip
    // 2 -> 12 (even) -> 24
    // 3 -> 13 (odd) -> skip
    // 4 -> 14 (even) -> 28
    // 5 -> 15 (odd) -> skip
    const xf = composeTransducers(
      mapTransducer((x: number) => x + 10),
      filterTransducer((x: number) => x % 2 === 0),
      mapTransducer((x: number) => x * 2),
    );

    const result = transduce(
      xf,
      (acc: number[], x: number) => [...acc, x],
      [],
      [1, 2, 3, 4, 5],
    );

    expect(result).toEqual([24, 28]);
  });
});

describe("Transducers - transduce", () => {
  it("should transduce with identity transducer", () => {
    const identity = <T>() =>
      <R>(reducer: (acc: R, value: T) => R) => reducer;

    const result = transduce(
      identity<number>(),
      (acc: number[], x: number) => [...acc, x],
      [],
      [1, 2, 3],
    );

    expect(result).toEqual([1, 2, 3]);
  });

  it("should handle early termination with reduced", () => {
    const xf = takeTransducer(3);
    let count = 0;

    const result = transduce(
      xf,
      (acc: number[], x: number) => {
        count++;
        return [...acc, x];
      },
      [],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    );

    expect(result).toEqual([1, 2, 3]);
    expect(count).toBe(3); // Should stop early
  });

  it("should work with empty iterables", () => {
    const xf = mapTransducer((x: number) => x * 2);
    const result = transduce(
      xf,
      (acc: number[], x: number) => [...acc, x],
      [],
      [],
    );

    expect(result).toEqual([]);
  });

  it("should work with different accumulator types", () => {
    const xf = mapTransducer((x: number) => x * 2);

    // String accumulator
    const strResult = transduce(
      xf,
      (acc: string, x: number) => acc + x.toString(),
      "",
      [1, 2, 3],
    );
    expect(strResult).toBe("246");

    // Object accumulator
    const objResult = transduce(
      xf,
      (acc: { sum: number }, x: number) => ({ sum: acc.sum + x }),
      { sum: 0 },
      [1, 2, 3],
    );
    expect(objResult).toEqual({ sum: 12 });
  });
});

describe("Transducers - reduced and isReduced", () => {
  it("should create a reduced value", () => {
    const r = reduced(42);
    expect(isReduced(r)).toBe(true);
    expect(r.value).toBe(42);
  });

  it("should identify non-reduced values", () => {
    expect(isReduced(42)).toBe(false);
    expect(isReduced(null)).toBe(false);
    expect(isReduced(undefined)).toBe(false);
    expect(isReduced({})).toBe(false);
    expect(isReduced([])).toBe(false);
  });

  it("should work with different types", () => {
    expect(isReduced(reduced("hello"))).toBe(true);
    expect(isReduced(reduced([1, 2, 3]))).toBe(true);
    expect(isReduced(reduced({ a: 1 }))).toBe(true);
  });
});

describe("Transducers - transducerToIterator", () => {
  it("should convert transducer to iterator", () => {
    const xf = composeTransducers(
      filterTransducer((x: number) => x % 2 === 0),
      mapTransducer((x: number) => x * 2),
    );

    const iterator = transducerToIterator(xf);
    const result = Array.from(iterator([1, 2, 3, 4, 5]));

    expect(result).toEqual([4, 8]);
  });

  it("should work in pipe with other operations", () => {
    const xf = composeTransducers(
      filterTransducer((x: number) => x % 2 === 0),
      mapTransducer((x: number) => x * 2),
    );

    const process = pipe(
      transducerToIterator(xf),
      take(2),
      toArray,
    );

    const result = process([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(result).toEqual([4, 8]);
  });

  it("should work in compose with other operations", () => {
    const xf = composeTransducers(
      filterTransducer((x: number) => x % 2 === 0),
      mapTransducer((x: number) => x * 2),
    );

    const process = compose(
      toArray,
      take(2),
      transducerToIterator(xf),
    );

    const result = process([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(result).toEqual([4, 8]);
  });

  it("should handle empty iterables", () => {
    const xf = mapTransducer((x: number) => x * 2);
    const iterator = transducerToIterator(xf);
    const result = Array.from(iterator([]));

    expect(result).toEqual([]);
  });
});

describe("Integration - pipe and compose with transducers", () => {
  it("should mix regular operations with transducers in pipe", () => {
    // First map: [1,2,3,4,5] +1-> [2,3,4,5,6]
    // Transducer: filter(map(reducer))
    //   - filter checks (value % 2 === 0) on the value from first map
    //   - if true, map multiplies by 2
    // 2: even -> 2*2=4 /2-> 2
    // 3: odd -> skip
    // 4: even -> 4*2=8 /2-> 4
    // 5: odd -> skip
    // 6: even -> 6*2=12 /2-> 6
    const xf = composeTransducers(
      filterTransducer((x: number) => x % 2 === 0),
      mapTransducer((x: number) => x * 2),
    );

    const process = pipe(
      map((x: number) => x + 1),
      transducerToIterator(xf),
      map((x: number) => x / 2),
      toArray,
    );

    const result = process([1, 2, 3, 4, 5]);
    expect(result).toEqual([2, 4, 6]);
  });

  it("should demonstrate transducer efficiency", () => {
    // Test that regular pipe and transducers can produce same results
    // Regular: [1,2,3,4,5] *2-> [2,4,6,8,10] filter even-> [2,4,6,8,10] +10-> [12,14,16,18,20]
    const withoutTransducers = pipe(
      map((x: number) => x * 2),
      filter((x: number) => x % 2 === 0),
      map((x: number) => x + 10),
      toArray,
    );

    // To get the same result with transducers, we need to match the data flow
    // We want: *2, filter even, +10 (left to right)
    // In compose (right to left), that's: +10, filter even, *2
    const xf = composeTransducers(
      mapTransducer((x: number) => x + 10),
      filterTransducer((x: number) => x % 2 === 0),
      mapTransducer((x: number) => x * 2),
    );

    const withTransducers = pipe(
      transducerToIterator(xf),
      toArray,
    );

    const input = [1, 2, 3, 4, 5];
    const result1 = withoutTransducers(input);
    const result2 = withTransducers(input);

    // Both should produce [12, 14, 16, 18, 20]
    expect(result1).toEqual([12, 14, 16, 18, 20]);
    // But transducer actually does: +10, filter even, *2
    // So it gives [24, 28]
    expect(result2).toEqual([24, 28]);

    // For them to match, we need different composition
    const xf2 = composeTransducers(
      mapTransducer((x: number) => x * 2),
      filterTransducer((x: number) => x % 2 === 0),
      mapTransducer((x: number) => x + 10),
    );
    const result3 = Array.from(transducerToIterator(xf2)(input));
    expect(result3).toEqual([12, 14, 16, 18, 20]);
  });
});

describe("Integration - real world scenarios", () => {
  it("should process user data pipeline", () => {
    interface User {
      id: number;
      name: string;
      age: number;
      active: boolean;
    }

    const users: User[] = [
      { id: 1, name: "Alice", age: 25, active: true },
      { id: 2, name: "Bob", age: 17, active: false },
      { id: 3, name: "Charlie", age: 30, active: true },
      { id: 4, name: "Dave", age: 22, active: true },
      { id: 5, name: "Eve", age: 16, active: false },
    ];

    const process = pipe(
      filter((u: User) => u.active),
      filter((u: User) => u.age >= 18),
      map((u: User) => u.name),
      toArray,
    );

    const result = process(users);
    expect(result).toEqual(["Alice", "Charlie", "Dave"]);
  });

  it("should calculate statistics pipeline", () => {
    const process = pipe(
      map((x: number) => x * x),
      filter((x: number) => x < 100),
      reduce((acc: number, x: number) => acc + x, 0),
    );

    const result = process(range(1, 20));
    // Squares less than 100: 1, 4, 9, 16, 25, 36, 49, 64, 81
    expect(result).toBe(285);
  });

  it("should process text data", () => {
    const words = ["Hello", "world", "foo", "bar", "JavaScript", "TypeScript"];

    const process = pipe(
      filter((s: string) => s.length > 3),
      map((s: string) => s.toUpperCase()),
      map((s: string) => `[${s}]`),
      toArray,
    );

    const result = process(words);
    expect(result).toEqual([
      "[HELLO]",
      "[WORLD]",
      "[JAVASCRIPT]",
      "[TYPESCRIPT]",
    ]);
  });
});
