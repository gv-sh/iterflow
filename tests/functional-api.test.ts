import { describe, it, expect } from 'vitest';
import * as fn from '../src/fn/index.js';

describe('Functional API', () => {
  // Statistical operations
  describe('Statistical Operations', () => {
    describe('sum', () => {
      it('should sum numbers', () => {
        expect(fn.sum([1, 2, 3, 4, 5])).toBe(15);
      });

      it('should return 0 for empty iterator', () => {
        expect(fn.sum([])).toBe(0);
      });

      it('should handle negative numbers', () => {
        expect(fn.sum([-1, -2, -3])).toBe(-6);
      });

      it('should handle decimals', () => {
        expect(fn.sum([1.5, 2.5, 3.0])).toBe(7);
      });

      it('should work with iterables', () => {
        const set = new Set([1, 2, 3]);
        expect(fn.sum(set)).toBe(6);
      });
    });

    describe('mean', () => {
      it('should calculate average', () => {
        expect(fn.mean([1, 2, 3, 4, 5])).toBe(3);
      });

      it('should return undefined for empty iterator', () => {
        expect(fn.mean([])).toBeUndefined();
      });

      it('should handle decimals', () => {
        expect(fn.mean([1, 2, 4])).toBeCloseTo(2.333333333333333);
      });

      it('should work with iterables', () => {
        const set = new Set([2, 4, 6]);
        expect(fn.mean(set)).toBe(4);
      });
    });

    describe('min', () => {
      it('should find minimum value', () => {
        expect(fn.min([3, 1, 4, 1, 5])).toBe(1);
      });

      it('should return undefined for empty iterator', () => {
        expect(fn.min([])).toBeUndefined();
      });

      it('should handle negative numbers', () => {
        expect(fn.min([2, -5, 3])).toBe(-5);
      });

      it('should handle single element', () => {
        expect(fn.min([42])).toBe(42);
      });
    });

    describe('max', () => {
      it('should find maximum value', () => {
        expect(fn.max([3, 1, 4, 1, 5])).toBe(5);
      });

      it('should return undefined for empty iterator', () => {
        expect(fn.max([])).toBeUndefined();
      });

      it('should handle negative numbers', () => {
        expect(fn.max([-2, -5, -3])).toBe(-2);
      });

      it('should handle single element', () => {
        expect(fn.max([42])).toBe(42);
      });
    });

    describe('count', () => {
      it('should count elements', () => {
        expect(fn.count([1, 2, 3])).toBe(3);
      });

      it('should return 0 for empty iterator', () => {
        expect(fn.count([])).toBe(0);
      });

      it('should work with different types', () => {
        expect(fn.count(['a', 'b', 'c'])).toBe(3);
      });
    });

    describe('median', () => {
      it('should calculate median for odd number of elements', () => {
        expect(fn.median([1, 3, 2])).toBe(2);
      });

      it('should calculate median for even number of elements', () => {
        expect(fn.median([1, 2, 3, 4])).toBe(2.5);
      });

      it('should return undefined for empty iterator', () => {
        expect(fn.median([])).toBeUndefined();
      });

      it('should handle single element', () => {
        expect(fn.median([42])).toBe(42);
      });

      it('should sort values correctly', () => {
        expect(fn.median([5, 1, 9, 3])).toBe(4);
      });
    });

    describe('variance', () => {
      it('should calculate variance', () => {
        const variance = fn.variance([1, 2, 3, 4, 5]);
        expect(variance).toBeCloseTo(2);
      });

      it('should return undefined for empty iterator', () => {
        expect(fn.variance([])).toBeUndefined();
      });

      it('should handle identical values', () => {
        expect(fn.variance([5, 5, 5, 5])).toBe(0);
      });
    });

    describe('stdDev', () => {
      it('should calculate standard deviation', () => {
        const stdDev = fn.stdDev([1, 2, 3, 4, 5]);
        expect(stdDev).toBeCloseTo(Math.sqrt(2));
      });

      it('should return undefined for empty iterator', () => {
        expect(fn.stdDev([])).toBeUndefined();
      });

      it('should handle identical values', () => {
        expect(fn.stdDev([5, 5, 5, 5])).toBe(0);
      });
    });

    describe('percentile', () => {
      it('should calculate percentiles', () => {
        expect(fn.percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0)).toBe(1);
        expect(fn.percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 50)).toBe(5.5);
        expect(fn.percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 100)).toBe(10);
      });

      it('should throw error for invalid percentile', () => {
        expect(() => fn.percentile([1, 2, 3], -1)).toThrow('percentile must be between 0 and 100');
        expect(() => fn.percentile([1, 2, 3], 101)).toThrow('percentile must be between 0 and 100');
      });

      it('should return undefined for empty iterator', () => {
        expect(fn.percentile([], 50)).toBeUndefined();
      });

      it('should handle single element', () => {
        expect(fn.percentile([42], 50)).toBe(42);
      });

      it('should use linear interpolation', () => {
        expect(fn.percentile([1, 2, 3, 4, 5], 25)).toBeCloseTo(2);
        expect(fn.percentile([1, 2, 3, 4, 5], 75)).toBeCloseTo(4);
      });
    });

    describe('mode', () => {
      it('should find single mode', () => {
        expect(fn.mode([1, 2, 2, 3, 3, 3])).toEqual([3]);
      });

      it('should find multiple modes (bimodal)', () => {
        expect(fn.mode([1, 1, 2, 2, 3])).toEqual([1, 2]);
      });

      it('should find multiple modes (multimodal)', () => {
        expect(fn.mode([1, 1, 2, 2, 3, 3])).toEqual([1, 2, 3]);
      });

      it('should return undefined for empty iterator', () => {
        expect(fn.mode([])).toBeUndefined();
      });

      it('should handle single element', () => {
        expect(fn.mode([42])).toEqual([42]);
      });

      it('should handle all unique values', () => {
        expect(fn.mode([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
      });

      it('should sort modes in ascending order', () => {
        expect(fn.mode([5, 5, 1, 1, 3, 3])).toEqual([1, 3, 5]);
      });
    });

    describe('quartiles', () => {
      it('should calculate quartiles', () => {
        const result = fn.quartiles([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        expect(result).toBeDefined();
        expect(result!.Q1).toBeCloseTo(3);
        expect(result!.Q2).toBeCloseTo(5);
        expect(result!.Q3).toBeCloseTo(7);
      });

      it('should return undefined for empty iterator', () => {
        expect(fn.quartiles([])).toBeUndefined();
      });

      it('should handle single element', () => {
        const result = fn.quartiles([42]);
        expect(result).toBeDefined();
        expect(result!.Q1).toBe(42);
        expect(result!.Q2).toBe(42);
        expect(result!.Q3).toBe(42);
      });

      it('should handle small datasets', () => {
        const result = fn.quartiles([1, 2, 3]);
        expect(result).toBeDefined();
        expect(result!.Q1).toBeCloseTo(1.5);
        expect(result!.Q2).toBeCloseTo(2);
        expect(result!.Q3).toBeCloseTo(2.5);
      });
    });

    describe('span', () => {
      it('should calculate span', () => {
        expect(fn.span([1, 2, 3, 4, 5])).toBe(4);
      });

      it('should return 0 for single element', () => {
        expect(fn.span([10])).toBe(0);
      });

      it('should return undefined for empty iterator', () => {
        expect(fn.span([])).toBeUndefined();
      });

      it('should handle negative numbers', () => {
        expect(fn.span([-5, -1, 3, 7])).toBe(12);
      });

      it('should handle identical values', () => {
        expect(fn.span([5, 5, 5, 5])).toBe(0);
      });
    });

    describe('product', () => {
      it('should calculate product', () => {
        expect(fn.product([1, 2, 3, 4, 5])).toBe(120);
      });

      it('should return 1 for empty iterator', () => {
        expect(fn.product([])).toBe(1);
      });

      it('should handle single element', () => {
        expect(fn.product([42])).toBe(42);
      });

      it('should handle negative numbers', () => {
        expect(fn.product([2, -3, 4])).toBe(-24);
      });

      it('should handle zero', () => {
        expect(fn.product([1, 2, 0, 4])).toBe(0);
      });
    });

    describe('covariance', () => {
      it('should calculate covariance for perfectly correlated sequences', () => {
        const result = fn.covariance([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
        expect(result).toBeCloseTo(4);
      });

      it('should calculate covariance for identical sequences', () => {
        const result = fn.covariance([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]);
        expect(result).toBeCloseTo(2);
      });

      it('should return undefined for empty first sequence', () => {
        expect(fn.covariance([], [1, 2, 3])).toBeUndefined();
      });

      it('should return undefined for empty second sequence', () => {
        expect(fn.covariance([1, 2, 3], [])).toBeUndefined();
      });

      it('should return undefined for sequences of different lengths', () => {
        expect(fn.covariance([1, 2, 3], [1, 2])).toBeUndefined();
      });

      it('should handle negative covariance', () => {
        const result = fn.covariance([1, 2, 3, 4, 5], [5, 4, 3, 2, 1]);
        expect(result).toBeCloseTo(-2);
      });
    });

    describe('correlation', () => {
      it('should calculate perfect positive correlation', () => {
        const result = fn.correlation([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
        expect(result).toBeCloseTo(1);
      });

      it('should calculate perfect negative correlation', () => {
        const result = fn.correlation([1, 2, 3, 4, 5], [5, 4, 3, 2, 1]);
        expect(result).toBeCloseTo(-1);
      });

      it('should return undefined for constant sequence', () => {
        const result = fn.correlation([1, 2, 3, 4, 5], [3, 3, 3, 3, 3]);
        expect(result).toBeUndefined();
      });

      it('should return undefined for empty sequences', () => {
        expect(fn.correlation([], [1, 2, 3])).toBeUndefined();
        expect(fn.correlation([1, 2, 3], [])).toBeUndefined();
      });

      it('should return undefined for sequences of different lengths', () => {
        expect(fn.correlation([1, 2, 3], [1, 2])).toBeUndefined();
      });
    });
  });

  // Transforming operations
  describe('Transforming Operations', () => {
    describe('map', () => {
      it('should transform elements', () => {
        const double = fn.map((x: number) => x * 2);
        expect(Array.from(double([1, 2, 3]))).toEqual([2, 4, 6]);
      });

      it('should work with empty iterables', () => {
        const double = fn.map((x: number) => x * 2);
        expect(Array.from(double([]))).toEqual([]);
      });

      it('should work with different types', () => {
        const toUpper = fn.map((x: string) => x.toUpperCase());
        expect(Array.from(toUpper(['a', 'b', 'c']))).toEqual(['A', 'B', 'C']);
      });
    });

    describe('filter', () => {
      it('should filter elements', () => {
        const evens = fn.filter((x: number) => x % 2 === 0);
        expect(Array.from(evens([1, 2, 3, 4, 5]))).toEqual([2, 4]);
      });

      it('should work with empty iterables', () => {
        const evens = fn.filter((x: number) => x % 2 === 0);
        expect(Array.from(evens([]))).toEqual([]);
      });

      it('should handle all elements filtered out', () => {
        const greaterThanTen = fn.filter((x: number) => x > 10);
        expect(Array.from(greaterThanTen([1, 2, 3]))).toEqual([]);
      });
    });

    describe('take', () => {
      it('should take first n elements', () => {
        const takeThree = fn.take(3);
        expect(Array.from(takeThree([1, 2, 3, 4, 5]))).toEqual([1, 2, 3]);
      });

      it('should handle taking more than available', () => {
        const takeTen = fn.take(10);
        expect(Array.from(takeTen([1, 2, 3]))).toEqual([1, 2, 3]);
      });

      it('should handle taking zero', () => {
        const takeZero = fn.take(0);
        expect(Array.from(takeZero([1, 2, 3]))).toEqual([]);
      });
    });

    describe('drop', () => {
      it('should drop first n elements', () => {
        const dropTwo = fn.drop(2);
        expect(Array.from(dropTwo([1, 2, 3, 4, 5]))).toEqual([3, 4, 5]);
      });

      it('should handle dropping more than available', () => {
        const dropTen = fn.drop(10);
        expect(Array.from(dropTen([1, 2, 3]))).toEqual([]);
      });

      it('should handle dropping zero', () => {
        const dropZero = fn.drop(0);
        expect(Array.from(dropZero([1, 2, 3]))).toEqual([1, 2, 3]);
      });
    });

    describe('flatMap', () => {
      it('should map and flatten', () => {
        const duplicateEach = fn.flatMap((x: number) => [x, x * 2]);
        expect(Array.from(duplicateEach([1, 2, 3]))).toEqual([1, 2, 2, 4, 3, 6]);
      });

      it('should work with empty iterables', () => {
        const duplicateEach = fn.flatMap((x: number) => [x, x * 2]);
        expect(Array.from(duplicateEach([]))).toEqual([]);
      });

      it('should handle empty results', () => {
        const filterMap = fn.flatMap((x: number) => x > 2 ? [x] : []);
        expect(Array.from(filterMap([1, 2, 3, 4]))).toEqual([3, 4]);
      });
    });

    describe('concat', () => {
      it('should concatenate iterables', () => {
        const concatAll = fn.concat<number>();
        expect(Array.from(concatAll([1, 2], [3, 4], [5, 6]))).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('should work with empty iterables', () => {
        const concatAll = fn.concat<number>();
        expect(Array.from(concatAll([], [1, 2], []))).toEqual([1, 2]);
      });

      it('should work with no arguments', () => {
        const concatAll = fn.concat<number>();
        expect(Array.from(concatAll())).toEqual([]);
      });
    });

    describe('intersperse', () => {
      it('should insert separator between elements', () => {
        const addCommas = fn.intersperse(',');
        expect(Array.from(addCommas(['a', 'b', 'c']))).toEqual(['a', ',', 'b', ',', 'c']);
      });

      it('should work with single element', () => {
        const addCommas = fn.intersperse(',');
        expect(Array.from(addCommas(['a']))).toEqual(['a']);
      });

      it('should work with empty iterables', () => {
        const addCommas = fn.intersperse(',');
        expect(Array.from(addCommas([]))).toEqual([]);
      });
    });

    describe('scan', () => {
      it('should emit intermediate accumulator values', () => {
        const runningSum = fn.scan((acc: number, x: number) => acc + x, 0);
        expect(Array.from(runningSum([1, 2, 3, 4]))).toEqual([0, 1, 3, 6, 10]);
      });

      it('should work with empty iterables', () => {
        const runningSum = fn.scan((acc: number, x: number) => acc + x, 0);
        expect(Array.from(runningSum([]))).toEqual([0]);
      });

      it('should work with different accumulator types', () => {
        const concat = fn.scan((acc: string, x: string) => acc + x, '');
        expect(Array.from(concat(['a', 'b', 'c']))).toEqual(['', 'a', 'ab', 'abc']);
      });
    });

    describe('enumerate', () => {
      it('should add indices', () => {
        const enumerateItems = fn.enumerate<string>();
        expect(Array.from(enumerateItems(['a', 'b', 'c']))).toEqual([[0, 'a'], [1, 'b'], [2, 'c']]);
      });

      it('should work with empty iterables', () => {
        const enumerateItems = fn.enumerate<string>();
        expect(Array.from(enumerateItems([]))).toEqual([]);
      });
    });

    describe('reverse', () => {
      it('should reverse elements', () => {
        const reverseItems = fn.reverse<number>();
        expect(Array.from(reverseItems([1, 2, 3, 4, 5]))).toEqual([5, 4, 3, 2, 1]);
      });

      it('should work with empty iterables', () => {
        const reverseItems = fn.reverse<number>();
        expect(Array.from(reverseItems([]))).toEqual([]);
      });

      it('should work with single element', () => {
        const reverseItems = fn.reverse<number>();
        expect(Array.from(reverseItems([42]))).toEqual([42]);
      });
    });

    describe('sort', () => {
      it('should sort numbers', () => {
        expect(Array.from(fn.sort([3, 1, 4, 1, 5]))).toEqual([1, 1, 3, 4, 5]);
      });

      it('should sort strings', () => {
        expect(Array.from(fn.sort(['c', 'a', 'b']))).toEqual(['a', 'b', 'c']);
      });

      it('should work with empty iterables', () => {
        expect(Array.from(fn.sort([]))).toEqual([]);
      });
    });

    describe('sortBy', () => {
      it('should sort ascending', () => {
        const sortAsc = fn.sortBy((a: number, b: number) => a - b);
        expect(Array.from(sortAsc([3, 1, 4, 1, 5]))).toEqual([1, 1, 3, 4, 5]);
      });

      it('should sort descending', () => {
        const sortDesc = fn.sortBy((a: number, b: number) => b - a);
        expect(Array.from(sortDesc([3, 1, 4, 1, 5]))).toEqual([5, 4, 3, 1, 1]);
      });

      it('should work with custom comparators', () => {
        const sortByLength = fn.sortBy((a: string, b: string) => a.length - b.length);
        expect(Array.from(sortByLength(['aaa', 'b', 'cc']))).toEqual(['b', 'cc', 'aaa']);
      });
    });
  });

  // Windowing operations
  describe('Windowing Operations', () => {
    describe('window', () => {
      it('should create sliding windows', () => {
        const windowThree = fn.window(3);
        expect(Array.from(windowThree([1, 2, 3, 4, 5]))).toEqual([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
      });

      it('should handle windows larger than input', () => {
        const windowTen = fn.window(10);
        expect(Array.from(windowTen([1, 2, 3]))).toEqual([]);
      });

      it('should throw for invalid window size', () => {
        expect(() => fn.window(0)).toThrow('size must be at least 1');
        expect(() => fn.window(-1)).toThrow('size must be at least 1');
      });

      it('should handle window size of 1', () => {
        const windowOne = fn.window(1);
        expect(Array.from(windowOne([1, 2, 3]))).toEqual([[1], [2], [3]]);
      });
    });

    describe('chunk', () => {
      it('should split into chunks', () => {
        const chunkTwo = fn.chunk(2);
        expect(Array.from(chunkTwo([1, 2, 3, 4, 5]))).toEqual([[1, 2], [3, 4], [5]]);
      });

      it('should handle perfect division', () => {
        const chunkThree = fn.chunk(3);
        expect(Array.from(chunkThree([1, 2, 3, 4, 5, 6]))).toEqual([[1, 2, 3], [4, 5, 6]]);
      });

      it('should throw for invalid chunk size', () => {
        expect(() => fn.chunk(0)).toThrow('size must be at least 1');
        expect(() => fn.chunk(-1)).toThrow('size must be at least 1');
      });

      it('should work with empty iterables', () => {
        const chunkTwo = fn.chunk(2);
        expect(Array.from(chunkTwo([]))).toEqual([]);
      });
    });

    describe('pairwise', () => {
      it('should create consecutive pairs', () => {
        expect(Array.from(fn.pairwise([1, 2, 3, 4]))).toEqual([[1, 2], [2, 3], [3, 4]]);
      });

      it('should work with two elements', () => {
        expect(Array.from(fn.pairwise([1, 2]))).toEqual([[1, 2]]);
      });

      it('should work with empty iterables', () => {
        expect(Array.from(fn.pairwise([]))).toEqual([]);
      });

      it('should work with single element', () => {
        expect(Array.from(fn.pairwise([1]))).toEqual([]);
      });
    });
  });

  // Grouping operations
  describe('Grouping Operations', () => {
    describe('partition', () => {
      it('should split into two arrays', () => {
        const partitionEvens = fn.partition((x: number) => x % 2 === 0);
        expect(partitionEvens([1, 2, 3, 4, 5])).toEqual([[2, 4], [1, 3, 5]]);
      });

      it('should work with empty iterables', () => {
        const partitionEvens = fn.partition((x: number) => x % 2 === 0);
        expect(partitionEvens([])).toEqual([[], []]);
      });

      it('should handle all true', () => {
        const partitionEvens = fn.partition((x: number) => x % 2 === 0);
        expect(partitionEvens([2, 4, 6])).toEqual([[2, 4, 6], []]);
      });

      it('should handle all false', () => {
        const partitionEvens = fn.partition((x: number) => x % 2 === 0);
        expect(partitionEvens([1, 3, 5])).toEqual([[], [1, 3, 5]]);
      });
    });

    describe('groupBy', () => {
      it('should group by key', () => {
        const groupByLength = fn.groupBy((s: string) => s.length);
        const result = groupByLength(['alice', 'bob', 'charlie', 'dave']);
        expect(result.get(3)).toEqual(['bob']);
        expect(result.get(5)).toEqual(['alice']);
        expect(result.get(7)).toEqual(['charlie']);
        expect(result.get(4)).toEqual(['dave']);
      });

      it('should work with empty iterables', () => {
        const groupByLength = fn.groupBy((s: string) => s.length);
        const result = groupByLength([]);
        expect(result.size).toBe(0);
      });

      it('should handle multiple items per group', () => {
        const groupByFirstLetter = fn.groupBy((s: string) => s[0]);
        const result = groupByFirstLetter(['alice', 'adam', 'bob', 'betty']);
        expect(result.get('a')).toEqual(['alice', 'adam']);
        expect(result.get('b')).toEqual(['bob', 'betty']);
      });
    });
  });

  // Set operations
  describe('Set Operations', () => {
    describe('distinct', () => {
      it('should remove duplicates', () => {
        expect(Array.from(fn.distinct([1, 2, 2, 3, 1, 4]))).toEqual([1, 2, 3, 4]);
      });

      it('should work with empty iterables', () => {
        expect(Array.from(fn.distinct([]))).toEqual([]);
      });

      it('should work with no duplicates', () => {
        expect(Array.from(fn.distinct([1, 2, 3, 4]))).toEqual([1, 2, 3, 4]);
      });

      it('should work with strings', () => {
        expect(Array.from(fn.distinct(['a', 'b', 'a', 'c', 'b']))).toEqual(['a', 'b', 'c']);
      });
    });

    describe('distinctBy', () => {
      it('should remove duplicates by key', () => {
        const users = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Charlie'}];
        const distinctById = fn.distinctBy((u: typeof users[0]) => u.id);
        const result = Array.from(distinctById(users));
        expect(result).toEqual([{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}]);
      });

      it('should work with empty iterables', () => {
        const distinctById = fn.distinctBy((x: {id: number}) => x.id);
        expect(Array.from(distinctById([]))).toEqual([]);
      });
    });
  });

  // Utility operations
  describe('Utility Operations', () => {
    describe('tap', () => {
      it('should execute side effects', () => {
        const sideEffects: number[] = [];
        const log = fn.tap((x: number) => sideEffects.push(x));
        const result = Array.from(log([1, 2, 3]));
        expect(result).toEqual([1, 2, 3]);
        expect(sideEffects).toEqual([1, 2, 3]);
      });

      it('should work with empty iterables', () => {
        const sideEffects: number[] = [];
        const log = fn.tap((x: number) => sideEffects.push(x));
        expect(Array.from(log([]))).toEqual([]);
        expect(sideEffects).toEqual([]);
      });
    });

    describe('takeWhile', () => {
      it('should take while predicate is true', () => {
        const takeLessThanFour = fn.takeWhile((x: number) => x < 4);
        expect(Array.from(takeLessThanFour([1, 2, 3, 4, 1, 2]))).toEqual([1, 2, 3]);
      });

      it('should work with empty iterables', () => {
        const takeLessThanFour = fn.takeWhile((x: number) => x < 4);
        expect(Array.from(takeLessThanFour([]))).toEqual([]);
      });

      it('should stop at first false', () => {
        const takePositive = fn.takeWhile((x: number) => x > 0);
        expect(Array.from(takePositive([1, 2, -1, 3]))).toEqual([1, 2]);
      });
    });

    describe('dropWhile', () => {
      it('should drop while predicate is true', () => {
        const dropLessThanThree = fn.dropWhile((x: number) => x < 3);
        expect(Array.from(dropLessThanThree([1, 2, 3, 4, 1, 2]))).toEqual([3, 4, 1, 2]);
      });

      it('should work with empty iterables', () => {
        const dropLessThanThree = fn.dropWhile((x: number) => x < 3);
        expect(Array.from(dropLessThanThree([]))).toEqual([]);
      });

      it('should keep all if predicate never true', () => {
        const dropGreaterThanTen = fn.dropWhile((x: number) => x > 10);
        expect(Array.from(dropGreaterThanTen([1, 2, 3]))).toEqual([1, 2, 3]);
      });
    });
  });

  // Terminal operations
  describe('Terminal Operations', () => {
    describe('toArray', () => {
      it('should convert to array', () => {
        expect(fn.toArray([1, 2, 3])).toEqual([1, 2, 3]);
      });

      it('should work with iterables', () => {
        const set = new Set([1, 2, 3]);
        expect(fn.toArray(set)).toEqual([1, 2, 3]);
      });

      it('should work with empty iterables', () => {
        expect(fn.toArray([])).toEqual([]);
      });
    });

    describe('reduce', () => {
      it('should reduce to single value', () => {
        const sumAll = fn.reduce((acc: number, x: number) => acc + x, 0);
        expect(sumAll([1, 2, 3, 4])).toBe(10);
      });

      it('should work with empty iterables', () => {
        const sumAll = fn.reduce((acc: number, x: number) => acc + x, 0);
        expect(sumAll([])).toBe(0);
      });

      it('should work with different types', () => {
        const concat = fn.reduce((acc: string, x: string) => acc + x, '');
        expect(concat(['a', 'b', 'c'])).toBe('abc');
      });
    });

    describe('find', () => {
      it('should find first matching element', () => {
        const findGreaterThanThree = fn.find((x: number) => x > 3);
        expect(findGreaterThanThree([1, 2, 3, 4, 5])).toBe(4);
      });

      it('should return undefined if not found', () => {
        const findGreaterThanThree = fn.find((x: number) => x > 3);
        expect(findGreaterThanThree([1, 2, 3])).toBeUndefined();
      });

      it('should work with empty iterables', () => {
        const findGreaterThanThree = fn.find((x: number) => x > 3);
        expect(findGreaterThanThree([])).toBeUndefined();
      });
    });

    describe('findIndex', () => {
      it('should find index of first matching element', () => {
        const findIndexGreaterThanThree = fn.findIndex((x: number) => x > 3);
        expect(findIndexGreaterThanThree([1, 2, 3, 4, 5])).toBe(3);
      });

      it('should return -1 if not found', () => {
        const findIndexGreaterThanThree = fn.findIndex((x: number) => x > 3);
        expect(findIndexGreaterThanThree([1, 2, 3])).toBe(-1);
      });

      it('should work with empty iterables', () => {
        const findIndexGreaterThanThree = fn.findIndex((x: number) => x > 3);
        expect(findIndexGreaterThanThree([])).toBe(-1);
      });
    });

    describe('some', () => {
      it('should return true if any match', () => {
        const hasGreaterThanThree = fn.some((x: number) => x > 3);
        expect(hasGreaterThanThree([1, 2, 3, 4, 5])).toBe(true);
      });

      it('should return false if none match', () => {
        const hasGreaterThanThree = fn.some((x: number) => x > 3);
        expect(hasGreaterThanThree([1, 2, 3])).toBe(false);
      });

      it('should work with empty iterables', () => {
        const hasGreaterThanThree = fn.some((x: number) => x > 3);
        expect(hasGreaterThanThree([])).toBe(false);
      });
    });

    describe('every', () => {
      it('should return true if all match', () => {
        const allEven = fn.every((x: number) => x % 2 === 0);
        expect(allEven([2, 4, 6])).toBe(true);
      });

      it('should return false if any do not match', () => {
        const allEven = fn.every((x: number) => x % 2 === 0);
        expect(allEven([1, 2, 3])).toBe(false);
      });

      it('should return true for empty iterables', () => {
        const allEven = fn.every((x: number) => x % 2 === 0);
        expect(allEven([])).toBe(true);
      });
    });

    describe('first', () => {
      it('should get first element', () => {
        expect(fn.first([1, 2, 3])).toBe(1);
      });

      it('should return undefined for empty iterables', () => {
        expect(fn.first([])).toBeUndefined();
      });

      it('should return default value for empty iterables', () => {
        expect(fn.first([], 0)).toBe(0);
      });
    });

    describe('last', () => {
      it('should get last element', () => {
        expect(fn.last([1, 2, 3])).toBe(3);
      });

      it('should return undefined for empty iterables', () => {
        expect(fn.last([])).toBeUndefined();
      });

      it('should return default value for empty iterables', () => {
        expect(fn.last([], 0)).toBe(0);
      });
    });

    describe('nth', () => {
      it('should get element at index', () => {
        const getSecond = fn.nth(2);
        expect(getSecond([1, 2, 3, 4, 5])).toBe(3);
      });

      it('should return undefined if index out of bounds', () => {
        const getTenth = fn.nth(10);
        expect(getTenth([1, 2, 3])).toBeUndefined();
      });

      it('should return undefined for negative indices', () => {
        const getNegative = fn.nth(-1);
        expect(getNegative([1, 2, 3])).toBeUndefined();
      });

      it('should work with zero index', () => {
        const getFirst = fn.nth(0);
        expect(getFirst([1, 2, 3])).toBe(1);
      });
    });

    describe('isEmpty', () => {
      it('should return true for empty iterables', () => {
        expect(fn.isEmpty([])).toBe(true);
      });

      it('should return false for non-empty iterables', () => {
        expect(fn.isEmpty([1, 2, 3])).toBe(false);
      });
    });

    describe('includes', () => {
      it('should return true if value is included', () => {
        const includesThree = fn.includes(3);
        expect(includesThree([1, 2, 3, 4, 5])).toBe(true);
      });

      it('should return false if value is not included', () => {
        const includesThree = fn.includes(3);
        expect(includesThree([1, 2, 4])).toBe(false);
      });

      it('should work with strings', () => {
        const includesB = fn.includes('b');
        expect(includesB(['a', 'b', 'c'])).toBe(true);
      });

      it('should work with empty iterables', () => {
        const includesThree = fn.includes(3);
        expect(includesThree([])).toBe(false);
      });
    });
  });

  // Combining operations
  describe('Combining Operations', () => {
    describe('zip', () => {
      it('should combine two iterables', () => {
        expect(Array.from(fn.zip([1, 2, 3], ['a', 'b', 'c']))).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
      });

      it('should stop at shorter iterable', () => {
        expect(Array.from(fn.zip([1, 2], ['a', 'b', 'c']))).toEqual([[1, 'a'], [2, 'b']]);
      });

      it('should work with empty iterables', () => {
        expect(Array.from(fn.zip([], []))).toEqual([]);
      });
    });

    describe('zipWith', () => {
      it('should combine with function', () => {
        expect(Array.from(fn.zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b))).toEqual([11, 22, 33]);
      });

      it('should stop at shorter iterable', () => {
        expect(Array.from(fn.zipWith([1, 2], [10, 20, 30], (a, b) => a + b))).toEqual([11, 22]);
      });

      it('should work with empty iterables', () => {
        expect(Array.from(fn.zipWith([], [], (a, b) => a + b))).toEqual([]);
      });
    });
  });

  // Generator functions
  describe('Generator Functions', () => {
    describe('range', () => {
      it('should generate range from 0 to stop', () => {
        expect(Array.from(fn.range(5))).toEqual([0, 1, 2, 3, 4]);
      });

      it('should generate range from start to stop', () => {
        expect(Array.from(fn.range(2, 5))).toEqual([2, 3, 4]);
      });

      it('should generate range with step', () => {
        expect(Array.from(fn.range(0, 10, 2))).toEqual([0, 2, 4, 6, 8]);
      });

      it('should generate descending range', () => {
        expect(Array.from(fn.range(5, 0, -1))).toEqual([5, 4, 3, 2, 1]);
      });

      it('should throw for zero step', () => {
        expect(() => Array.from(fn.range(0, 10, 0))).toThrow('step cannot be zero');
      });

      it('should handle empty range', () => {
        expect(Array.from(fn.range(5, 5))).toEqual([]);
      });
    });

    describe('repeat', () => {
      it('should repeat value n times', () => {
        expect(Array.from(fn.repeat('x', 3))).toEqual(['x', 'x', 'x']);
      });

      it('should repeat zero times', () => {
        expect(Array.from(fn.repeat('x', 0))).toEqual([]);
      });

      it('should work with numbers', () => {
        expect(Array.from(fn.repeat(0, 5))).toEqual([0, 0, 0, 0, 0]);
      });

      it('should create infinite iterator when times omitted', () => {
        const takeThree = fn.take(3);
        expect(Array.from(takeThree(fn.repeat(1)))).toEqual([1, 1, 1]);
      });
    });
  });

  // Interleaving operations
  describe('Interleaving Operations', () => {
    describe('interleave', () => {
      it('should alternate elements', () => {
        expect(Array.from(fn.interleave([1, 2, 3], [4, 5, 6]))).toEqual([1, 4, 2, 5, 3, 6]);
      });

      it('should handle different lengths', () => {
        expect(Array.from(fn.interleave([1, 2], [3, 4, 5], [6]))).toEqual([1, 3, 6, 2, 4, 5]);
      });

      it('should work with empty iterables', () => {
        expect(Array.from(fn.interleave())).toEqual([]);
      });

      it('should work with single iterable', () => {
        expect(Array.from(fn.interleave([1, 2, 3]))).toEqual([1, 2, 3]);
      });
    });

    describe('merge', () => {
      it('should merge sorted iterables', () => {
        expect(Array.from(fn.merge([1, 3, 5], [2, 4, 6]))).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('should handle multiple iterables', () => {
        expect(Array.from(fn.merge([1, 5, 9], [2, 6, 10], [3, 7, 11]))).toEqual([1, 2, 3, 5, 6, 7, 9, 10, 11]);
      });

      it('should work with empty iterables', () => {
        expect(Array.from(fn.merge())).toEqual([]);
      });

      it('should work with custom comparator', () => {
        const mergeDesc = fn.merge((a: number, b: number) => b - a, [5, 3, 1], [6, 4, 2]);
        expect(Array.from(mergeDesc)).toEqual([6, 5, 4, 3, 2, 1]);
      });

      it('should handle duplicate values', () => {
        expect(Array.from(fn.merge([1, 2, 2, 5], [2, 3, 4]))).toEqual([1, 2, 2, 2, 3, 4, 5]);
      });
    });

    describe('chain', () => {
      it('should chain iterables sequentially', () => {
        expect(Array.from(fn.chain([1, 2], [3, 4], [5, 6]))).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('should handle empty iterables', () => {
        expect(Array.from(fn.chain([1], [2, 3], [], [4, 5, 6]))).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('should work with no arguments', () => {
        expect(Array.from(fn.chain())).toEqual([]);
      });
    });
  });

  // Composition tests
  describe('Function Composition', () => {
    it('should compose multiple operations', () => {
      const double = fn.map((x: number) => x * 2);
      const evens = fn.filter((x: number) => x % 2 === 0);
      const takeThree = fn.take(3);

      const result = Array.from(takeThree(evens(double([1, 2, 3, 4, 5, 6]))));
      expect(result).toEqual([2, 4, 6]);
    });

    it('should work with reduce after transformations', () => {
      const double = fn.map((x: number) => x * 2);
      const sumAll = fn.reduce((acc: number, x: number) => acc + x, 0);

      const result = sumAll(double([1, 2, 3, 4, 5]));
      expect(result).toBe(30);
    });

    it('should compose windowing and aggregation', () => {
      const windowThree = fn.window(3);
      const mapped = fn.map((window: number[]) => fn.sum(window));

      const result = Array.from(mapped(windowThree([1, 2, 3, 4, 5])));
      expect(result).toEqual([6, 9, 12]);
    });
  });
});
