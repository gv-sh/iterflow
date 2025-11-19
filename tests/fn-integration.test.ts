import { describe, it, expect } from 'vitest';
import { iter } from '../src/index.js';
import * as fn from '../src/fn/index.js';

describe('Functional API - Integration with Wrapper API', () => {
  describe('Converting between APIs', () => {
    it('should convert wrapper results to functional API', () => {
      const wrapperResult = iter([1, 2, 3, 4, 5])
        .filter((x) => x % 2 === 0)
        .map((x) => x * 2)
        .toArray();

      const functionalResult = Array.from(
        fn.map((x: number) => x * 2)(fn.filter((x: number) => x % 2 === 0)([1, 2, 3, 4, 5]))
      );

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should use functional API results in wrapper', () => {
      const functionalData = fn.range(1, 6);
      const wrapperResult = iter(functionalData)
        .filter((x) => x % 2 === 0)
        .toArray();

      expect(wrapperResult).toEqual([2, 4]);
    });

    it('should chain functional and wrapper operations', () => {
      const functionalPart = fn.map((x: number) => x * 2);
      const data = [1, 2, 3, 4, 5];

      const result = iter(functionalPart(data))
        .filter((x) => x > 5)
        .toArray();

      expect(result).toEqual([6, 8, 10]);
    });
  });

  describe('Statistical operations comparison', () => {
    it('should produce same sum result', () => {
      const data = [1, 2, 3, 4, 5];
      const wrapperSum = iter(data).sum();
      const functionalSum = fn.sum(data);

      expect(wrapperSum).toBe(functionalSum);
    });

    it('should produce same mean result', () => {
      const data = [1, 2, 3, 4, 5];
      const wrapperMean = iter(data).mean();
      const functionalMean = fn.mean(data);

      expect(wrapperMean).toBe(functionalMean);
    });

    it('should produce same min result', () => {
      const data = [3, 1, 4, 1, 5];
      const wrapperMin = iter(data).min();
      const functionalMin = fn.min(data);

      expect(wrapperMin).toBe(functionalMin);
    });

    it('should produce same max result', () => {
      const data = [3, 1, 4, 1, 5];
      const wrapperMax = iter(data).max();
      const functionalMax = fn.max(data);

      expect(wrapperMax).toBe(functionalMax);
    });

    it('should produce same count result', () => {
      const data = [1, 2, 3, 4, 5];
      const wrapperCount = iter(data).count();
      const functionalCount = fn.count(data);

      expect(wrapperCount).toBe(functionalCount);
    });

    it('should produce same median result', () => {
      const data = [1, 2, 3, 4, 5];
      const wrapperMedian = iter(data).median();
      const functionalMedian = fn.median(data);

      expect(wrapperMedian).toBe(functionalMedian);
    });

    it('should produce same variance result', () => {
      const data = [1, 2, 3, 4, 5];
      const wrapperVariance = iter(data).variance();
      const functionalVariance = fn.variance(data);

      expect(wrapperVariance).toBeCloseTo(functionalVariance!);
    });

    it('should produce same stdDev result', () => {
      const data = [1, 2, 3, 4, 5];
      const wrapperStdDev = iter(data).stdDev();
      const functionalStdDev = fn.stdDev(data);

      expect(wrapperStdDev).toBeCloseTo(functionalStdDev!);
    });

    it('should produce same percentile result', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const wrapperPercentile = iter(data).percentile(50);
      const functionalPercentile = fn.percentile(data, 50);

      expect(wrapperPercentile).toBe(functionalPercentile);
    });

    it('should produce same mode result', () => {
      const data = [1, 2, 2, 3, 3, 3];
      const wrapperMode = iter(data).mode();
      const functionalMode = fn.mode(data);

      expect(wrapperMode).toEqual(functionalMode);
    });

    it('should produce same quartiles result', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const wrapperQuartiles = iter(data).quartiles();
      const functionalQuartiles = fn.quartiles(data);

      expect(wrapperQuartiles).toEqual(functionalQuartiles);
    });

    it('should produce same span result', () => {
      const data = [1, 2, 3, 4, 5];
      const wrapperSpan = iter(data).span();
      const functionalSpan = fn.span(data);

      expect(wrapperSpan).toBe(functionalSpan);
    });

    it('should produce same product result', () => {
      const data = [1, 2, 3, 4, 5];
      const wrapperProduct = iter(data).product();
      const functionalProduct = fn.product(data);

      expect(wrapperProduct).toBe(functionalProduct);
    });
  });

  describe('Transformation operations comparison', () => {
    it('should produce same map result', () => {
      const data = [1, 2, 3];
      const mapper = (x: number) => x * 2;

      const wrapperResult = iter(data).map(mapper).toArray();
      const functionalResult = Array.from(fn.map(mapper)(data));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same filter result', () => {
      const data = [1, 2, 3, 4, 5];
      const predicate = (x: number) => x % 2 === 0;

      const wrapperResult = iter(data).filter(predicate).toArray();
      const functionalResult = Array.from(fn.filter(predicate)(data));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same take result', () => {
      const data = [1, 2, 3, 4, 5];

      const wrapperResult = iter(data).take(3).toArray();
      const functionalResult = Array.from(fn.take(3)(data));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same drop result', () => {
      const data = [1, 2, 3, 4, 5];

      const wrapperResult = iter(data).drop(2).toArray();
      const functionalResult = Array.from(fn.drop(2)(data));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same flatMap result', () => {
      const data = [1, 2, 3];
      const mapper = (x: number) => [x, x * 2];

      const wrapperResult = iter(data).flatMap(mapper).toArray();
      const functionalResult = Array.from(fn.flatMap(mapper)(data));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same reverse result', () => {
      const data = [1, 2, 3, 4, 5];

      const wrapperResult = iter(data).reverse().toArray();
      const functionalResult = Array.from(fn.reverse()(data));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same distinct result', () => {
      const data = [1, 2, 2, 3, 1, 4];

      const wrapperResult = iter(data).distinct().toArray();
      const functionalResult = Array.from(fn.distinct(data));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same distinctBy result', () => {
      const data = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Charlie'}];
      const keyFn = (x: typeof data[0]) => x.id;

      const wrapperResult = iter(data).distinctBy(keyFn).toArray();
      const functionalResult = Array.from(fn.distinctBy(keyFn)(data));

      expect(wrapperResult).toEqual(functionalResult);
    });
  });

  describe('Windowing operations comparison', () => {
    it('should produce same window result', () => {
      const data = [1, 2, 3, 4, 5];

      const wrapperResult = iter(data).window(3).toArray();
      const functionalResult = Array.from(fn.window(3)(data));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same chunk result', () => {
      const data = [1, 2, 3, 4, 5];

      const wrapperResult = iter(data).chunk(2).toArray();
      const functionalResult = Array.from(fn.chunk(2)(data));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same pairwise result', () => {
      const data = [1, 2, 3, 4];

      const wrapperResult = iter(data).pairwise().toArray();
      const functionalResult = Array.from(fn.pairwise(data));

      expect(wrapperResult).toEqual(functionalResult);
    });
  });

  describe('Terminal operations comparison', () => {
    it('should produce same reduce result', () => {
      const data = [1, 2, 3, 4];
      const reducer = (acc: number, x: number) => acc + x;

      const wrapperResult = iter(data).reduce(reducer, 0);
      const functionalResult = fn.reduce(reducer, 0)(data);

      expect(wrapperResult).toBe(functionalResult);
    });

    it('should produce same find result', () => {
      const data = [1, 2, 3, 4, 5];
      const predicate = (x: number) => x > 3;

      const wrapperResult = iter(data).find(predicate);
      const functionalResult = fn.find(predicate)(data);

      expect(wrapperResult).toBe(functionalResult);
    });

    it('should produce same findIndex result', () => {
      const data = [1, 2, 3, 4, 5];
      const predicate = (x: number) => x > 3;

      const wrapperResult = iter(data).findIndex(predicate);
      const functionalResult = fn.findIndex(predicate)(data);

      expect(wrapperResult).toBe(functionalResult);
    });

    it('should produce same some result', () => {
      const data = [1, 2, 3, 4, 5];
      const predicate = (x: number) => x > 3;

      const wrapperResult = iter(data).some(predicate);
      const functionalResult = fn.some(predicate)(data);

      expect(wrapperResult).toBe(functionalResult);
    });

    it('should produce same every result', () => {
      const data = [2, 4, 6];
      const predicate = (x: number) => x % 2 === 0;

      const wrapperResult = iter(data).every(predicate);
      const functionalResult = fn.every(predicate)(data);

      expect(wrapperResult).toBe(functionalResult);
    });

    it('should produce same first result', () => {
      const data = [1, 2, 3];

      const wrapperResult = iter(data).first();
      const functionalResult = fn.first(data);

      expect(wrapperResult).toBe(functionalResult);
    });

    it('should produce same last result', () => {
      const data = [1, 2, 3];

      const wrapperResult = iter(data).last();
      const functionalResult = fn.last(data);

      expect(wrapperResult).toBe(functionalResult);
    });

    it('should produce same nth result', () => {
      const data = [1, 2, 3, 4, 5];

      const wrapperResult = iter(data).nth(2);
      const functionalResult = fn.nth(2)(data);

      expect(wrapperResult).toBe(functionalResult);
    });

    it('should produce same isEmpty result', () => {
      const data: number[] = [];

      const wrapperResult = iter(data).isEmpty();
      const functionalResult = fn.isEmpty(data);

      expect(wrapperResult).toBe(functionalResult);
    });

    it('should produce same includes result', () => {
      const data = [1, 2, 3, 4, 5];

      const wrapperResult = iter(data).includes(3);
      const functionalResult = fn.includes(3)(data);

      expect(wrapperResult).toBe(functionalResult);
    });
  });

  describe('Combining operations comparison', () => {
    it('should produce same zip result', () => {
      const data1 = [1, 2, 3];
      const data2 = ['a', 'b', 'c'];

      const wrapperResult = iter.zip(data1, data2).toArray();
      const functionalResult = Array.from(fn.zip(data1, data2));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same zipWith result', () => {
      const data1 = [1, 2, 3];
      const data2 = [10, 20, 30];
      const combiner = (a: number, b: number) => a + b;

      const wrapperResult = iter.zipWith(data1, data2, combiner).toArray();
      const functionalResult = Array.from(fn.zipWith(data1, data2, combiner));

      expect(wrapperResult).toEqual(functionalResult);
    });
  });

  describe('Generator operations comparison', () => {
    it('should produce same range result', () => {
      const wrapperResult = iter.range(5).toArray();
      const functionalResult = Array.from(fn.range(5));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same range with start/stop result', () => {
      const wrapperResult = iter.range(2, 7).toArray();
      const functionalResult = Array.from(fn.range(2, 7));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same range with step result', () => {
      const wrapperResult = iter.range(0, 10, 2).toArray();
      const functionalResult = Array.from(fn.range(0, 10, 2));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same repeat result', () => {
      const wrapperResult = iter.repeat('x', 3).toArray();
      const functionalResult = Array.from(fn.repeat('x', 3));

      expect(wrapperResult).toEqual(functionalResult);
    });
  });

  describe('Interleaving operations comparison', () => {
    it('should produce same interleave result', () => {
      const wrapperResult = iter.interleave([1, 2, 3], [4, 5, 6]).toArray();
      const functionalResult = Array.from(fn.interleave([1, 2, 3], [4, 5, 6]));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same merge result', () => {
      const wrapperResult = iter.merge([1, 3, 5], [2, 4, 6]).toArray();
      const functionalResult = Array.from(fn.merge([1, 3, 5], [2, 4, 6]));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same chain result', () => {
      const wrapperResult = iter.chain([1, 2], [3, 4], [5, 6]).toArray();
      const functionalResult = Array.from(fn.chain([1, 2], [3, 4], [5, 6]));

      expect(wrapperResult).toEqual(functionalResult);
    });
  });

  describe('Complex pipeline comparisons', () => {
    it('should produce same result for complex wrapper pipeline', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const wrapperResult = iter(data)
        .filter((x) => x % 2 === 0)
        .map((x) => x * 2)
        .take(3)
        .toArray();

      const filterFn = fn.filter((x: number) => x % 2 === 0);
      const mapFn = fn.map((x: number) => x * 2);
      const takeFn = fn.take(3);

      const functionalResult = Array.from(takeFn(mapFn(filterFn(data))));

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should produce same statistical result after transformations', () => {
      const data = [1, 2, 3, 4, 5];

      const wrapperSum = iter(data).map((x) => x * 2).sum();

      const mapFn = fn.map((x: number) => x * 2);
      const functionalSum = fn.sum(mapFn(data));

      expect(wrapperSum).toBe(functionalSum);
    });

    it('should handle composition with groupBy', () => {
      const data = ['alice', 'bob', 'charlie', 'dave'];
      const keyFn = (s: string) => s.length;

      const wrapperResult = iter(data).groupBy(keyFn);
      const functionalResult = fn.groupBy(keyFn)(data);

      expect(wrapperResult).toEqual(functionalResult);
    });

    it('should handle composition with partition', () => {
      const data = [1, 2, 3, 4, 5];
      const predicate = (x: number) => x % 2 === 0;

      const wrapperResult = iter(data).partition(predicate);
      const functionalResult = fn.partition(predicate)(data);

      expect(wrapperResult).toEqual(functionalResult);
    });
  });

  describe('Mixed API usage patterns', () => {
    it('should allow using functional API within wrapper chains', () => {
      const data = [1, 2, 3, 4, 5];

      // Use functional map within wrapper chain
      const functionalMapper = fn.map((x: number) => x * 2);
      const result = iter(functionalMapper(data))
        .filter((x) => x > 5)
        .sum();

      expect(result).toBe(6 + 8 + 10); // 24
    });

    it('should allow passing wrapper results to functional operations', () => {
      const wrapperData = iter.range(1, 6); // Returns IterFlow

      // Use functional operations on wrapper result
      const filterFn = fn.filter((x: number) => x % 2 === 0);
      const result = fn.sum(filterFn(wrapperData));

      expect(result).toBe(2 + 4); // 6
    });

    it('should compose functional utilities with wrapper methods', () => {
      const data = [1, 2, 3, 4, 5];

      // Functional composition
      const double = fn.map((x: number) => x * 2);
      const evens = fn.filter((x: number) => x % 2 === 0);

      // Mix with wrapper
      const result = iter(data)
        .map((x) => x + 1) // [2, 3, 4, 5, 6]
        .toArray();

      const functionalResult = Array.from(evens(double(result)));
      expect(functionalResult).toEqual([4, 6, 8, 10, 12]);
    });

    it('should allow functional scan with wrapper aggregation', () => {
      const data = [1, 2, 3, 4];
      const scanFn = fn.scan((acc: number, x: number) => acc + x, 0);

      const result = iter(scanFn(data)).last();
      expect(result).toBe(10); // Final accumulated value
    });

    it('should work with functional generators and wrapper transformations', () => {
      const rangeData = fn.range(1, 11);
      const repeatData = fn.repeat(2, 5);

      const result1 = iter(rangeData).filter((x) => x % 2 === 0).sum();
      const result2 = iter(repeatData).sum();

      expect(result1).toBe(2 + 4 + 6 + 8 + 10); // 30
      expect(result2).toBe(10);
    });
  });

  describe('Performance equivalence', () => {
    it('should lazily evaluate in both APIs', () => {
      let wrapperCount = 0;
      let functionalCount = 0;

      const data = [1, 2, 3, 4, 5];

      // Wrapper API
      const wrapperResult = iter(data)
        .map((x) => {
          wrapperCount++;
          return x * 2;
        })
        .take(2)
        .toArray();

      // Functional API
      const mapFn = fn.map((x: number) => {
        functionalCount++;
        return x * 2;
      });
      const takeFn = fn.take(2);
      const functionalResult = Array.from(takeFn(mapFn(data)));

      // Both APIs evaluate lazily and should only process what's needed
      // Both implementations might process slightly more than strictly necessary
      // due to how generators and iterators work
      expect(wrapperCount).toBeLessThanOrEqual(3);
      expect(functionalCount).toBeLessThanOrEqual(3);
      expect(wrapperResult).toEqual(functionalResult);
      expect(wrapperResult.length).toBe(2);
    });
  });

  describe('Type compatibility', () => {
    it('should maintain type safety across API boundaries', () => {
      const numbers = [1, 2, 3, 4, 5];

      // Functional to wrapper (numbers -> strings)
      const mapToString = fn.map((x: number) => x.toString());
      const strings = iter(mapToString(numbers)).toArray();

      // Type should be string[]
      const firstString: string = strings[0]!;
      expect(typeof firstString).toBe('string');
    });

    it('should handle complex type transformations', () => {
      type Person = { name: string; age: number };
      const people: Person[] = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
      ];

      // Functional extraction
      const extractAge = fn.map((p: Person) => p.age);
      const ages = iter(extractAge(people)).toArray();

      expect(ages).toEqual([30, 25]);
    });
  });
});
