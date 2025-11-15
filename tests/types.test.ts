import { describe, it, expect, expectTypeOf } from 'vitest';
import { iter } from '../src/index.js';
import type { IterFlow } from '../src/iter-flow.js';

describe('TypeScript Types', () => {
  describe('Type inference', () => {
    it('should infer number type from array', () => {
      const result = iter([1, 2, 3]);
      expectTypeOf(result).toMatchTypeOf<IterFlow<number>>();
    });

    it('should infer string type from string array', () => {
      const result = iter(['a', 'b', 'c']);
      expectTypeOf(result).toMatchTypeOf<IterFlow<string>>();
    });

    it('should preserve type through transformations', () => {
      const result = iter([1, 2, 3])
        .map(x => x.toString())
        .filter(x => x.length > 0);
      
      expectTypeOf(result).toMatchTypeOf<IterFlow<string>>();
    });

    it('should infer union types correctly', () => {
      const mixed: (string | number)[] = [1, 'a', 2, 'b'];
      const result = iter(mixed);
      expectTypeOf(result).toMatchTypeOf<IterFlow<string | number>>();
    });

    it('should infer object types', () => {
      interface Person {
        name: string;
        age: number;
      }
      
      const people: Person[] = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 }
      ];
      
      const result = iter(people);
      expectTypeOf(result).toMatchTypeOf<IterFlow<Person>>();
    });
  });

  describe('Statistical operation type constraints', () => {
    it('should allow sum on number iterators', () => {
      const numbers = iter([1, 2, 3]);
      const result = numbers.sum();
      expectTypeOf(result).toMatchTypeOf<number>();
    });

    it('should allow mean on number iterators', () => {
      const numbers = iter([1, 2, 3]);
      const result = numbers.mean();
      expectTypeOf(result).toMatchTypeOf<number | undefined>();
    });

    it('should allow min/max on number iterators', () => {
      const numbers = iter([1, 2, 3]);
      expectTypeOf(numbers.min()).toMatchTypeOf<number | undefined>();
      expectTypeOf(numbers.max()).toMatchTypeOf<number | undefined>();
    });

    it('should allow advanced stats on number iterators', () => {
      const numbers = iter([1, 2, 3]);
      expectTypeOf(numbers.median()).toMatchTypeOf<number | undefined>();
      expectTypeOf(numbers.variance()).toMatchTypeOf<number | undefined>();
      expectTypeOf(numbers.stdDev()).toMatchTypeOf<number | undefined>();
      expectTypeOf(numbers.percentile(50)).toMatchTypeOf<number | undefined>();
    });

    // Note: These would fail compilation if uncommented
    // it('should NOT allow sum on string iterators', () => {
    //   const strings = iter(['a', 'b', 'c']);
    //   const result = strings.sum(); // TS Error: Type 'IterFlow<string>' is not assignable to parameter
    // });
  });

  describe('Windowing operation types', () => {
    it('should type window operations correctly', () => {
      const numbers = iter([1, 2, 3, 4]);
      const windowed = numbers.window(2);
      expectTypeOf(windowed).toMatchTypeOf<IterFlow<number[]>>();
    });

    it('should type chunk operations correctly', () => {
      const strings = iter(['a', 'b', 'c', 'd']);
      const chunked = strings.chunk(2);
      expectTypeOf(chunked).toMatchTypeOf<IterFlow<string[]>>();
    });

    it('should type pairwise operations correctly', () => {
      const numbers = iter([1, 2, 3, 4]);
      const pairs = numbers.pairwise();
      expectTypeOf(pairs).toMatchTypeOf<IterFlow<[number, number]>>();
    });
  });

  describe('Grouping operation types', () => {
    it('should type partition correctly', () => {
      const numbers = iter([1, 2, 3, 4]);
      const [evens, odds] = numbers.partition(x => x % 2 === 0);
      expectTypeOf(evens).toMatchTypeOf<number[]>();
      expectTypeOf(odds).toMatchTypeOf<number[]>();
    });

    it('should type groupBy correctly', () => {
      interface Item {
        category: string;
        value: number;
      }
      
      const items = iter([
        { category: 'A', value: 1 },
        { category: 'B', value: 2 }
      ]);
      
      const groups = items.groupBy(item => item.category);
      expectTypeOf(groups).toMatchTypeOf<Map<string, Item[]>>();
    });

    it('should infer key type from groupBy function', () => {
      const numbers = iter([1, 2, 3, 4]);
      const groups = numbers.groupBy(x => x % 2 === 0);
      expectTypeOf(groups).toMatchTypeOf<Map<boolean, number[]>>();
    });
  });

  describe('Set operation types', () => {
    it('should preserve type in distinct', () => {
      const strings = iter(['a', 'b', 'a', 'c']);
      const unique = strings.distinct();
      expectTypeOf(unique).toMatchTypeOf<IterFlow<string>>();
    });

    it('should preserve type in distinctBy', () => {
      interface Person {
        id: number;
        name: string;
      }
      
      const people = iter([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]);
      
      const uniqueById = people.distinctBy(p => p.id);
      expectTypeOf(uniqueById).toMatchTypeOf<IterFlow<Person>>();
    });
  });

  describe('Static method types', () => {
    it('should type zip correctly', () => {
      const zipped = iter.zip([1, 2, 3], ['a', 'b', 'c']);
      expectTypeOf(zipped).toMatchTypeOf<IterFlow<[number, string]>>();
    });

    it('should type zipWith correctly', () => {
      const combined = iter.zipWith(
        [1, 2, 3],
        ['a', 'b', 'c'],
        (num, str) => `${num}-${str}`
      );
      expectTypeOf(combined).toMatchTypeOf<IterFlow<string>>();
    });

    it('should type range correctly', () => {
      const range1 = iter.range(5);
      const range2 = iter.range(1, 10);
      const range3 = iter.range(0, 100, 2);
      
      expectTypeOf(range1).toMatchTypeOf<IterFlow<number>>();
      expectTypeOf(range2).toMatchTypeOf<IterFlow<number>>();
      expectTypeOf(range3).toMatchTypeOf<IterFlow<number>>();
    });

    it('should type repeat correctly', () => {
      const repeated1 = iter.repeat('hello', 5);
      const repeated2 = iter.repeat(42);
      
      expectTypeOf(repeated1).toMatchTypeOf<IterFlow<string>>();
      expectTypeOf(repeated2).toMatchTypeOf<IterFlow<number>>();
    });
  });

  describe('Method chaining types', () => {
    it('should maintain types through complex chains', () => {
      const result = iter([1, 2, 3, 4, 5])
        .filter(x => x > 2)           // IterFlow<number>
        .map(x => x.toString())       // IterFlow<string>
        .distinctBy(s => s.length)    // IterFlow<string>
        .chunk(2);                    // IterFlow<string[]>
      
      expectTypeOf(result).toMatchTypeOf<IterFlow<string[]>>();
    });

    it('should handle flatMap type transformations', () => {
      const result = iter(['hello', 'world'])
        .flatMap(word => word.split(''))  // IterFlow<string>
        .distinct();                      // IterFlow<string>
      
      expectTypeOf(result).toMatchTypeOf<IterFlow<string>>();
    });
  });

  describe('Terminal operation types', () => {
    it('should type toArray correctly', () => {
      const strings = iter(['a', 'b', 'c']);
      const array = strings.toArray();
      expectTypeOf(array).toMatchTypeOf<string[]>();
    });

    it('should type count correctly', () => {
      const count = iter([1, 2, 3]).count();
      expectTypeOf(count).toMatchTypeOf<number>();
    });
  });
});