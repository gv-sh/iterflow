import { describe, it, expect } from 'vitest';
import { iter } from '../src/index.js';
import * as fn from '../src/fn/index.js';

describe('Terminal Operations', () => {
  describe('reduce', () => {
    it('should reduce numbers to sum', () => {
      const result = iter([1, 2, 3, 4]).reduce((acc, x) => acc + x, 0);
      expect(result).toBe(10);
    });

    it('should reduce strings to concatenation', () => {
      const result = iter(['a', 'b', 'c']).reduce((acc, x) => acc + x, '');
      expect(result).toBe('abc');
    });

    it('should reduce to object', () => {
      const result = iter([1, 2, 3]).reduce(
        (acc, x) => ({ ...acc, [x]: x * 2 }),
        {} as Record<number, number>,
      );
      expect(result).toEqual({ 1: 2, 2: 4, 3: 6 });
    });

    it('should return initial value for empty iterator', () => {
      const result = iter([]).reduce((acc, x) => acc + x, 42);
      expect(result).toBe(42);
    });

    it('should work with functional API', () => {
      const sumAll = fn.reduce((acc: number, x: number) => acc + x, 0);
      expect(sumAll([1, 2, 3, 4])).toBe(10);
    });
  });

  describe('find', () => {
    it('should find first matching element', () => {
      const result = iter([1, 2, 3, 4, 5]).find((x) => x > 3);
      expect(result).toBe(4);
    });

    it('should return undefined if no match', () => {
      const result = iter([1, 2, 3]).find((x) => x > 10);
      expect(result).toBeUndefined();
    });

    it('should return first match when multiple exist', () => {
      const result = iter([1, 2, 3, 4, 5]).find((x) => x > 2);
      expect(result).toBe(3);
    });

    it('should work with objects', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];
      const result = iter(users).find((u) => u.name === 'Bob');
      expect(result).toEqual({ id: 2, name: 'Bob' });
    });

    it('should work with functional API', () => {
      const findGreaterThanThree = fn.find((x: number) => x > 3);
      expect(findGreaterThanThree([1, 2, 3, 4, 5])).toBe(4);
      expect(findGreaterThanThree([1, 2, 3])).toBeUndefined();
    });
  });

  describe('findIndex', () => {
    it('should find index of first matching element', () => {
      const result = iter([1, 2, 3, 4, 5]).findIndex((x) => x > 3);
      expect(result).toBe(3);
    });

    it('should return -1 if no match', () => {
      const result = iter([1, 2, 3]).findIndex((x) => x > 10);
      expect(result).toBe(-1);
    });

    it('should return 0 for first element match', () => {
      const result = iter([5, 2, 3]).findIndex((x) => x > 3);
      expect(result).toBe(0);
    });

    it('should work with functional API', () => {
      const findIndexGreaterThanThree = fn.findIndex((x: number) => x > 3);
      expect(findIndexGreaterThanThree([1, 2, 3, 4, 5])).toBe(3);
      expect(findIndexGreaterThanThree([1, 2, 3])).toBe(-1);
    });
  });

  describe('some', () => {
    it('should return true if any element matches', () => {
      const result = iter([1, 2, 3, 4, 5]).some((x) => x > 3);
      expect(result).toBe(true);
    });

    it('should return false if no element matches', () => {
      const result = iter([1, 2, 3]).some((x) => x > 10);
      expect(result).toBe(false);
    });

    it('should return false for empty iterator', () => {
      const result = iter([]).some((x) => true);
      expect(result).toBe(false);
    });

    it('should short-circuit on first match', () => {
      let count = 0;
      const result = iter([1, 2, 3, 4, 5]).some((x) => {
        count++;
        return x > 2;
      });
      expect(result).toBe(true);
      expect(count).toBe(3); // Should stop after finding 3
    });

    it('should work with functional API', () => {
      const hasGreaterThanThree = fn.some((x: number) => x > 3);
      expect(hasGreaterThanThree([1, 2, 3, 4, 5])).toBe(true);
      expect(hasGreaterThanThree([1, 2, 3])).toBe(false);
    });
  });

  describe('every', () => {
    it('should return true if all elements match', () => {
      const result = iter([2, 4, 6]).every((x) => x % 2 === 0);
      expect(result).toBe(true);
    });

    it('should return false if any element does not match', () => {
      const result = iter([1, 2, 3]).every((x) => x % 2 === 0);
      expect(result).toBe(false);
    });

    it('should return true for empty iterator', () => {
      const result = iter([]).every((x) => false);
      expect(result).toBe(true);
    });

    it('should short-circuit on first non-match', () => {
      let count = 0;
      const result = iter([2, 4, 5, 6, 8]).every((x) => {
        count++;
        return x % 2 === 0;
      });
      expect(result).toBe(false);
      expect(count).toBe(3); // Should stop after finding 5
    });

    it('should work with functional API', () => {
      const allEven = fn.every((x: number) => x % 2 === 0);
      expect(allEven([2, 4, 6])).toBe(true);
      expect(allEven([1, 2, 3])).toBe(false);
    });
  });

  describe('first', () => {
    it('should return first element', () => {
      const result = iter([1, 2, 3]).first();
      expect(result).toBe(1);
    });

    it('should return undefined for empty iterator', () => {
      const result = iter([]).first();
      expect(result).toBeUndefined();
    });

    it('should return default value for empty iterator', () => {
      const result = iter([]).first(42);
      expect(result).toBe(42);
    });

    it('should ignore default value if not empty', () => {
      const result = iter([1, 2, 3]).first(42);
      expect(result).toBe(1);
    });

    it('should work with functional API', () => {
      expect(fn.first([1, 2, 3])).toBe(1);
      expect(fn.first([])).toBeUndefined();
      expect(fn.first([], 0)).toBe(0);
    });
  });

  describe('last', () => {
    it('should return last element', () => {
      const result = iter([1, 2, 3]).last();
      expect(result).toBe(3);
    });

    it('should return undefined for empty iterator', () => {
      const result = iter([]).last();
      expect(result).toBeUndefined();
    });

    it('should return default value for empty iterator', () => {
      const result = iter([]).last(42);
      expect(result).toBe(42);
    });

    it('should ignore default value if not empty', () => {
      const result = iter([1, 2, 3]).last(42);
      expect(result).toBe(3);
    });

    it('should work with single element', () => {
      const result = iter([5]).last();
      expect(result).toBe(5);
    });

    it('should work with functional API', () => {
      expect(fn.last([1, 2, 3])).toBe(3);
      expect(fn.last([])).toBeUndefined();
      expect(fn.last([], 0)).toBe(0);
    });
  });

  describe('nth', () => {
    it('should return element at index', () => {
      const result = iter([1, 2, 3, 4, 5]).nth(2);
      expect(result).toBe(3);
    });

    it('should return first element at index 0', () => {
      const result = iter([1, 2, 3]).nth(0);
      expect(result).toBe(1);
    });

    it('should return undefined for out of bounds index', () => {
      const result = iter([1, 2, 3]).nth(10);
      expect(result).toBeUndefined();
    });

    it('should return undefined for negative index', () => {
      const result = iter([1, 2, 3]).nth(-1);
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty iterator', () => {
      const result = iter([]).nth(0);
      expect(result).toBeUndefined();
    });

    it('should work with functional API', () => {
      const getSecond = fn.nth(2);
      expect(getSecond([1, 2, 3, 4, 5])).toBe(3);
      expect(getSecond([1, 2])).toBeUndefined();
      expect(fn.nth(-1)([1, 2, 3])).toBeUndefined();
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty iterator', () => {
      const result = iter([]).isEmpty();
      expect(result).toBe(true);
    });

    it('should return false for non-empty iterator', () => {
      const result = iter([1]).isEmpty();
      expect(result).toBe(false);
    });

    it('should return false for multiple elements', () => {
      const result = iter([1, 2, 3]).isEmpty();
      expect(result).toBe(false);
    });

    it('should work with functional API', () => {
      expect(fn.isEmpty([])).toBe(true);
      expect(fn.isEmpty([1, 2, 3])).toBe(false);
    });
  });

  describe('includes', () => {
    it('should return true if value exists', () => {
      const result = iter([1, 2, 3, 4, 5]).includes(3);
      expect(result).toBe(true);
    });

    it('should return false if value does not exist', () => {
      const result = iter([1, 2, 3]).includes(10);
      expect(result).toBe(false);
    });

    it('should return false for empty iterator', () => {
      const result = iter([]).includes(1);
      expect(result).toBe(false);
    });

    it('should work with strings', () => {
      const result = iter(['a', 'b', 'c']).includes('b');
      expect(result).toBe(true);
    });

    it('should use strict equality', () => {
      const result = iter([1, 2, 3]).includes('2' as any);
      expect(result).toBe(false);
    });

    it('should work with objects using strict equality', () => {
      const obj = { id: 1 };
      const result = iter([obj, { id: 2 }]).includes(obj);
      expect(result).toBe(true);
    });

    it('should work with functional API', () => {
      const includesThree = fn.includes(3);
      expect(includesThree([1, 2, 3, 4, 5])).toBe(true);
      expect(includesThree([1, 2, 4])).toBe(false);
      expect(fn.includes('b')(['a', 'b', 'c'])).toBe(true);
    });
  });

  describe('Terminal operations chaining', () => {
    it('should work after filter and map', () => {
      const result = iter([1, 2, 3, 4, 5])
        .filter((x) => x % 2 === 0)
        .map((x) => x * 2)
        .reduce((acc, x) => acc + x, 0);
      expect(result).toBe(12); // (2*2 + 4*2) = 4 + 8 = 12
    });

    it('should find after transformation', () => {
      const result = iter([1, 2, 3, 4, 5])
        .map((x) => x * 2)
        .find((x) => x > 5);
      expect(result).toBe(6);
    });

    it('should test conditions after filtering', () => {
      const result = iter([1, 2, 3, 4, 5])
        .filter((x) => x > 2)
        .every((x) => x > 2);
      expect(result).toBe(true);
    });

    it('should get nth after window operation', () => {
      const result = iter([1, 2, 3, 4, 5]).window(2).nth(1);
      expect(result).toEqual([2, 3]);
    });
  });
});
