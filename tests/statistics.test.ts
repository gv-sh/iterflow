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
      expect(() => iter([1, 2, 3]).percentile(-1)).toThrow('Percentile must be between 0 and 100');
      expect(() => iter([1, 2, 3]).percentile(101)).toThrow('Percentile must be between 0 and 100');
    });

    it('should return undefined for empty iterator', () => {
      expect(iter([]).percentile(50)).toBeUndefined();
    });

    it('should handle single element', () => {
      expect(iter([42]).percentile(50)).toBe(42);
    });
  });
});