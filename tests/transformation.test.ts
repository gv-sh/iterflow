import { describe, it, expect } from 'vitest';
import { iter } from '../src/index.js';
import * as fn from '../src/fn/index.js';

describe('Additional Transformation Operations', () => {
  describe('flatMap', () => {
    describe('Wrapper API', () => {
      it('should flatten mapped arrays', () => {
        const result = iter([1, 2, 3])
          .flatMap((x) => [x, x * 2])
          .toArray();
        expect(result).toEqual([1, 2, 2, 4, 3, 6]);
      });

      it('should handle empty results', () => {
        const result = iter([1, 2, 3])
          .flatMap((x) => (x % 2 === 0 ? [x] : []))
          .toArray();
        expect(result).toEqual([2]);
      });

      it('should work with strings', () => {
        const result = iter(['hello', 'world'])
          .flatMap((s) => s.split(''))
          .toArray();
        expect(result).toEqual(['h', 'e', 'l', 'l', 'o', 'w', 'o', 'r', 'l', 'd']);
      });
    });

    describe('Functional API', () => {
      it('should flatten mapped arrays', () => {
        const duplicateEach = fn.flatMap((x: number) => [x, x * 2]);
        const result = Array.from(duplicateEach([1, 2, 3]));
        expect(result).toEqual([1, 2, 2, 4, 3, 6]);
      });

      it('should handle empty results', () => {
        const evensOnly = fn.flatMap((x: number) => (x % 2 === 0 ? [x] : []));
        const result = Array.from(evensOnly([1, 2, 3]));
        expect(result).toEqual([2]);
      });
    });
  });

  describe('concat', () => {
    describe('Wrapper API', () => {
      it('should concatenate multiple iterables', () => {
        const result = iter([1, 2]).concat([3, 4], [5, 6]).toArray();
        expect(result).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('should handle empty iterables', () => {
        const result = iter([1, 2]).concat([], [3, 4]).toArray();
        expect(result).toEqual([1, 2, 3, 4]);
      });

      it('should work with single iterable', () => {
        const result = iter([1, 2]).concat([3, 4]).toArray();
        expect(result).toEqual([1, 2, 3, 4]);
      });

      it('should work with no arguments', () => {
        const result = iter([1, 2]).concat().toArray();
        expect(result).toEqual([1, 2]);
      });
    });

    describe('Functional API', () => {
      it('should concatenate multiple iterables', () => {
        const concatAll = fn.concat<number>();
        const result = Array.from(concatAll([1, 2], [3, 4], [5, 6]));
        expect(result).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('should handle empty iterables', () => {
        const concatAll = fn.concat<number>();
        const result = Array.from(concatAll([1, 2], [], [3, 4]));
        expect(result).toEqual([1, 2, 3, 4]);
      });
    });
  });

  describe('intersperse', () => {
    describe('Wrapper API', () => {
      it('should insert separator between elements', () => {
        const result = iter([1, 2, 3]).intersperse(0).toArray();
        expect(result).toEqual([1, 0, 2, 0, 3]);
      });

      it('should work with strings', () => {
        const result = iter(['a', 'b', 'c']).intersperse('-').toArray();
        expect(result).toEqual(['a', '-', 'b', '-', 'c']);
      });

      it('should handle single element', () => {
        const result = iter([1]).intersperse(0).toArray();
        expect(result).toEqual([1]);
      });

      it('should handle empty iterable', () => {
        const result = iter([]).intersperse(0).toArray();
        expect(result).toEqual([]);
      });
    });

    describe('Functional API', () => {
      it('should insert separator between elements', () => {
        const addZeros = fn.intersperse(0);
        const result = Array.from(addZeros([1, 2, 3]));
        expect(result).toEqual([1, 0, 2, 0, 3]);
      });

      it('should work with strings', () => {
        const addCommas = fn.intersperse(',');
        const result = Array.from(addCommas(['a', 'b', 'c']));
        expect(result).toEqual(['a', ',', 'b', ',', 'c']);
      });
    });
  });

  describe('scan', () => {
    describe('Wrapper API', () => {
      it('should emit intermediate accumulator values', () => {
        const result = iter([1, 2, 3, 4])
          .scan((acc, x) => acc + x, 0)
          .toArray();
        expect(result).toEqual([0, 1, 3, 6, 10]);
      });

      it('should work with multiplication', () => {
        const result = iter([1, 2, 3])
          .scan((acc, x) => acc * x, 1)
          .toArray();
        expect(result).toEqual([1, 1, 2, 6]);
      });

      it('should work with string accumulation', () => {
        const result = iter(['a', 'b', 'c'])
          .scan((acc, x) => acc + x, '')
          .toArray();
        expect(result).toEqual(['', 'a', 'ab', 'abc']);
      });

      it('should handle empty iterable', () => {
        const result = iter([]).scan((acc: number, x: number) => acc + x, 0).toArray();
        expect(result).toEqual([0]);
      });
    });

    describe('Functional API', () => {
      it('should emit intermediate accumulator values', () => {
        const runningSum = fn.scan((acc: number, x: number) => acc + x, 0);
        const result = Array.from(runningSum([1, 2, 3, 4]));
        expect(result).toEqual([0, 1, 3, 6, 10]);
      });

      it('should work with multiplication', () => {
        const runningProduct = fn.scan((acc: number, x: number) => acc * x, 1);
        const result = Array.from(runningProduct([2, 3, 4]));
        expect(result).toEqual([1, 2, 6, 24]);
      });
    });
  });

  describe('enumerate', () => {
    describe('Wrapper API', () => {
      it('should add index to each element', () => {
        const result = iter(['a', 'b', 'c']).enumerate().toArray();
        expect(result).toEqual([
          [0, 'a'],
          [1, 'b'],
          [2, 'c'],
        ]);
      });

      it('should work with numbers', () => {
        const result = iter([10, 20, 30]).enumerate().toArray();
        expect(result).toEqual([
          [0, 10],
          [1, 20],
          [2, 30],
        ]);
      });

      it('should handle empty iterable', () => {
        const result = iter([]).enumerate().toArray();
        expect(result).toEqual([]);
      });

      it('should work with filtering', () => {
        const result = iter(['a', 'b', 'c', 'd'])
          .enumerate()
          .filter(([i]) => i % 2 === 0)
          .toArray();
        expect(result).toEqual([
          [0, 'a'],
          [2, 'c'],
        ]);
      });
    });

    describe('Functional API', () => {
      it('should add index to each element', () => {
        const enumerateItems = fn.enumerate<string>();
        const result = Array.from(enumerateItems(['a', 'b', 'c']));
        expect(result).toEqual([
          [0, 'a'],
          [1, 'b'],
          [2, 'c'],
        ]);
      });

      it('should work with numbers', () => {
        const enumerateItems = fn.enumerate<number>();
        const result = Array.from(enumerateItems([10, 20, 30]));
        expect(result).toEqual([
          [0, 10],
          [1, 20],
          [2, 30],
        ]);
      });
    });
  });

  describe('reverse', () => {
    describe('Wrapper API', () => {
      it('should reverse elements', () => {
        const result = iter([1, 2, 3, 4, 5]).reverse().toArray();
        expect(result).toEqual([5, 4, 3, 2, 1]);
      });

      it('should work with strings', () => {
        const result = iter(['a', 'b', 'c']).reverse().toArray();
        expect(result).toEqual(['c', 'b', 'a']);
      });

      it('should handle single element', () => {
        const result = iter([1]).reverse().toArray();
        expect(result).toEqual([1]);
      });

      it('should handle empty iterable', () => {
        const result = iter([]).reverse().toArray();
        expect(result).toEqual([]);
      });

      it('should be chainable', () => {
        const result = iter([1, 2, 3])
          .reverse()
          .map((x) => x * 2)
          .toArray();
        expect(result).toEqual([6, 4, 2]);
      });
    });

    describe('Functional API', () => {
      it('should reverse elements', () => {
        const reverseItems = fn.reverse<number>();
        const result = Array.from(reverseItems([1, 2, 3, 4, 5]));
        expect(result).toEqual([5, 4, 3, 2, 1]);
      });

      it('should work with strings', () => {
        const reverseItems = fn.reverse<string>();
        const result = Array.from(reverseItems(['a', 'b', 'c']));
        expect(result).toEqual(['c', 'b', 'a']);
      });
    });
  });

  describe('sort', () => {
    describe('Wrapper API', () => {
      it('should sort numbers', () => {
        const result = iter([3, 1, 4, 1, 5]).sort().toArray();
        expect(result).toEqual([1, 1, 3, 4, 5]);
      });

      it('should sort strings', () => {
        const result = iter(['c', 'a', 'b']).sort().toArray();
        expect(result).toEqual(['a', 'b', 'c']);
      });

      it('should handle single element', () => {
        const result = iter([1]).sort().toArray();
        expect(result).toEqual([1]);
      });

      it('should handle empty iterable', () => {
        const result = iter([]).sort().toArray();
        expect(result).toEqual([]);
      });

      it('should be chainable', () => {
        const result = iter([3, 1, 4, 1, 5])
          .sort()
          .map((x) => x * 2)
          .toArray();
        expect(result).toEqual([2, 2, 6, 8, 10]);
      });
    });

    describe('Functional API', () => {
      it('should sort numbers', () => {
        const result = Array.from(fn.sort([3, 1, 4, 1, 5]));
        expect(result).toEqual([1, 1, 3, 4, 5]);
      });

      it('should sort strings', () => {
        const result = Array.from(fn.sort(['c', 'a', 'b']));
        expect(result).toEqual(['a', 'b', 'c']);
      });
    });
  });

  describe('sortBy', () => {
    describe('Wrapper API', () => {
      it('should sort with custom comparator (ascending)', () => {
        const result = iter([3, 1, 4, 1, 5])
          .sortBy((a, b) => a - b)
          .toArray();
        expect(result).toEqual([1, 1, 3, 4, 5]);
      });

      it('should sort with custom comparator (descending)', () => {
        const result = iter([3, 1, 4, 1, 5])
          .sortBy((a, b) => b - a)
          .toArray();
        expect(result).toEqual([5, 4, 3, 1, 1]);
      });

      it('should sort by string length', () => {
        const result = iter(['alice', 'bob', 'charlie'])
          .sortBy((a, b) => a.length - b.length)
          .toArray();
        expect(result).toEqual(['bob', 'alice', 'charlie']);
      });

      it('should handle single element', () => {
        const result = iter([1])
          .sortBy((a, b) => a - b)
          .toArray();
        expect(result).toEqual([1]);
      });

      it('should handle empty iterable', () => {
        const result = iter([])
          .sortBy((a: number, b: number) => a - b)
          .toArray();
        expect(result).toEqual([]);
      });
    });

    describe('Functional API', () => {
      it('should sort with custom comparator (ascending)', () => {
        const sortAsc = fn.sortBy((a: number, b: number) => a - b);
        const result = Array.from(sortAsc([3, 1, 4, 1, 5]));
        expect(result).toEqual([1, 1, 3, 4, 5]);
      });

      it('should sort with custom comparator (descending)', () => {
        const sortDesc = fn.sortBy((a: number, b: number) => b - a);
        const result = Array.from(sortDesc([3, 1, 4, 1, 5]));
        expect(result).toEqual([5, 4, 3, 1, 1]);
      });

      it('should sort by string length', () => {
        const sortByLength = fn.sortBy((a: string, b: string) => a.length - b.length);
        const result = Array.from(sortByLength(['alice', 'bob', 'charlie']));
        expect(result).toEqual(['bob', 'alice', 'charlie']);
      });
    });
  });

  describe('Complex chaining with new operations', () => {
    it('should chain multiple new operations', () => {
      const result = iter([1, 2, 3])
        .enumerate()
        .flatMap(([i, v]) => [i, v])
        .intersperse(-1)
        .toArray();
      expect(result).toEqual([0, -1, 1, -1, 1, -1, 2, -1, 2, -1, 3]);
    });

    it('should combine scan with other operations', () => {
      const result = iter([1, 2, 3, 4])
        .scan((acc, x) => acc + x, 0)
        .filter((x) => x > 0)
        .toArray();
      expect(result).toEqual([1, 3, 6, 10]);
    });

    it('should reverse after sorting', () => {
      const result = iter([3, 1, 4, 1, 5])
        .sort()
        .reverse()
        .toArray();
      expect(result).toEqual([5, 4, 3, 1, 1]);
    });

    it('should concat multiple iterators and process', () => {
      const result = iter([1, 2])
        .concat([3, 4], [5, 6])
        .map((x) => x * 2)
        .toArray();
      expect(result).toEqual([2, 4, 6, 8, 10, 12]);
    });

    it('should enumerate and sort by index descending', () => {
      const result = iter(['a', 'b', 'c'])
        .enumerate()
        .sortBy(([i1], [i2]) => i2 - i1)
        .map(([, v]) => v)
        .toArray();
      expect(result).toEqual(['c', 'b', 'a']);
    });
  });
});
