import { describe, it, expect } from 'vitest';
import { iter } from '../src/index.js';

describe('Windowing Operations', () => {
  describe('window', () => {
    it('should create sliding windows', () => {
      const result = iter([1, 2, 3, 4, 5])
        .window(2)
        .toArray();
      expect(result).toEqual([[1, 2], [2, 3], [3, 4], [4, 5]]);
    });

    it('should handle window size larger than input', () => {
      const result = iter([1, 2])
        .window(5)
        .toArray();
      expect(result).toEqual([]);
    });

    it('should handle window size of 1', () => {
      const result = iter([1, 2, 3])
        .window(1)
        .toArray();
      expect(result).toEqual([[1], [2], [3]]);
    });

    it('should handle empty input', () => {
      const result = iter([])
        .window(2)
        .toArray();
      expect(result).toEqual([]);
    });

    it('should throw error for invalid window size', () => {
      expect(() => iter([1, 2, 3]).window(0)).toThrow('size must be at least 1');
      expect(() => iter([1, 2, 3]).window(-1)).toThrow('size must be at least 1');
    });

    it('should handle larger windows', () => {
      const result = iter([1, 2, 3, 4, 5, 6])
        .window(3)
        .toArray();
      expect(result).toEqual([[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6]]);
    });
  });

  describe('chunk', () => {
    it('should create non-overlapping chunks', () => {
      const result = iter([1, 2, 3, 4, 5])
        .chunk(2)
        .toArray();
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle exact division', () => {
      const result = iter([1, 2, 3, 4, 5, 6])
        .chunk(3)
        .toArray();
      expect(result).toEqual([[1, 2, 3], [4, 5, 6]]);
    });

    it('should handle chunk size of 1', () => {
      const result = iter([1, 2, 3])
        .chunk(1)
        .toArray();
      expect(result).toEqual([[1], [2], [3]]);
    });

    it('should handle empty input', () => {
      const result = iter([])
        .chunk(2)
        .toArray();
      expect(result).toEqual([]);
    });

    it('should throw error for invalid chunk size', () => {
      expect(() => iter([1, 2, 3]).chunk(0)).toThrow('size must be at least 1');
      expect(() => iter([1, 2, 3]).chunk(-1)).toThrow('size must be at least 1');
    });

    it('should handle chunk size larger than input', () => {
      const result = iter([1, 2])
        .chunk(5)
        .toArray();
      expect(result).toEqual([[1, 2]]);
    });
  });

  describe('pairwise', () => {
    it('should create pairs of consecutive elements', () => {
      const result = iter([1, 2, 3, 4, 5])
        .pairwise()
        .toArray();
      expect(result).toEqual([[1, 2], [2, 3], [3, 4], [4, 5]]);
    });

    it('should handle two elements', () => {
      const result = iter([1, 2])
        .pairwise()
        .toArray();
      expect(result).toEqual([[1, 2]]);
    });

    it('should handle single element', () => {
      const result = iter([1])
        .pairwise()
        .toArray();
      expect(result).toEqual([]);
    });

    it('should handle empty input', () => {
      const result = iter([])
        .pairwise()
        .toArray();
      expect(result).toEqual([]);
    });
  });
});