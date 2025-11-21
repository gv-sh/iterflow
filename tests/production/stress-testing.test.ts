import { describe, it, expect } from 'vitest';
import { iter } from '../../src/index.js';

/**
 * Production Stress Testing Suite
 *
 * Tests iterflow behavior under extreme conditions and edge cases
 * that may occur in production environments.
 */

describe('Stress Testing - Edge Cases', () => {
  describe('Empty and single-element edge cases', () => {
    it('should handle empty iterators gracefully', () => {
      const empty = iter([]);

      expect(empty.count()).toBe(0);
      expect(empty.toArray()).toEqual([]);
      expect(empty.first()).toBeUndefined();
      expect(empty.last()).toBeUndefined();
      expect(empty.nth(0)).toBeUndefined();
      expect(empty.isEmpty()).toBe(true);
    });

    it('should handle single-element iterators', () => {
      const single = iter([42]);

      expect(single.count()).toBe(1);
      expect(single.first()).toBe(42);
      expect(single.last()).toBe(42);
      expect(single.nth(0)).toBe(42);
      expect(single.isEmpty()).toBe(false);
    });

    it('should handle empty windows and chunks', () => {
      const empty = iter([]);

      expect(empty.window(5).toArray()).toEqual([]);
      expect(empty.chunk(5).toArray()).toEqual([]);
    });
  });

  describe('Boundary value testing', () => {
    it('should handle maximum safe integer', () => {
      const maxInt = Number.MAX_SAFE_INTEGER;
      const data = [maxInt, maxInt - 1, maxInt - 2];

      const result = iter(data).sum();
      expect(result).toBe(maxInt * 3 - 3);
    });

    it('should handle minimum safe integer', () => {
      const minInt = Number.MIN_SAFE_INTEGER;
      const data = [minInt, minInt + 1, minInt + 2];

      const result = iter(data).sum();
      expect(result).toBe(minInt * 3 + 3);
    });

    it('should handle very small floating point numbers', () => {
      const data = [Number.EPSILON, Number.EPSILON * 2, Number.EPSILON * 3];

      const result = iter(data).sum();
      expect(result).toBeCloseTo(Number.EPSILON * 6);
    });

    it('should handle zero values correctly', () => {
      const data = [0, 0, 0, 0, 0];

      expect(iter(data).sum()).toBe(0);
      expect(iter(data).mean()).toBe(0);
      expect(iter(data).product()).toBe(0);
      expect(iter(data).variance()).toBe(0);
    });
  });

  describe('Special numeric values', () => {
    it('should handle NaN values', () => {
      const data = [1, 2, NaN, 4, 5];

      const result = iter(data).filter(x => !Number.isNaN(x)).toArray();
      expect(result).toEqual([1, 2, 4, 5]);
    });

    it('should handle Infinity values', () => {
      const data = [1, 2, Infinity, 4, 5];

      const withoutInfinity = iter(data)
        .filter(x => Number.isFinite(x))
        .toArray();
      expect(withoutInfinity).toEqual([1, 2, 4, 5]);
    });

    it('should handle negative infinity', () => {
      const data = [-Infinity, 1, 2, 3];

      const finite = iter(data)
        .filter(x => Number.isFinite(x))
        .toArray();
      expect(finite).toEqual([1, 2, 3]);
    });

    it('should handle mixed special values', () => {
      const data = [1, NaN, Infinity, -Infinity, 2, 0, -0];

      const clean = iter(data)
        .filter(x => Number.isFinite(x) && !Number.isNaN(x))
        .toArray();
      expect(clean).toEqual([1, 2, 0, -0]);
    });
  });

  describe('Memory pressure scenarios', () => {
    it('should handle extremely large window sizes', () => {
      const data = Array.from({ length: 1000 }, (_, i) => i);

      // Window larger than data
      const result = iter(data).window(2000).toArray();
      expect(result).toEqual([]);
    });

    it('should handle window size of 1', () => {
      const data = [1, 2, 3, 4, 5];

      const result = iter(data).window(1).toArray();
      expect(result).toEqual([[1], [2], [3], [4], [5]]);
    });

    it('should handle very large chunks', () => {
      const data = Array.from({ length: 100 }, (_, i) => i);

      const result = iter(data).chunk(1000).toArray();
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(100);
    });

    it('should handle chunk size of 1', () => {
      const data = [1, 2, 3, 4, 5];

      const result = iter(data).chunk(1).toArray();
      expect(result).toEqual([[1], [2], [3], [4], [5]]);
    });
  });

  describe('Deeply nested operations', () => {
    it('should handle 20+ chained operations', () => {
      const data = Array.from({ length: 10000 }, (_, i) => i);

      const result = iter(data)
        .filter(x => x % 2 === 0) // 1
        .map(x => x * 2) // 2
        .filter(x => x > 100) // 3
        .map(x => x + 1) // 4
        .filter(x => x % 10 === 0) // 5
        .map(x => x / 10) // 6
        .filter(x => x > 5) // 7
        .map(x => x * 3) // 8
        .filter(x => x < 1000) // 9
        .map(x => x - 1) // 10
        .filter(x => x % 3 === 0) // 11
        .map(x => x + 10) // 12
        .filter(x => x > 50) // 13
        .map(x => x * 1.5) // 14
        .filter(x => x < 500) // 15
        .map(x => Math.floor(x)) // 16
        .filter(x => x % 5 === 0) // 17
        .map(x => x / 5) // 18
        .filter(x => x > 10) // 19
        .take(100) // 20
        .toArray();

      expect(Array.isArray(result)).toBe(true);
      expect(result.every(x => typeof x === 'number')).toBe(true);
    });

    it('should handle deeply nested window operations', () => {
      const data = Array.from({ length: 1000 }, (_, i) => i);

      const result = iter(data)
        .window(10)
        .map(win => iter(win).window(3).toArray())
        .take(5)
        .toArray();

      expect(result).toHaveLength(5);
      expect(Array.isArray(result[0])).toBe(true);
    });
  });

  describe('Concurrent modification scenarios', () => {
    it('should handle source array modifications (defensive copy)', () => {
      const data = [1, 2, 3, 4, 5];
      const iterator = iter(data);

      // Modify source while iterating
      data.push(6, 7, 8);

      const result = iterator.toArray();

      // Should work regardless of source modification timing
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle generator exhaustion', () => {
      function* generator() {
        yield 1;
        yield 2;
        yield 3;
      }

      const gen = generator();
      const it = iter(gen);

      const result1 = it.toArray();
      const result2 = iter(gen).toArray(); // Generator already exhausted

      expect(result1).toEqual([1, 2, 3]);
      expect(result2).toEqual([]);
    });
  });

  describe('Type coercion edge cases', () => {
    it('should handle mixed numeric types', () => {
      const data = [1, 2.5, 3, 4.7, 5];

      const sum = iter(data).sum();
      expect(sum).toBeCloseTo(16.2);
    });

    it('should handle negative numbers in statistics', () => {
      const data = [-5, -3, -1, 0, 1, 3, 5];

      const mean = iter(data).mean();
      expect(mean).toBe(0);

      const median = iter(data).median();
      expect(median).toBe(0);
    });

    it('should handle all negative numbers', () => {
      const data = [-10, -20, -30, -40, -50];

      const sum = iter(data).sum();
      expect(sum).toBe(-150);

      const max = iter(data).max();
      expect(max).toBe(-10);

      const min = iter(data).min();
      expect(min).toBe(-50);
    });
  });

  describe('String edge cases', () => {
    it('should handle empty strings', () => {
      const data = ['', 'a', '', 'b', ''];

      const nonEmpty = iter(data)
        .filter(s => s.length > 0)
        .toArray();
      expect(nonEmpty).toEqual(['a', 'b']);
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(100000);
      const data = [longString, longString, longString];

      const result = iter(data).take(2).toArray();
      expect(result).toHaveLength(2);
      expect(result[0].length).toBe(100000);
    });

    it('should handle unicode characters', () => {
      const data = ['Hello', '世界', '🌍', '🚀', 'مرحبا'];

      const result = iter(data).toArray();
      expect(result).toEqual(['Hello', '世界', '🌍', '🚀', 'مرحبا']);
    });
  });

  describe('Object and reference edge cases', () => {
    it('should handle null and undefined', () => {
      const data = [1, null, 3, undefined, 5];

      const filtered = iter(data)
        .filter(x => x != null)
        .toArray();
      expect(filtered).toEqual([1, 3, 5]);
    });

    it('should handle circular references', () => {
      interface Node {
        value: number;
        next?: Node;
      }

      const node1: Node = { value: 1 };
      const node2: Node = { value: 2 };
      const node3: Node = { value: 3 };

      node1.next = node2;
      node2.next = node3;
      node3.next = node1; // Circular

      const nodes = [node1, node2, node3];
      const values = iter(nodes).map(n => n.value).toArray();

      expect(values).toEqual([1, 2, 3]);
    });

    it('should handle objects with same reference', () => {
      const obj = { value: 42 };
      const data = [obj, obj, obj];

      const result = iter(data).toArray();
      expect(result).toHaveLength(3);
      expect(result[0] === result[1]).toBe(true);
      expect(result[1] === result[2]).toBe(true);
    });
  });

  describe('Performance degradation scenarios', () => {
    it('should handle repeated sorting on large datasets', () => {
      const data = Array.from({ length: 10000 }, () => Math.random());

      const sorted1 = iter(data).sort().toArray();
      const sorted2 = iter(data).sort().toArray();
      const sorted3 = iter(data).sort().toArray();

      expect(sorted1).toHaveLength(10000);
      expect(sorted2).toHaveLength(10000);
      expect(sorted3).toHaveLength(10000);
    });

    it('should handle repeated groupBy operations', () => {
      const data = Array.from({ length: 10000 }, (_, i) => ({
        category: i % 100,
        value: Math.random(),
      }));

      for (let i = 0; i < 10; i++) {
        const groups = iter(data).groupBy(item => item.category);
        expect(groups.size).toBe(100);
      }
    });

    it('should handle many small chunks', () => {
      const data = Array.from({ length: 10000 }, (_, i) => i);

      const chunks = iter(data).chunk(2).toArray();
      expect(chunks).toHaveLength(5000);
    });
  });

  describe('Error recovery scenarios', () => {
    it('should handle errors in map function gracefully', () => {
      const data = [1, 2, 0, 4, 5];

      const result = iter(data)
        .map(x => {
          if (x === 0) return null;
          return 10 / x;
        })
        .filter(x => x !== null)
        .toArray();

      expect(result.length).toBe(4);
    });

    it('should handle errors in filter predicate', () => {
      const data = [1, 2, null, 4, 5];

      const result = iter(data)
        .filter((x): x is number => {
          if (x === null) return false;
          return x > 0;
        })
        .toArray();

      expect(result).toEqual([1, 2, 4, 5]);
    });
  });

  describe('Extreme comparison scenarios', () => {
    it('should handle comparison with all equal elements', () => {
      const data = [42, 42, 42, 42, 42];

      expect(iter(data).min()).toBe(42);
      expect(iter(data).max()).toBe(42);
      expect(iter(data).median()).toBe(42);
      expect(iter(data).mode()).toEqual([42]);
    });

    it('should handle comparison with reverse sorted data', () => {
      const data = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];

      const sorted = iter(data).sort().toArray();
      expect(sorted).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    });

    it('should handle comparison with alternating values', () => {
      const data = [1, 100, 1, 100, 1, 100];

      expect(iter(data).min()).toBe(1);
      expect(iter(data).max()).toBe(100);
      expect(iter(data).distinct().toArray()).toEqual([1, 100]);
    });
  });

  describe('Statistical edge cases', () => {
    it('should handle variance of constant values', () => {
      const data = [5, 5, 5, 5, 5];

      expect(iter(data).variance()).toBe(0);
      expect(iter(data).stddev()).toBe(0);
    });

    it('should handle correlation with identical sequences', () => {
      const data1 = [1, 2, 3, 4, 5];
      const data2 = [1, 2, 3, 4, 5];

      const corr = iter(data1).correlation(data2);
      expect(corr).toBeCloseTo(1.0);
    });

    it('should handle quartiles with small datasets', () => {
      const data = [1, 2, 3];

      const quartiles = iter(data).quartiles();
      expect(quartiles.q1).toBeLessThanOrEqual(quartiles.q2);
      expect(quartiles.q2).toBeLessThanOrEqual(quartiles.q3);
    });

    it('should handle mode with multi-modal distribution', () => {
      const data = [1, 1, 2, 2, 3, 3];

      const modes = iter(data).mode();
      expect(modes.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Interleaving stress tests', () => {
    it('should handle interleaving empty iterators', () => {
      const empty1: number[] = [];
      const empty2: number[] = [];

      const result = iter(empty1).interleave(empty2).toArray();
      expect(result).toEqual([]);
    });

    it('should handle interleaving with very different lengths', () => {
      const short = [1];
      const long = Array.from({ length: 1000 }, (_, i) => i);

      const result = iter(short).interleave(long).toArray();
      expect(result.length).toBeGreaterThan(1);
    });

    it('should handle merging already sorted empty sequences', () => {
      const empty1: number[] = [];
      const empty2: number[] = [];

      const result = iter(empty1).merge(empty2).toArray();
      expect(result).toEqual([]);
    });
  });
});
