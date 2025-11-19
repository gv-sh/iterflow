import { describe, it, expect } from 'vitest';
import { iter } from '../src/index.js';

describe('Statistical Operations', () => {
  describe('sum', () => {
    it('should sum numbers', () => {
      expect(iter([1, 2, 3, 4, 5]).sum()).toBe(15);
    });

    it('should return 0 for empty iterator', () => {
      expect(iter([]).sum()).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(iter([-1, -2, -3]).sum()).toBe(-6);
    });

    it('should handle decimals', () => {
      expect(iter([1.5, 2.5, 3.0]).sum()).toBe(7);
    });
  });

  describe('mean', () => {
    it('should calculate average', () => {
      expect(iter([1, 2, 3, 4, 5]).mean()).toBe(3);
    });

    it('should return undefined for empty iterator', () => {
      expect(iter([]).mean()).toBeUndefined();
    });

    it('should handle decimals', () => {
      expect(iter([1, 2, 4]).mean()).toBeCloseTo(2.333333333333333);
    });
  });

  describe('min', () => {
    it('should find minimum value', () => {
      expect(iter([3, 1, 4, 1, 5]).min()).toBe(1);
    });

    it('should return undefined for empty iterator', () => {
      expect(iter([]).min()).toBeUndefined();
    });

    it('should handle negative numbers', () => {
      expect(iter([2, -5, 3]).min()).toBe(-5);
    });
  });

  describe('max', () => {
    it('should find maximum value', () => {
      expect(iter([3, 1, 4, 1, 5]).max()).toBe(5);
    });

    it('should return undefined for empty iterator', () => {
      expect(iter([]).max()).toBeUndefined();
    });

    it('should handle negative numbers', () => {
      expect(iter([-2, -5, -3]).max()).toBe(-2);
    });
  });

  describe('count', () => {
    it('should count elements', () => {
      expect(iter([1, 2, 3]).count()).toBe(3);
    });

    it('should return 0 for empty iterator', () => {
      expect(iter([]).count()).toBe(0);
    });
  });

  describe('median', () => {
    it('should calculate median for odd number of elements', () => {
      expect(iter([1, 3, 2]).median()).toBe(2);
    });

    it('should calculate median for even number of elements', () => {
      expect(iter([1, 2, 3, 4]).median()).toBe(2.5);
    });

    it('should return undefined for empty iterator', () => {
      expect(iter([]).median()).toBeUndefined();
    });

    it('should handle single element', () => {
      expect(iter([42]).median()).toBe(42);
    });

    it('should sort values correctly', () => {
      expect(iter([5, 1, 9, 3]).median()).toBe(4);
    });
  });

  describe('variance', () => {
    it('should calculate variance', () => {
      const variance = iter([1, 2, 3, 4, 5]).variance();
      expect(variance).toBeCloseTo(2);
    });

    it('should return undefined for empty iterator', () => {
      expect(iter([]).variance()).toBeUndefined();
    });

    it('should handle identical values', () => {
      expect(iter([5, 5, 5, 5]).variance()).toBe(0);
    });
  });

  describe('stdDev', () => {
    it('should calculate standard deviation', () => {
      const stdDev = iter([1, 2, 3, 4, 5]).stdDev();
      expect(stdDev).toBeCloseTo(Math.sqrt(2));
    });

    it('should return undefined for empty iterator', () => {
      expect(iter([]).stdDev()).toBeUndefined();
    });

    it('should handle identical values', () => {
      expect(iter([5, 5, 5, 5]).stdDev()).toBe(0);
    });
  });

  describe('percentile', () => {
    it('should calculate percentiles', () => {
      expect(iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).percentile(0)).toBe(1);
      expect(iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).percentile(50)).toBe(5.5);
      expect(iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).percentile(100)).toBe(10);
    });

    it('should throw error for invalid percentile', () => {
      expect(() => iter([1, 2, 3]).percentile(-1)).toThrow('percentile must be between 0 and 100');
      expect(() => iter([1, 2, 3]).percentile(101)).toThrow('percentile must be between 0 and 100');
    });

    it('should return undefined for empty iterator', () => {
      expect(iter([]).percentile(50)).toBeUndefined();
    });

    it('should handle single element', () => {
      expect(iter([42]).percentile(50)).toBe(42);
    });
  });

  describe('mode', () => {
    it('should find single mode', () => {
      expect(iter([1, 2, 2, 3, 3, 3]).mode()).toEqual([3]);
    });

    it('should find multiple modes (bimodal)', () => {
      expect(iter([1, 1, 2, 2, 3]).mode()).toEqual([1, 2]);
    });

    it('should find multiple modes (multimodal)', () => {
      expect(iter([1, 1, 2, 2, 3, 3]).mode()).toEqual([1, 2, 3]);
    });

    it('should return undefined for empty iterator', () => {
      expect(iter([]).mode()).toBeUndefined();
    });

    it('should handle single element', () => {
      expect(iter([42]).mode()).toEqual([42]);
    });

    it('should handle all unique values', () => {
      expect(iter([1, 2, 3, 4, 5]).mode()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should sort modes in ascending order', () => {
      expect(iter([5, 5, 1, 1, 3, 3]).mode()).toEqual([1, 3, 5]);
    });
  });

  describe('quartiles', () => {
    it('should calculate quartiles', () => {
      const result = iter([1, 2, 3, 4, 5, 6, 7, 8, 9]).quartiles();
      expect(result).toBeDefined();
      expect(result!.Q1).toBeCloseTo(3);
      expect(result!.Q2).toBeCloseTo(5);
      expect(result!.Q3).toBeCloseTo(7);
    });

    it('should return undefined for empty iterator', () => {
      expect(iter([]).quartiles()).toBeUndefined();
    });

    it('should handle single element', () => {
      const result = iter([42]).quartiles();
      expect(result).toBeDefined();
      expect(result!.Q1).toBe(42);
      expect(result!.Q2).toBe(42);
      expect(result!.Q3).toBe(42);
    });

    it('should handle small datasets', () => {
      const result = iter([1, 2, 3]).quartiles();
      expect(result).toBeDefined();
      expect(result!.Q1).toBeCloseTo(1.5);
      expect(result!.Q2).toBeCloseTo(2);
      expect(result!.Q3).toBeCloseTo(2.5);
    });

    it('should sort values correctly', () => {
      const result = iter([9, 1, 5, 3, 7]).quartiles();
      expect(result).toBeDefined();
      expect(result!.Q1).toBeCloseTo(3);
      expect(result!.Q2).toBeCloseTo(5);
      expect(result!.Q3).toBeCloseTo(7);
    });
  });

  describe('span', () => {
    it('should calculate span', () => {
      expect(iter([1, 2, 3, 4, 5]).span()).toBe(4);
    });

    it('should return 0 for single element', () => {
      expect(iter([10]).span()).toBe(0);
    });

    it('should return undefined for empty iterator', () => {
      expect(iter([]).span()).toBeUndefined();
    });

    it('should handle negative numbers', () => {
      expect(iter([-5, -1, 3, 7]).span()).toBe(12);
    });

    it('should handle identical values', () => {
      expect(iter([5, 5, 5, 5]).span()).toBe(0);
    });

    it('should handle unsorted values', () => {
      expect(iter([10, 1, 5, 20, 3]).span()).toBe(19);
    });
  });

  describe('product', () => {
    it('should calculate product', () => {
      expect(iter([1, 2, 3, 4, 5]).product()).toBe(120);
    });

    it('should return 1 for empty iterator', () => {
      expect(iter([]).product()).toBe(1);
    });

    it('should handle single element', () => {
      expect(iter([42]).product()).toBe(42);
    });

    it('should handle negative numbers', () => {
      expect(iter([2, -3, 4]).product()).toBe(-24);
    });

    it('should handle decimals', () => {
      expect(iter([2, 3, 0.5]).product()).toBe(3);
    });

    it('should handle zero', () => {
      expect(iter([1, 2, 0, 4]).product()).toBe(0);
    });
  });

  describe('covariance', () => {
    it('should calculate covariance for perfectly correlated sequences', () => {
      const result = iter([1, 2, 3, 4, 5]).covariance([2, 4, 6, 8, 10]);
      expect(result).toBeCloseTo(4);
    });

    it('should calculate covariance for identical sequences', () => {
      const result = iter([1, 2, 3, 4, 5]).covariance([1, 2, 3, 4, 5]);
      expect(result).toBeCloseTo(2);
    });

    it('should return undefined for empty first sequence', () => {
      expect(iter([]).covariance([1, 2, 3])).toBeUndefined();
    });

    it('should return undefined for empty second sequence', () => {
      expect(iter([1, 2, 3]).covariance([])).toBeUndefined();
    });

    it('should return undefined for sequences of different lengths', () => {
      expect(iter([1, 2, 3]).covariance([1, 2])).toBeUndefined();
    });

    it('should handle negative covariance', () => {
      const result = iter([1, 2, 3, 4, 5]).covariance([5, 4, 3, 2, 1]);
      expect(result).toBeCloseTo(-2);
    });

    it('should handle single element sequences', () => {
      const result = iter([42]).covariance([42]);
      expect(result).toBe(0);
    });
  });

  describe('correlation', () => {
    it('should calculate perfect positive correlation', () => {
      const result = iter([1, 2, 3, 4, 5]).correlation([2, 4, 6, 8, 10]);
      expect(result).toBeCloseTo(1);
    });

    it('should calculate perfect negative correlation', () => {
      const result = iter([1, 2, 3, 4, 5]).correlation([5, 4, 3, 2, 1]);
      expect(result).toBeCloseTo(-1);
    });

    it('should calculate no correlation', () => {
      const result = iter([1, 2, 3, 4, 5]).correlation([3, 3, 3, 3, 3]);
      expect(result).toBeUndefined(); // Standard deviation is 0 for constant sequence
    });

    it('should return undefined for empty first sequence', () => {
      expect(iter([]).correlation([1, 2, 3])).toBeUndefined();
    });

    it('should return undefined for empty second sequence', () => {
      expect(iter([1, 2, 3]).correlation([])).toBeUndefined();
    });

    it('should return undefined for sequences of different lengths', () => {
      expect(iter([1, 2, 3]).correlation([1, 2])).toBeUndefined();
    });

    it('should handle identical sequences', () => {
      const result = iter([1, 2, 3, 4, 5]).correlation([1, 2, 3, 4, 5]);
      expect(result).toBeCloseTo(1);
    });

    it('should calculate partial correlation', () => {
      const result = iter([1, 2, 3, 4, 5]).correlation([1, 3, 2, 4, 5]);
      expect(result).toBeDefined();
      expect(result!).toBeGreaterThan(0);
      expect(result!).toBeLessThan(1);
    });
  });
});