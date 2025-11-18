import { describe, it, expect } from 'vitest';
import { iter } from '../src/index.js';
import * as fn from '../src/fn/index.js';

describe('Interleaving Operations', () => {
  describe('interleave (wrapper API)', () => {
    it('should interleave two arrays of equal length', () => {
      const result = iter.interleave([1, 2, 3], [4, 5, 6]).toArray();
      expect(result).toEqual([1, 4, 2, 5, 3, 6]);
    });

    it('should interleave arrays of different lengths', () => {
      const result = iter.interleave([1, 2], [3, 4, 5], [6]).toArray();
      expect(result).toEqual([1, 3, 6, 2, 4, 5]);
    });

    it('should handle single array', () => {
      const result = iter.interleave([1, 2, 3]).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle empty arrays', () => {
      const result = iter.interleave([], [1, 2], []).toArray();
      expect(result).toEqual([1, 2]);
    });

    it('should handle all empty arrays', () => {
      const result = iter.interleave([], [], []).toArray();
      expect(result).toEqual([]);
    });

    it('should handle no arguments', () => {
      const result = iter.interleave().toArray();
      expect(result).toEqual([]);
    });

    it('should work with different types', () => {
      const result = iter.interleave(['a', 'b'], ['c', 'd', 'e']).toArray();
      expect(result).toEqual(['a', 'c', 'b', 'd', 'e']);
    });

    it('should work with generators', () => {
      function* gen1() {
        yield 1;
        yield 2;
      }
      function* gen2() {
        yield 3;
        yield 4;
      }
      const result = iter.interleave(gen1(), gen2()).toArray();
      expect(result).toEqual([1, 3, 2, 4]);
    });

    it('should interleave many arrays', () => {
      const result = iter.interleave([1], [2], [3], [4], [5]).toArray();
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('merge (wrapper API)', () => {
    it('should merge two sorted arrays', () => {
      const result = iter.merge([1, 3, 5], [2, 4, 6]).toArray();
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should merge three sorted arrays', () => {
      const result = iter.merge([1, 5, 9], [2, 6, 10], [3, 7, 11]).toArray();
      expect(result).toEqual([1, 2, 3, 5, 6, 7, 9, 10, 11]);
    });

    it('should merge arrays of different lengths', () => {
      const result = iter.merge([1, 10], [2, 3, 4], [5]).toArray();
      expect(result).toEqual([1, 2, 3, 4, 5, 10]);
    });

    it('should handle single array', () => {
      const result = iter.merge([1, 2, 3]).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle empty arrays', () => {
      const result = iter.merge([], [1, 2], []).toArray();
      expect(result).toEqual([1, 2]);
    });

    it('should handle all empty arrays', () => {
      const result = iter.merge([], [], []).toArray();
      expect(result).toEqual([]);
    });

    it('should handle no arguments', () => {
      const result = iter.merge().toArray();
      expect(result).toEqual([]);
    });

    it('should work with strings (default comparator)', () => {
      const result = iter.merge(['a', 'c', 'e'], ['b', 'd', 'f']).toArray();
      expect(result).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });

    it('should work with custom comparator', () => {
      // Descending order
      const desc = (a: number, b: number) => b - a;
      const result = iter.merge(desc, [9, 5, 1], [10, 6, 2], [11, 7, 3]).toArray();
      expect(result).toEqual([11, 10, 9, 7, 6, 5, 3, 2, 1]);
    });

    it('should handle duplicates', () => {
      const result = iter.merge([1, 3, 3, 5], [2, 3, 4]).toArray();
      expect(result).toEqual([1, 2, 3, 3, 3, 4, 5]);
    });

    it('should work with generators', () => {
      function* gen1() {
        yield 1;
        yield 3;
        yield 5;
      }
      function* gen2() {
        yield 2;
        yield 4;
        yield 6;
      }
      const result = iter.merge(gen1(), gen2()).toArray();
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should merge many arrays efficiently', () => {
      const arrays = Array.from({ length: 10 }, (_, i) =>
        [i, i + 10, i + 20, i + 30]
      );
      const result = iter.merge(...arrays).toArray();
      // Should be sorted
      const sorted = [...result].sort((a, b) => a - b);
      expect(result).toEqual(sorted);
    });
  });

  describe('chain (wrapper API)', () => {
    it('should chain two arrays', () => {
      const result = iter.chain([1, 2], [3, 4]).toArray();
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should chain three arrays', () => {
      const result = iter.chain([1, 2], [3, 4], [5, 6]).toArray();
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle single array', () => {
      const result = iter.chain([1, 2, 3]).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle empty arrays', () => {
      const result = iter.chain([1], [2, 3], [], [4, 5, 6]).toArray();
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle all empty arrays', () => {
      const result = iter.chain([], [], []).toArray();
      expect(result).toEqual([]);
    });

    it('should handle no arguments', () => {
      const result = iter.chain().toArray();
      expect(result).toEqual([]);
    });

    it('should work with different types', () => {
      const result = iter.chain(['a', 'b'], ['c', 'd']).toArray();
      expect(result).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should work with generators', () => {
      function* gen1() {
        yield 1;
        yield 2;
      }
      function* gen2() {
        yield 3;
        yield 4;
      }
      const result = iter.chain(gen1(), gen2()).toArray();
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should chain many arrays', () => {
      const result = iter.chain([1], [2], [3], [4], [5]).toArray();
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should be lazy', () => {
      let called = 0;
      function* counter() {
        called++;
        yield 1;
        yield 2;
      }
      const chained = iter.chain(counter(), counter());
      expect(called).toBe(0); // Not called yet

      const result = chained.toArray();
      expect(result).toEqual([1, 2, 1, 2]);
      expect(called).toBe(2); // Called when consumed
    });
  });

  describe('interleave (functional API)', () => {
    it('should interleave two arrays of equal length', () => {
      const result = Array.from(fn.interleave([1, 2, 3], [4, 5, 6]));
      expect(result).toEqual([1, 4, 2, 5, 3, 6]);
    });

    it('should interleave arrays of different lengths', () => {
      const result = Array.from(fn.interleave([1, 2], [3, 4, 5], [6]));
      expect(result).toEqual([1, 3, 6, 2, 4, 5]);
    });

    it('should handle empty arrays', () => {
      const result = Array.from(fn.interleave([], [1, 2]));
      expect(result).toEqual([1, 2]);
    });
  });

  describe('merge (functional API)', () => {
    it('should merge two sorted arrays', () => {
      const result = Array.from(fn.merge([1, 3, 5], [2, 4, 6]));
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should merge with custom comparator', () => {
      const desc = (a: number, b: number) => b - a;
      const result = Array.from(fn.merge(desc, [9, 5, 1], [10, 6, 2]));
      expect(result).toEqual([10, 9, 6, 5, 2, 1]);
    });

    it('should handle empty arrays', () => {
      const result = Array.from(fn.merge([], [1, 2]));
      expect(result).toEqual([1, 2]);
    });
  });

  describe('chain (functional API)', () => {
    it('should chain two arrays', () => {
      const result = Array.from(fn.chain([1, 2], [3, 4]));
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should chain three arrays', () => {
      const result = Array.from(fn.chain([1, 2], [3, 4], [5, 6]));
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle empty arrays', () => {
      const result = Array.from(fn.chain([1], [], [2, 3]));
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('Integration with other operations', () => {
    it('should chain with map and filter', () => {
      const result = iter
        .chain([1, 2, 3], [4, 5, 6])
        .filter(x => x % 2 === 0)
        .map(x => x * 2)
        .toArray();
      expect(result).toEqual([4, 8, 12]);
    });

    it('should interleave then merge', () => {
      const interleaved = iter.interleave([1, 5], [2, 6]).toArray();
      const merged = iter.merge([interleaved[0]!, interleaved[2]!], [interleaved[1]!, interleaved[3]!]).toArray();
      expect(merged).toEqual([1, 2, 5, 6]);
    });

    it('should use merge with statistical operations', () => {
      const result = iter.merge([1, 3, 5], [2, 4, 6]).mean();
      expect(result).toBe(3.5);
    });

    it('should chain with windowing', () => {
      const result = iter
        .chain([1, 2], [3, 4], [5, 6])
        .window(2)
        .toArray();
      expect(result).toEqual([[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]);
    });
  });

  describe('Edge cases', () => {
    it('interleave should handle very long arrays', () => {
      const arr1 = Array.from({ length: 1000 }, (_, i) => i);
      const arr2 = Array.from({ length: 1000 }, (_, i) => i + 1000);
      const result = iter.interleave(arr1, arr2).toArray();
      expect(result.length).toBe(2000);
      expect(result[0]).toBe(0);
      expect(result[1]).toBe(1000);
      expect(result[2]).toBe(1);
    });

    it('merge should handle very long sorted arrays', () => {
      const arr1 = Array.from({ length: 500 }, (_, i) => i * 2);
      const arr2 = Array.from({ length: 500 }, (_, i) => i * 2 + 1);
      const result = iter.merge(arr1, arr2).toArray();
      expect(result.length).toBe(1000);
      // Check if sorted
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i]! <= result[i + 1]!).toBe(true);
      }
    });

    it('chain should handle very long arrays', () => {
      const arrays = Array.from({ length: 100 }, (_, i) => [i]);
      const result = iter.chain(...arrays).toArray();
      expect(result.length).toBe(100);
      expect(result).toEqual(Array.from({ length: 100 }, (_, i) => i));
    });
  });
});
