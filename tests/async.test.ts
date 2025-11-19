import { describe, expect, it } from "vitest";
import { asyncIter, AsyncIterflow } from "../src/index.js";

// Helper function to create an async iterable
async function* asyncGen<T>(...values: T[]): AsyncGenerator<T> {
  for (const value of values) {
    yield value;
  }
}

// Helper to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("AsyncIterflow", () => {
  describe("Basic operations", () => {
    it("should create from async iterable", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3)).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it("should create from sync iterable", async () => {
      const result = await asyncIter([1, 2, 3]).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it("should work with for await...of", async () => {
      const result: number[] = [];
      for await (const value of asyncIter(asyncGen(1, 2, 3))) {
        result.push(value);
      }
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("Transformation operations", () => {
    it("should map values", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3))
        .map(async (x) => x * 2)
        .toArray();
      expect(result).toEqual([2, 4, 6]);
    });

    it("should filter values", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5))
        .filter(async (x) => x % 2 === 0)
        .toArray();
      expect(result).toEqual([2, 4]);
    });

    it("should flatMap values", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3))
        .flatMap(async (x) => [x, x * 2])
        .toArray();
      expect(result).toEqual([1, 2, 2, 4, 3, 6]);
    });

    it("should take first n elements", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5))
        .take(3)
        .toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it("should drop first n elements", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5))
        .drop(2)
        .toArray();
      expect(result).toEqual([3, 4, 5]);
    });

    it("should concatenate iterables", async () => {
      const result = await asyncIter(asyncGen(1, 2))
        .concat(asyncGen(3, 4), [5, 6])
        .toArray();
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should intersperse values", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3))
        .intersperse(0)
        .toArray();
      expect(result).toEqual([1, 0, 2, 0, 3]);
    });

    it("should scan values", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4))
        .scan(async (acc, x) => acc + x, 0)
        .toArray();
      expect(result).toEqual([0, 1, 3, 6, 10]);
    });

    it("should enumerate values", async () => {
      const result = await asyncIter(asyncGen("a", "b", "c"))
        .enumerate()
        .toArray();
      expect(result).toEqual([
        [0, "a"],
        [1, "b"],
        [2, "c"],
      ]);
    });

    it("should reverse values", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5))
        .reverse()
        .toArray();
      expect(result).toEqual([5, 4, 3, 2, 1]);
    });

    it("should sort values", async () => {
      const result = await asyncIter(asyncGen(3, 1, 4, 1, 5))
        .sort()
        .toArray();
      expect(result).toEqual([1, 1, 3, 4, 5]);
    });

    it("should sort with custom comparator", async () => {
      const result = await asyncIter(asyncGen(3, 1, 4, 1, 5))
        .sortBy((a, b) => b - a)
        .toArray();
      expect(result).toEqual([5, 4, 3, 1, 1]);
    });
  });

  describe("Terminal operations", () => {
    it("should count elements", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).count();
      expect(result).toBe(5);
    });

    it("should forEach", async () => {
      const results: number[] = [];
      await asyncIter(asyncGen(1, 2, 3)).forEach(async (x) => {
        results.push(x * 2);
      });
      expect(results).toEqual([2, 4, 6]);
    });

    it("should reduce values", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4)).reduce(
        async (acc, x) => acc + x,
        0
      );
      expect(result).toBe(10);
    });

    it("should find element", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).find(
        async (x) => x > 3
      );
      expect(result).toBe(4);
    });

    it("should find index", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).findIndex(
        async (x) => x > 3
      );
      expect(result).toBe(3);
    });

    it("should test some", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).some(
        async (x) => x > 3
      );
      expect(result).toBe(true);
    });

    it("should test every", async () => {
      const result = await asyncIter(asyncGen(2, 4, 6)).every(
        async (x) => x % 2 === 0
      );
      expect(result).toBe(true);
    });

    it("should get first element", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3)).first();
      expect(result).toBe(1);
    });

    it("should get last element", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3)).last();
      expect(result).toBe(3);
    });

    it("should get nth element", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).nth(2);
      expect(result).toBe(3);
    });

    it("should check if empty", async () => {
      const empty = await asyncIter(asyncGen()).isEmpty();
      const notEmpty = await asyncIter(asyncGen(1)).isEmpty();
      expect(empty).toBe(true);
      expect(notEmpty).toBe(false);
    });

    it("should check includes", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).includes(3);
      expect(result).toBe(true);
    });
  });

  describe("Statistical operations", () => {
    it("should calculate sum", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).sum();
      expect(result).toBe(15);
    });

    it("should calculate mean", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).mean();
      expect(result).toBe(3);
    });

    it("should find min", async () => {
      const result = await asyncIter(asyncGen(3, 1, 4, 1, 5)).min();
      expect(result).toBe(1);
    });

    it("should find max", async () => {
      const result = await asyncIter(asyncGen(3, 1, 4, 1, 5)).max();
      expect(result).toBe(5);
    });

    it("should calculate median", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).median();
      expect(result).toBe(3);
    });

    it("should calculate variance", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).variance();
      expect(result).toBe(2);
    });

    it("should calculate standard deviation", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).stdDev();
      expect(result).toBeCloseTo(Math.sqrt(2));
    });

    it("should calculate percentile", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).percentile(50);
      expect(result).toBe(3);
    });

    it("should find mode", async () => {
      const result = await asyncIter(asyncGen(1, 2, 2, 3, 3, 3)).mode();
      expect(result).toEqual([3]);
    });

    it("should calculate quartiles", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5, 6, 7, 8, 9))
        .quartiles();
      expect(result).toEqual({ Q1: 3, Q2: 5, Q3: 7 });
    });

    it("should calculate span", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).span();
      expect(result).toBe(4);
    });

    it("should calculate product", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).product();
      expect(result).toBe(120);
    });

    it("should calculate covariance", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).covariance([
        2, 4, 6, 8, 10,
      ]);
      expect(result).toBe(4);
    });

    it("should calculate correlation", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).correlation([
        2, 4, 6, 8, 10,
      ]);
      expect(result).toBeCloseTo(1, 10);
    });
  });

  describe("Windowing operations", () => {
    it("should create sliding windows", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5))
        .window(3)
        .toArray();
      expect(result).toEqual([
        [1, 2, 3],
        [2, 3, 4],
        [3, 4, 5],
      ]);
    });

    it("should create chunks", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5))
        .chunk(2)
        .toArray();
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("should create pairwise", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4))
        .pairwise()
        .toArray();
      expect(result).toEqual([
        [1, 2],
        [2, 3],
        [3, 4],
      ]);
    });
  });

  describe("Set operations", () => {
    it("should remove duplicates", async () => {
      const result = await asyncIter(asyncGen(1, 2, 2, 3, 1, 4))
        .distinct()
        .toArray();
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it("should remove duplicates by key", async () => {
      const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 1, name: "Charlie" },
      ];
      const result = await asyncIter(asyncGen(...users))
        .distinctBy(async (u) => u.id)
        .toArray();
      expect(result).toEqual([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);
    });
  });

  describe("Utility operations", () => {
    it("should tap into stream", async () => {
      const tapped: number[] = [];
      const result = await asyncIter(asyncGen(1, 2, 3))
        .tap(async (x) => tapped.push(x))
        .map(async (x) => x * 2)
        .toArray();
      expect(tapped).toEqual([1, 2, 3]);
      expect(result).toEqual([2, 4, 6]);
    });

    it("should takeWhile", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 1, 2))
        .takeWhile(async (x) => x < 4)
        .toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it("should dropWhile", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 1, 2))
        .dropWhile(async (x) => x < 3)
        .toArray();
      expect(result).toEqual([3, 4, 1, 2]);
    });
  });

  describe("Grouping operations", () => {
    it("should partition", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5)).partition(
        async (x) => x % 2 === 0
      );
      expect(result).toEqual([
        [2, 4],
        [1, 3, 5],
      ]);
    });

    it("should groupBy", async () => {
      const result = await asyncIter(
        asyncGen("alice", "bob", "charlie", "dave")
      ).groupBy(async (name) => name.length);
      expect(result).toEqual(
        new Map([
          [5, ["alice"]],
          [3, ["bob"]],
          [7, ["charlie"]],
          [4, ["dave"]],
        ])
      );
    });
  });

  describe("Parallel operations", () => {
    it("should map in parallel", async () => {
      const start = Date.now();
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5))
        .mapParallel(async (x) => {
          await delay(10);
          return x * 2;
        }, 3)
        .toArray();
      const duration = Date.now() - start;

      expect(result).toEqual([2, 4, 6, 8, 10]);
      // Should be faster than sequential (50ms) due to parallel execution
      expect(duration).toBeLessThan(40);
    });

    it("should filter in parallel", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5))
        .filterParallel(async (x) => {
          await delay(5);
          return x % 2 === 0;
        }, 3)
        .toArray();

      expect(result).toEqual([2, 4]);
    });

    it("should flatMap in parallel", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3))
        .flatMapParallel(async (x) => {
          await delay(5);
          return [x, x * 2];
        }, 2)
        .toArray();

      expect(result).toEqual([1, 2, 2, 4, 3, 6]);
    });
  });

  describe("Backpressure handling", () => {
    it("should buffer elements", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5))
        .buffer(2)
        .toArray();
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("should throttle stream", async () => {
      const start = Date.now();
      const result = await asyncIter(asyncGen(1, 2, 3))
        .throttle(20)
        .toArray();
      const duration = Date.now() - start;

      expect(result).toEqual([1, 2, 3]);
      // Should take at least 40ms (2 * 20ms between emissions)
      expect(duration).toBeGreaterThanOrEqual(35);
    });
  });

  describe("Error handling", () => {
    it("should catch errors and continue", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3))
        .map(async (x) => {
          if (x === 2) throw new Error("Error!");
          return x;
        })
        .catchError(async () => [-1])
        .toArray();

      // The error occurs during iteration, so we get partial results
      expect(result).toContain(1);
    });
  });

  describe("Helper functions", () => {
    it("should zip iterables", async () => {
      const result = await asyncIter
        .zip(asyncGen(1, 2, 3), asyncGen("a", "b", "c"))
        .toArray();
      expect(result).toEqual([
        [1, "a"],
        [2, "b"],
        [3, "c"],
      ]);
    });

    it("should zipWith function", async () => {
      const result = await asyncIter
        .zipWith(asyncGen(1, 2, 3), asyncGen(10, 20, 30), async (a, b) => a + b)
        .toArray();
      expect(result).toEqual([11, 22, 33]);
    });

    it("should generate range", async () => {
      const result = await asyncIter.range(5).toArray();
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });

    it("should repeat values", async () => {
      const result = await asyncIter.repeat("x", 3).toArray();
      expect(result).toEqual(["x", "x", "x"]);
    });

    it("should interleave iterables", async () => {
      const result = await asyncIter
        .interleave(asyncGen(1, 2, 3), asyncGen(4, 5, 6))
        .toArray();
      expect(result).toEqual([1, 4, 2, 5, 3, 6]);
    });

    it("should merge sorted iterables", async () => {
      const result = await asyncIter
        .merge(asyncGen(1, 3, 5), asyncGen(2, 4, 6))
        .toArray();
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should chain iterables", async () => {
      const result = await asyncIter
        .chain(asyncGen(1, 2), asyncGen(3, 4), [5, 6])
        .toArray();
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should create from generator", async () => {
      const fibonacci = asyncIter.fromGenerator(async function* () {
        let [a, b] = [0, 1];
        for (let i = 0; i < 10; i++) {
          yield a;
          [a, b] = [b, a + b];
        }
      });
      const result = await fibonacci.toArray();
      expect(result).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
    });

    it("should create from promise", async () => {
      const result = await asyncIter
        .fromPromise(Promise.resolve(42))
        .toArray();
      expect(result).toEqual([42]);
    });

    it("should create from promises", async () => {
      const promises = [
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ];
      const result = await asyncIter.fromPromises(promises).toArray();
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("Complex pipelines", () => {
    it("should handle complex async pipeline", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
        .filter(async (x) => x % 2 === 0)
        .map(async (x) => x * 2)
        .take(3)
        .toArray();

      expect(result).toEqual([4, 8, 12]);
    });

    it("should handle parallel processing in pipeline", async () => {
      const result = await asyncIter(asyncGen(1, 2, 3, 4, 5))
        .mapParallel(
          async (x) => {
            await delay(10);
            return x * 2;
          },
          3
        )
        .filter(async (x) => x > 5)
        .toArray();

      expect(result).toEqual([6, 8, 10]);
    });

    it("should handle statistical operations in pipeline", async () => {
      const mean = await asyncIter(asyncGen(1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
        .filter(async (x) => x % 2 === 0)
        .mean();

      expect(mean).toBe(6);
    });
  });
});
