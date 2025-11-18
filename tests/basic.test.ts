import { describe, it, expect } from 'vitest';
import { iter } from '../src/index.js';

describe('iterflow Basic Tests', () => {
  describe('Factory function', () => {
    it('should create iterflow from array', () => {
      const flow = iter([1, 2, 3]);
      expect(flow.toArray()).toEqual([1, 2, 3]);
    });

    it('should create iterflow from Set', () => {
      const flow = iter(new Set([1, 2, 3]));
      expect(flow.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('Basic operations', () => {
    it('should map values', () => {
      const result = iter([1, 2, 3])
        .map(x => x * 2)
        .toArray();
      expect(result).toEqual([2, 4, 6]);
    });

    it('should filter values', () => {
      const result = iter([1, 2, 3, 4, 5])
        .filter(x => x % 2 === 0)
        .toArray();
      expect(result).toEqual([2, 4]);
    });

    it('should take limited values', () => {
      const result = iter([1, 2, 3, 4, 5])
        .take(3)
        .toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should drop values', () => {
      const result = iter([1, 2, 3, 4, 5])
        .drop(2)
        .toArray();
      expect(result).toEqual([3, 4, 5]);
    });
  });

  describe('Chain operations', () => {
    it('should chain multiple operations', () => {
      const result = iter([1, 2, 3, 4, 5, 6])
        .filter(x => x % 2 === 0)
        .map(x => x * 2)
        .take(2)
        .toArray();
      expect(result).toEqual([4, 8]);
    });
  });
});