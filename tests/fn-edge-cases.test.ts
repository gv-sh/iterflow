import { describe, it, expect } from 'vitest';
import * as fn from '../src/fn/index.js';

describe('Functional API - Edge Cases', () => {
  describe('Statistical Operations - Edge Cases', () => {
    describe('sum', () => {
      it('should handle NaN values', () => {
        const result = fn.sum([1, NaN, 3]);
        expect(result).toBeNaN();
      });

      it('should handle Infinity', () => {
        expect(fn.sum([1, Infinity, 3])).toBe(Infinity);
        expect(fn.sum([1, -Infinity, 3])).toBe(-Infinity);
      });

      it('should handle very large numbers', () => {
        const large = Number.MAX_SAFE_INTEGER;
        expect(fn.sum([large, 1])).toBe(large + 1);
      });

      it('should handle very small numbers', () => {
        expect(fn.sum([0.1, 0.2])).toBeCloseTo(0.3);
      });
    });

    describe('mean', () => {
      it('should handle NaN values', () => {
        const result = fn.mean([1, NaN, 3]);
        expect(result).toBeNaN();
      });

      it('should handle Infinity', () => {
        expect(fn.mean([1, Infinity, 3])).toBe(Infinity);
      });

      it('should handle single element', () => {
        expect(fn.mean([42])).toBe(42);
      });

      it('should handle negative numbers', () => {
        expect(fn.mean([-1, -2, -3])).toBe(-2);
      });
    });

    describe('min', () => {
      it('should handle NaN values', () => {
        // NaN comparisons are always false, so NaN becomes the min
        // but the implementation will skip NaN in comparisons
        const result = fn.min([1, NaN, 3]);
        // Implementation returns first non-NaN value as min
        expect(result).toBe(1);
      });

      it('should handle Infinity', () => {
        expect(fn.min([1, Infinity, 3])).toBe(1);
        expect(fn.min([Infinity, -Infinity])).toBe(-Infinity);
      });

      it('should handle negative zero', () => {
        // JavaScript's < comparison doesn't distinguish between 0 and -0
        const result = fn.min([0, -0]);
        expect(result === 0 || result === -0).toBe(true);
      });
    });

    describe('max', () => {
      it('should handle NaN values', () => {
        // NaN comparisons are always false, implementation returns last non-NaN
        const result = fn.max([1, NaN, 3]);
        expect(result).toBe(3);
      });

      it('should handle Infinity', () => {
        expect(fn.max([1, Infinity, 3])).toBe(Infinity);
        expect(fn.max([Infinity, -Infinity])).toBe(Infinity);
      });

      it('should handle negative zero', () => {
        // JavaScript's > comparison doesn't distinguish between 0 and -0
        const result = fn.max([0, -0]);
        expect(Object.is(result, 0) || Object.is(result, -0)).toBe(true);
      });
    });

    describe('median', () => {
      it('should handle two elements', () => {
        expect(fn.median([1, 3])).toBe(2);
      });

      it('should handle unsorted data', () => {
        expect(fn.median([5, 1, 3, 9, 2])).toBe(3);
      });

      it('should handle duplicates', () => {
        expect(fn.median([1, 2, 2, 2, 3])).toBe(2);
      });

      it('should handle negative numbers', () => {
        expect(fn.median([-5, -1, -3])).toBe(-3);
      });
    });

    describe('variance', () => {
      it('should be 0 for single element', () => {
        expect(fn.variance([42])).toBe(0);
      });

      it('should be 0 for identical elements', () => {
        expect(fn.variance([5, 5, 5])).toBe(0);
      });

      it('should handle negative numbers', () => {
        const result = fn.variance([-1, -2, -3]);
        expect(result).toBeGreaterThan(0);
      });
    });

    describe('stdDev', () => {
      it('should be 0 for single element', () => {
        expect(fn.stdDev([42])).toBe(0);
      });

      it('should be 0 for identical elements', () => {
        expect(fn.stdDev([5, 5, 5])).toBe(0);
      });
    });

    describe('percentile', () => {
      it('should handle edge percentiles', () => {
        expect(fn.percentile([1, 2, 3, 4, 5], 0)).toBe(1);
        expect(fn.percentile([1, 2, 3, 4, 5], 100)).toBe(5);
      });

      it('should handle single element', () => {
        expect(fn.percentile([42], 0)).toBe(42);
        expect(fn.percentile([42], 50)).toBe(42);
        expect(fn.percentile([42], 100)).toBe(42);
      });

      it('should throw for out of range percentile', () => {
        expect(() => fn.percentile([1, 2, 3], -0.1)).toThrow();
        expect(() => fn.percentile([1, 2, 3], 100.1)).toThrow();
      });

      it('should handle fractional percentiles', () => {
        const result = fn.percentile([1, 2, 3, 4, 5], 33.33);
        expect(result).toBeGreaterThan(1);
        expect(result).toBeLessThan(5);
      });
    });

    describe('mode', () => {
      it('should handle single element', () => {
        expect(fn.mode([42])).toEqual([42]);
      });

      it('should handle negative numbers', () => {
        expect(fn.mode([-1, -1, -2, -3])).toEqual([-1]);
      });

      it('should handle floats', () => {
        expect(fn.mode([1.5, 1.5, 2.5])).toEqual([1.5]);
      });
    });

    describe('quartiles', () => {
      it('should handle two elements', () => {
        const result = fn.quartiles([1, 2]);
        expect(result).toBeDefined();
        expect(result!.Q1).toBeCloseTo(1.25);
        expect(result!.Q2).toBeCloseTo(1.5);
        expect(result!.Q3).toBeCloseTo(1.75);
      });

      it('should handle four elements', () => {
        const result = fn.quartiles([1, 2, 3, 4]);
        expect(result).toBeDefined();
      });
    });

    describe('span', () => {
      it('should handle negative range', () => {
        expect(fn.span([-10, 10])).toBe(20);
      });

      it('should handle floats', () => {
        expect(fn.span([1.5, 2.5])).toBeCloseTo(1.0);
      });
    });

    describe('product', () => {
      it('should handle single element', () => {
        expect(fn.product([42])).toBe(42);
      });

      it('should handle negative numbers', () => {
        expect(fn.product([-2, -3])).toBe(6);
        expect(fn.product([-2, 3])).toBe(-6);
      });

      it('should handle floats', () => {
        expect(fn.product([0.5, 2])).toBe(1);
      });
    });

    describe('covariance', () => {
      it('should handle single pair', () => {
        const result = fn.covariance([1], [2]);
        expect(result).toBe(0);
      });

      it('should handle identical sequences', () => {
        const result = fn.covariance([1, 2, 3], [1, 2, 3]);
        expect(result).toBeGreaterThanOrEqual(0);
      });

      it('should return undefined for mismatched lengths', () => {
        expect(fn.covariance([1, 2], [1, 2, 3])).toBeUndefined();
      });
    });

    describe('correlation', () => {
      it('should handle identical sequences', () => {
        const result = fn.correlation([1, 2, 3], [1, 2, 3]);
        expect(result).toBeCloseTo(1);
      });

      it('should handle perfectly anti-correlated sequences', () => {
        const result = fn.correlation([1, 2, 3], [3, 2, 1]);
        expect(result).toBeCloseTo(-1);
      });

      it('should return undefined for zero variance', () => {
        expect(fn.correlation([1, 1, 1], [2, 3, 4])).toBeUndefined();
      });
    });
  });

  describe('Transforming Operations - Edge Cases', () => {
    describe('map', () => {
      it('should handle empty iterator', () => {
        const double = fn.map((x: number) => x * 2);
        expect(Array.from(double([]))).toEqual([]);
      });

      it('should handle type transformations', () => {
        const toString = fn.map((x: number) => x.toString());
        expect(Array.from(toString([1, 2, 3]))).toEqual(['1', '2', '3']);
      });
    });

    describe('filter', () => {
      it('should handle empty result', () => {
        const impossibleFilter = fn.filter((x: number) => x > Number.MAX_VALUE);
        expect(Array.from(impossibleFilter([1, 2, 3]))).toEqual([]);
      });

      it('should handle all passing', () => {
        const alwaysTrue = fn.filter((x: number) => true);
        expect(Array.from(alwaysTrue([1, 2, 3]))).toEqual([1, 2, 3]);
      });
    });

    describe('take', () => {
      it('should handle negative limit', () => {
        const takeNegative = fn.take(-1);
        expect(Array.from(takeNegative([1, 2, 3]))).toEqual([]);
      });

      it('should handle zero limit', () => {
        const takeZero = fn.take(0);
        expect(Array.from(takeZero([1, 2, 3]))).toEqual([]);
      });

      it('should handle limit larger than array', () => {
        const takeHundred = fn.take(100);
        expect(Array.from(takeHundred([1, 2, 3]))).toEqual([1, 2, 3]);
      });
    });

    describe('drop', () => {
      it('should handle negative count', () => {
        const dropNegative = fn.drop(-1);
        expect(Array.from(dropNegative([1, 2, 3]))).toEqual([1, 2, 3]);
      });

      it('should handle zero count', () => {
        const dropZero = fn.drop(0);
        expect(Array.from(dropZero([1, 2, 3]))).toEqual([1, 2, 3]);
      });

      it('should handle count larger than array', () => {
        const dropHundred = fn.drop(100);
        expect(Array.from(dropHundred([1, 2, 3]))).toEqual([]);
      });
    });

    describe('flatMap', () => {
      it('should handle empty arrays from mapper', () => {
        const filterMap = fn.flatMap((x: number) => []);
        expect(Array.from(filterMap([1, 2, 3]))).toEqual([]);
      });

      it('should handle nested iterables', () => {
        const duplicate = fn.flatMap((x: number) => [x, x]);
        expect(Array.from(duplicate([1, 2]))).toEqual([1, 1, 2, 2]);
      });
    });

    describe('intersperse', () => {
      it('should handle two elements', () => {
        const addSep = fn.intersperse('|');
        expect(Array.from(addSep(['a', 'b']))).toEqual(['a', '|', 'b']);
      });

      it('should handle empty array', () => {
        const addSep = fn.intersperse('|');
        expect(Array.from(addSep([]))).toEqual([]);
      });

      it('should handle single element', () => {
        const addSep = fn.intersperse('|');
        expect(Array.from(addSep(['a']))).toEqual(['a']);
      });
    });

    describe('reverse', () => {
      it('should handle empty array', () => {
        const rev = fn.reverse<number>();
        expect(Array.from(rev([]))).toEqual([]);
      });

      it('should handle single element', () => {
        const rev = fn.reverse<number>();
        expect(Array.from(rev([42]))).toEqual([42]);
      });

      it('should handle two elements', () => {
        const rev = fn.reverse<number>();
        expect(Array.from(rev([1, 2]))).toEqual([2, 1]);
      });
    });

    describe('sort', () => {
      it('should handle mixed positive and negative', () => {
        expect(Array.from(fn.sort([-3, 1, -4, 1, 5]))).toEqual([-4, -3, 1, 1, 5]);
      });

      it('should handle single element', () => {
        expect(Array.from(fn.sort([42]))).toEqual([42]);
      });

      it('should handle duplicates', () => {
        expect(Array.from(fn.sort([2, 1, 2, 1]))).toEqual([1, 1, 2, 2]);
      });
    });

    describe('sortBy', () => {
      it('should handle reverse sort', () => {
        const sortDesc = fn.sortBy((a: number, b: number) => b - a);
        expect(Array.from(sortDesc([1, 2, 3]))).toEqual([3, 2, 1]);
      });

      it('should handle custom object sort', () => {
        type Person = { age: number };
        const sortByAge = fn.sortBy((a: Person, b: Person) => a.age - b.age);
        const people = [{ age: 30 }, { age: 20 }, { age: 25 }];
        expect(Array.from(sortByAge(people))).toEqual([
          { age: 20 },
          { age: 25 },
          { age: 30 },
        ]);
      });
    });
  });

  describe('Windowing Operations - Edge Cases', () => {
    describe('window', () => {
      it('should throw for window size 0', () => {
        expect(() => fn.window(0)).toThrow('size must be at least 1');
      });

      it('should throw for negative window size', () => {
        expect(() => fn.window(-1)).toThrow('size must be at least 1');
      });

      it('should handle window size 1', () => {
        const windowOne = fn.window(1);
        expect(Array.from(windowOne([1, 2, 3]))).toEqual([[1], [2], [3]]);
      });

      it('should handle window size equal to array length', () => {
        const windowThree = fn.window(3);
        expect(Array.from(windowThree([1, 2, 3]))).toEqual([[1, 2, 3]]);
      });

      it('should handle window size greater than array length', () => {
        const windowTen = fn.window(10);
        expect(Array.from(windowTen([1, 2, 3]))).toEqual([]);
      });
    });

    describe('chunk', () => {
      it('should throw for chunk size 0', () => {
        expect(() => fn.chunk(0)).toThrow('size must be at least 1');
      });

      it('should throw for negative chunk size', () => {
        expect(() => fn.chunk(-1)).toThrow('size must be at least 1');
      });

      it('should handle chunk size 1', () => {
        const chunkOne = fn.chunk(1);
        expect(Array.from(chunkOne([1, 2, 3]))).toEqual([[1], [2], [3]]);
      });

      it('should handle last partial chunk', () => {
        const chunkTwo = fn.chunk(2);
        expect(Array.from(chunkTwo([1, 2, 3, 4, 5]))).toEqual([
          [1, 2],
          [3, 4],
          [5],
        ]);
      });
    });

    describe('pairwise', () => {
      it('should handle empty array', () => {
        expect(Array.from(fn.pairwise([]))).toEqual([]);
      });

      it('should handle single element', () => {
        expect(Array.from(fn.pairwise([1]))).toEqual([]);
      });

      it('should handle two elements', () => {
        expect(Array.from(fn.pairwise([1, 2]))).toEqual([[1, 2]]);
      });
    });
  });

  describe('Combining Operations - Edge Cases', () => {
    describe('zip', () => {
      it('should handle both empty', () => {
        expect(Array.from(fn.zip([], []))).toEqual([]);
      });

      it('should handle one empty', () => {
        expect(Array.from(fn.zip([1, 2], []))).toEqual([]);
        expect(Array.from(fn.zip([], ['a', 'b']))).toEqual([]);
      });

      it('should handle different lengths', () => {
        expect(Array.from(fn.zip([1, 2, 3], ['a', 'b']))).toEqual([
          [1, 'a'],
          [2, 'b'],
        ]);
      });
    });

    describe('zipWith', () => {
      it('should handle complex operations', () => {
        const multiply = (a: number, b: number) => a * b;
        expect(Array.from(fn.zipWith([1, 2, 3], [4, 5, 6], multiply))).toEqual([
          4, 10, 18,
        ]);
      });

      it('should handle empty arrays', () => {
        expect(
          Array.from(fn.zipWith([], [], (a, b) => a + b))
        ).toEqual([]);
      });
    });
  });

  describe('Terminal Operations - Edge Cases', () => {
    describe('find', () => {
      it('should return first match', () => {
        const findEven = fn.find((x: number) => x % 2 === 0);
        expect(findEven([1, 3, 4, 6])).toBe(4);
      });

      it('should return undefined for no match', () => {
        const findLarge = fn.find((x: number) => x > 100);
        expect(findLarge([1, 2, 3])).toBeUndefined();
      });

      it('should work on empty array', () => {
        const findAny = fn.find((x: number) => true);
        expect(findAny([])).toBeUndefined();
      });
    });

    describe('findIndex', () => {
      it('should return first matching index', () => {
        const findEvenIndex = fn.findIndex((x: number) => x % 2 === 0);
        expect(findEvenIndex([1, 3, 4, 6])).toBe(2);
      });

      it('should return -1 for no match', () => {
        const findLargeIndex = fn.findIndex((x: number) => x > 100);
        expect(findLargeIndex([1, 2, 3])).toBe(-1);
      });

      it('should return -1 for empty array', () => {
        const findAnyIndex = fn.findIndex((x: number) => true);
        expect(findAnyIndex([])).toBe(-1);
      });
    });

    describe('nth', () => {
      it('should handle 0 index', () => {
        const getFirst = fn.nth(0);
        expect(getFirst([1, 2, 3])).toBe(1);
      });

      it('should return undefined for out of bounds', () => {
        const getTenth = fn.nth(10);
        expect(getTenth([1, 2, 3])).toBeUndefined();
      });

      it('should return undefined for negative index', () => {
        const getNegative = fn.nth(-1);
        expect(getNegative([1, 2, 3])).toBeUndefined();
      });

      it('should return undefined for empty array', () => {
        const getFirst = fn.nth(0);
        expect(getFirst([])).toBeUndefined();
      });
    });

    describe('first', () => {
      it('should use default for empty', () => {
        expect(fn.first([], 99)).toBe(99);
      });

      it('should not use default for non-empty', () => {
        expect(fn.first([1, 2], 99)).toBe(1);
      });
    });

    describe('last', () => {
      it('should use default for empty', () => {
        expect(fn.last([], 99)).toBe(99);
      });

      it('should not use default for non-empty', () => {
        expect(fn.last([1, 2], 99)).toBe(2);
      });

      it('should handle single element', () => {
        expect(fn.last([42])).toBe(42);
      });
    });
  });

  describe('Generator Functions - Edge Cases', () => {
    describe('range', () => {
      it('should handle empty range', () => {
        expect(Array.from(fn.range(0))).toEqual([]);
        expect(Array.from(fn.range(5, 5))).toEqual([]);
      });

      it('should handle negative range', () => {
        expect(Array.from(fn.range(5, 0, -1))).toEqual([5, 4, 3, 2, 1]);
      });

      it('should handle fractional step', () => {
        expect(Array.from(fn.range(0, 1, 0.25))).toEqual([0, 0.25, 0.5, 0.75]);
      });

      it('should throw for zero step', () => {
        expect(() => Array.from(fn.range(0, 10, 0))).toThrow(
          'step cannot be zero'
        );
      });

      it('should handle negative start and stop', () => {
        expect(Array.from(fn.range(-3, 0))).toEqual([-3, -2, -1]);
      });
    });

    describe('repeat', () => {
      it('should handle zero repetitions', () => {
        expect(Array.from(fn.repeat('x', 0))).toEqual([]);
      });

      it('should handle one repetition', () => {
        expect(Array.from(fn.repeat('x', 1))).toEqual(['x']);
      });

      it('should create infinite sequence when times omitted', () => {
        const infinite = fn.repeat(1);
        const takeThree = fn.take(3);
        expect(Array.from(takeThree(infinite))).toEqual([1, 1, 1]);
      });
    });
  });

  describe('Interleaving Operations - Edge Cases', () => {
    describe('interleave', () => {
      it('should handle no arguments', () => {
        expect(Array.from(fn.interleave())).toEqual([]);
      });

      it('should handle single iterable', () => {
        expect(Array.from(fn.interleave([1, 2, 3]))).toEqual([1, 2, 3]);
      });

      it('should handle empty iterables', () => {
        expect(Array.from(fn.interleave([], [], []))).toEqual([]);
      });

      it('should handle very different lengths', () => {
        expect(Array.from(fn.interleave([1], [2, 3, 4, 5]))).toEqual([
          1, 2, 3, 4, 5,
        ]);
      });
    });

    describe('merge', () => {
      it('should handle empty arrays', () => {
        expect(Array.from(fn.merge())).toEqual([]);
        expect(Array.from(fn.merge([], []))).toEqual([]);
      });

      it('should handle single array', () => {
        expect(Array.from(fn.merge([1, 2, 3]))).toEqual([1, 2, 3]);
      });

      it('should handle custom comparator', () => {
        const desc = (a: number, b: number) => b - a;
        expect(Array.from(fn.merge(desc, [5, 3, 1], [6, 4, 2]))).toEqual([
          6, 5, 4, 3, 2, 1,
        ]);
      });

      it('should handle duplicate values', () => {
        expect(Array.from(fn.merge([1, 1, 2], [1, 2, 2]))).toEqual([
          1, 1, 1, 2, 2, 2,
        ]);
      });
    });

    describe('chain', () => {
      it('should handle no arguments', () => {
        expect(Array.from(fn.chain())).toEqual([]);
      });

      it('should handle single array', () => {
        expect(Array.from(fn.chain([1, 2, 3]))).toEqual([1, 2, 3]);
      });

      it('should handle empty arrays', () => {
        expect(Array.from(fn.chain([], [], []))).toEqual([]);
      });

      it('should handle mix of empty and non-empty', () => {
        expect(Array.from(fn.chain([], [1, 2], [], [3, 4]))).toEqual([
          1, 2, 3, 4,
        ]);
      });
    });
  });

  describe('Special Iterables', () => {
    it('should work with Sets', () => {
      const set = new Set([1, 2, 3, 2, 1]);
      expect(fn.sum(set)).toBe(6); // Set has 1, 2, 3
      expect(fn.count(set)).toBe(3);
    });

    it('should work with Maps', () => {
      const map = new Map([
        ['a', 1],
        ['b', 2],
      ]);
      expect(fn.count(map)).toBe(2);
    });

    it('should work with generator functions', () => {
      function* gen() {
        yield 1;
        yield 2;
        yield 3;
      }
      expect(fn.sum(gen())).toBe(6);
    });

    it('should work with strings as character iterables', () => {
      const str = 'hello';
      expect(fn.count(str)).toBe(5);
      expect(Array.from(fn.distinct(str))).toEqual(['h', 'e', 'l', 'o']);
    });

    it('should work with typed arrays', () => {
      const arr = new Int32Array([1, 2, 3, 4, 5]);
      expect(fn.sum(arr)).toBe(15);
      expect(fn.mean(arr)).toBe(3);
    });
  });

  describe('Infinite Sequences', () => {
    it('should handle infinite repeat with take', () => {
      const infinite = fn.repeat(5);
      const takeThree = fn.take(3);
      expect(Array.from(takeThree(infinite))).toEqual([5, 5, 5]);
    });

    it('should handle infinite repeat with takeWhile', () => {
      let count = 0;
      const infinite = fn.repeat(1);
      const takeWhileLessThanFive = fn.takeWhile(() => {
        count++;
        return count <= 5;
      });
      expect(Array.from(takeWhileLessThanFive(infinite))).toEqual([
        1, 1, 1, 1, 1,
      ]);
    });

    it('should handle infinite range with take', () => {
      // Create a large range that's effectively infinite for this test
      const largeRange = fn.range(0, Number.MAX_SAFE_INTEGER, 1);
      const takeTen = fn.take(10);
      expect(Array.from(takeTen(largeRange))).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('Error Handling', () => {
    it('should throw for invalid percentile range', () => {
      expect(() => fn.percentile([1, 2, 3], -1)).toThrow(
        'percentile must be between 0 and 100'
      );
      expect(() => fn.percentile([1, 2, 3], 101)).toThrow(
        'percentile must be between 0 and 100'
      );
    });

    it('should throw for invalid window size', () => {
      expect(() => fn.window(0)).toThrow('size must be at least 1');
      expect(() => fn.window(-1)).toThrow('size must be at least 1');
    });

    it('should throw for invalid chunk size', () => {
      expect(() => fn.chunk(0)).toThrow('size must be at least 1');
      expect(() => fn.chunk(-1)).toThrow('size must be at least 1');
    });

    it('should throw for zero step in range', () => {
      expect(() => Array.from(fn.range(0, 10, 0))).toThrow(
        'step cannot be zero'
      );
    });
  });
});
