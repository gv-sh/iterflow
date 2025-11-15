import { describe, it, expect } from 'vitest';
import { iter } from '../src/index.js';

describe('Grouping Operations', () => {
  describe('partition', () => {
    it('should split into two groups based on predicate', () => {
      const [evens, odds] = iter([1, 2, 3, 4, 5, 6])
        .partition(x => x % 2 === 0);
      
      expect(evens).toEqual([2, 4, 6]);
      expect(odds).toEqual([1, 3, 5]);
    });

    it('should handle all true predicate', () => {
      const [trues, falses] = iter([2, 4, 6])
        .partition(x => x % 2 === 0);
      
      expect(trues).toEqual([2, 4, 6]);
      expect(falses).toEqual([]);
    });

    it('should handle all false predicate', () => {
      const [trues, falses] = iter([1, 3, 5])
        .partition(x => x % 2 === 0);
      
      expect(trues).toEqual([]);
      expect(falses).toEqual([1, 3, 5]);
    });

    it('should handle empty input', () => {
      const [trues, falses] = iter([])
        .partition(x => x > 0);
      
      expect(trues).toEqual([]);
      expect(falses).toEqual([]);
    });

    it('should work with string predicates', () => {
      const [long, short] = iter(['hello', 'hi', 'world', 'ok'])
        .partition(s => s.length > 3);
      
      expect(long).toEqual(['hello', 'world']);
      expect(short).toEqual(['hi', 'ok']);
    });
  });

  describe('groupBy', () => {
    it('should group by key function', () => {
      const groups = iter([
        { type: 'fruit', name: 'apple' },
        { type: 'vegetable', name: 'carrot' },
        { type: 'fruit', name: 'banana' },
        { type: 'vegetable', name: 'lettuce' }
      ]).groupBy(item => item.type);

      expect(groups.get('fruit')).toEqual([
        { type: 'fruit', name: 'apple' },
        { type: 'fruit', name: 'banana' }
      ]);
      expect(groups.get('vegetable')).toEqual([
        { type: 'vegetable', name: 'carrot' },
        { type: 'vegetable', name: 'lettuce' }
      ]);
    });

    it('should handle numeric grouping', () => {
      const groups = iter([1, 2, 3, 4, 5, 6])
        .groupBy(x => x % 3);

      expect(groups.get(0)).toEqual([3, 6]);
      expect(groups.get(1)).toEqual([1, 4]);
      expect(groups.get(2)).toEqual([2, 5]);
    });

    it('should handle single group', () => {
      const groups = iter([1, 2, 3])
        .groupBy(x => 'same');

      expect(groups.get('same')).toEqual([1, 2, 3]);
      expect(groups.size).toBe(1);
    });

    it('should handle empty input', () => {
      const groups = iter([])
        .groupBy(x => x);

      expect(groups.size).toBe(0);
    });

    it('should handle complex key functions', () => {
      const groups = iter(['apple', 'apricot', 'banana', 'blueberry'])
        .groupBy(word => word[0]);

      expect(groups.get('a')).toEqual(['apple', 'apricot']);
      expect(groups.get('b')).toEqual(['banana', 'blueberry']);
    });
  });

  describe('distinct', () => {
    it('should remove duplicates', () => {
      const result = iter([1, 2, 2, 3, 3, 3, 4])
        .distinct()
        .toArray();
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should preserve order', () => {
      const result = iter([3, 1, 4, 1, 5, 9, 2, 6, 5])
        .distinct()
        .toArray();
      expect(result).toEqual([3, 1, 4, 5, 9, 2, 6]);
    });

    it('should handle empty input', () => {
      const result = iter([])
        .distinct()
        .toArray();
      expect(result).toEqual([]);
    });

    it('should handle no duplicates', () => {
      const result = iter([1, 2, 3, 4])
        .distinct()
        .toArray();
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should work with strings', () => {
      const result = iter(['hello', 'world', 'hello', 'foo'])
        .distinct()
        .toArray();
      expect(result).toEqual(['hello', 'world', 'foo']);
    });
  });

  describe('distinctBy', () => {
    it('should remove duplicates by key function', () => {
      const result = iter([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice Jr' }, // Different name, same id
        { id: 3, name: 'Charlie' }
      ]).distinctBy(person => person.id)
        .toArray();

      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ]);
    });

    it('should work with string length', () => {
      const result = iter(['a', 'bb', 'c', 'dd', 'eee'])
        .distinctBy(s => s.length)
        .toArray();
      expect(result).toEqual(['a', 'bb', 'eee']);
    });

    it('should handle empty input', () => {
      const result = iter([])
        .distinctBy(x => x)
        .toArray();
      expect(result).toEqual([]);
    });

    it('should preserve first occurrence', () => {
      const result = iter([
        { value: 1, label: 'first' },
        { value: 2, label: 'second' },
        { value: 1, label: 'duplicate' }
      ]).distinctBy(item => item.value)
        .toArray();

      expect(result).toEqual([
        { value: 1, label: 'first' },
        { value: 2, label: 'second' }
      ]);
    });
  });
});