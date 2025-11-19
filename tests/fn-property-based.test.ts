import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fn from '../src/fn/index.js';

describe('Functional API - Property-Based Tests', () => {
  describe('Statistical Operations Properties', () => {
    it('sum should be commutative', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const reversed = [...arr].reverse();
          expect(fn.sum(arr)).toBe(fn.sum(reversed));
        })
      );
    });

    it('sum should equal length * value for uniform arrays', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1000, max: 1000 }),
          fc.nat(100),
          (value, length) => {
            const arr = Array(length).fill(value);
            const result = fn.sum(arr);
            const expected = value * length;
            // Handle signed zero edge case
            if (expected === 0 && result === 0) {
              expect(true).toBe(true);
            } else {
              expect(result).toBe(expected);
            }
          }
        )
      );
    });

    it('mean should be between min and max', () => {
      fc.assert(
        fc.property(fc.array(fc.integer(), { minLength: 1 }), (arr) => {
          const mean = fn.mean(arr);
          const min = fn.min(arr);
          const max = fn.max(arr);
          expect(mean).toBeGreaterThanOrEqual(min!);
          expect(mean).toBeLessThanOrEqual(max!);
        })
      );
    });

    it('count should equal array length', () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), (arr) => {
          expect(fn.count(arr)).toBe(arr.length);
        })
      );
    });

    it('product of empty should be 1', () => {
      expect(fn.product([])).toBe(1);
    });

    it('product with zero should always be zero', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 1 }),
          (arr) => {
            const withZero = [...arr, 0];
            expect(fn.product(withZero)).toBe(0);
          }
        )
      );
    });

    it('min should be less than or equal to all elements', () => {
      fc.assert(
        fc.property(fc.array(fc.integer(), { minLength: 1 }), (arr) => {
          const minimum = fn.min(arr)!;
          arr.forEach((val) => {
            expect(minimum).toBeLessThanOrEqual(val);
          });
        })
      );
    });

    it('max should be greater than or equal to all elements', () => {
      fc.assert(
        fc.property(fc.array(fc.integer(), { minLength: 1 }), (arr) => {
          const maximum = fn.max(arr)!;
          arr.forEach((val) => {
            expect(maximum).toBeGreaterThanOrEqual(val);
          });
        })
      );
    });

    it('median should be the middle value for odd-length sorted arrays', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer(), { minLength: 1, maxLength: 99 }).filter(
            (arr) => arr.length % 2 === 1
          ),
          (arr) => {
            const sorted = [...arr].sort((a, b) => a - b);
            const median = fn.median(arr);
            const middleIndex = Math.floor(sorted.length / 2);
            expect(median).toBe(sorted[middleIndex]);
          }
        )
      );
    });

    it('span should equal max - min', () => {
      fc.assert(
        fc.property(fc.array(fc.integer(), { minLength: 1 }), (arr) => {
          const span = fn.span(arr);
          const min = fn.min(arr);
          const max = fn.max(arr);
          expect(span).toBe(max! - min!);
        })
      );
    });

    it('variance should be non-negative', () => {
      fc.assert(
        fc.property(
          fc.array(fc.float({ noNaN: true, min: -1000, max: 1000 }), {
            minLength: 1,
          }),
          (arr) => {
            const variance = fn.variance(arr);
            if (variance !== undefined && isFinite(variance)) {
              expect(variance).toBeGreaterThanOrEqual(0);
            }
          }
        )
      );
    });

    it('stdDev should be square root of variance', () => {
      fc.assert(
        fc.property(
          fc.array(fc.float({ noNaN: true, min: -1000, max: 1000 }), {
            minLength: 1,
          }),
          (arr) => {
            const variance = fn.variance(arr);
            const stdDev = fn.stdDev(arr);
            if (variance !== undefined && stdDev !== undefined && isFinite(variance)) {
              expect(stdDev).toBeCloseTo(Math.sqrt(variance));
            }
          }
        )
      );
    });
  });

  describe('Transforming Operations Properties', () => {
    it('map should preserve length', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const mapped = fn.map((x: number) => x * 2);
          expect(fn.count(mapped(arr))).toBe(arr.length);
        })
      );
    });

    it('filter should not increase length', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const filtered = fn.filter((x: number) => x > 0);
          expect(fn.count(filtered(arr))).toBeLessThanOrEqual(arr.length);
        })
      );
    });

    it('take should respect limit', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), fc.nat(100), (arr, n) => {
          const taken = fn.take(n);
          const result = Array.from(taken(arr));
          expect(result.length).toBeLessThanOrEqual(n);
          expect(result.length).toBe(Math.min(n, arr.length));
        })
      );
    });

    it('drop should respect count', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), fc.nat(100), (arr, n) => {
          const dropped = fn.drop(n);
          const result = Array.from(dropped(arr));
          expect(result.length).toBe(Math.max(0, arr.length - n));
        })
      );
    });

    it('take then drop should be idempotent at boundaries', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), fc.nat(50), (arr, n) => {
          const takeN = fn.take(n);
          const dropN = fn.drop(n);
          const takeDrop = Array.from(dropN(takeN(arr)));
          expect(takeDrop.length).toBe(0);
        })
      );
    });

    it('map identity should preserve array', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const identity = fn.map((x: number) => x);
          expect(Array.from(identity(arr))).toEqual(arr);
        })
      );
    });

    it('flatMap with singleton should equal map', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const mapDouble = fn.map((x: number) => x * 2);
          const flatMapDouble = fn.flatMap((x: number) => [x * 2]);
          expect(Array.from(mapDouble(arr))).toEqual(
            Array.from(flatMapDouble(arr))
          );
        })
      );
    });

    it('reverse twice should give original', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const rev = fn.reverse<number>();
          expect(Array.from(rev(rev(arr)))).toEqual(arr);
        })
      );
    });

    it('distinct should never increase length', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const result = Array.from(fn.distinct(arr));
          expect(result.length).toBeLessThanOrEqual(arr.length);
        })
      );
    });

    it('distinct should have no duplicates', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const result = Array.from(fn.distinct(arr));
          const uniqueSet = new Set(result);
          expect(uniqueSet.size).toBe(result.length);
        })
      );
    });

    it('scan should have length + 1 of original', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const runningSum = fn.scan((acc: number, x: number) => acc + x, 0);
          const result = Array.from(runningSum(arr));
          expect(result.length).toBe(arr.length + 1);
        })
      );
    });
  });

  describe('Windowing Operations Properties', () => {
    it('window should produce correct number of windows', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer(), { minLength: 0, maxLength: 100 }),
          fc.integer({ min: 1, max: 10 }),
          (arr, size) => {
            const windowFn = fn.window(size);
            const windows = Array.from(windowFn(arr));
            const expected = Math.max(0, arr.length - size + 1);
            expect(windows.length).toBe(expected);
          }
        )
      );
    });

    it('chunk should preserve all elements', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer()),
          fc.integer({ min: 1, max: 10 }),
          (arr, size) => {
            const chunkFn = fn.chunk(size);
            const chunks = Array.from(chunkFn(arr));
            const flattened = chunks.flat();
            expect(flattened).toEqual(arr);
          }
        )
      );
    });

    it('pairwise should produce n-1 pairs for n elements', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer(), { minLength: 0, maxLength: 100 }),
          (arr) => {
            const pairs = Array.from(fn.pairwise(arr));
            expect(pairs.length).toBe(Math.max(0, arr.length - 1));
          }
        )
      );
    });
  });

  describe('Combining Operations Properties', () => {
    it('zip should have length of shorter iterable', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), fc.array(fc.string()), (arr1, arr2) => {
          const zipped = Array.from(fn.zip(arr1, arr2));
          expect(zipped.length).toBe(Math.min(arr1.length, arr2.length));
        })
      );
    });

    it('zipWith should maintain element correspondence', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (arr1, arr2) => {
          const zipped = Array.from(
            fn.zipWith(arr1, arr2, (a, b) => a + b)
          );
          for (let i = 0; i < zipped.length; i++) {
            expect(zipped[i]).toBe(arr1[i]! + arr2[i]!);
          }
        })
      );
    });

    it('chain should concatenate lengths', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer()),
          fc.array(fc.integer()),
          fc.array(fc.integer()),
          (arr1, arr2, arr3) => {
            const chained = Array.from(fn.chain(arr1, arr2, arr3));
            expect(chained.length).toBe(
              arr1.length + arr2.length + arr3.length
            );
          }
        )
      );
    });
  });

  describe('Terminal Operations Properties', () => {
    it('toArray should preserve all elements', () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), (arr) => {
          expect(fn.toArray(arr)).toEqual(arr);
        })
      );
    });

    it('reduce sum should equal sum function', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const sumReduce = fn.reduce((acc: number, x: number) => acc + x, 0);
          expect(sumReduce(arr)).toBe(fn.sum(arr));
        })
      );
    });

    it('some and every should be logical opposites for not', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), fc.integer(), (arr, threshold) => {
          const greaterThan = fn.some((x: number) => x > threshold);
          const notGreaterThan = fn.every((x: number) => x <= threshold);
          // For empty arrays: some is false, every is true
          // For non-empty: some(p) === !every(!p)
          if (arr.length === 0) {
            expect(greaterThan(arr)).toBe(false);
            expect(notGreaterThan(arr)).toBe(true);
          } else {
            expect(greaterThan(arr)).toBe(!notGreaterThan(arr));
          }
        })
      );
    });

    it('first should match index 0', () => {
      fc.assert(
        fc.property(fc.array(fc.integer(), { minLength: 1 }), (arr) => {
          expect(fn.first(arr)).toBe(arr[0]);
        })
      );
    });

    it('last should match index length-1', () => {
      fc.assert(
        fc.property(fc.array(fc.integer(), { minLength: 1 }), (arr) => {
          expect(fn.last(arr)).toBe(arr[arr.length - 1]);
        })
      );
    });

    it('includes should match Array.includes', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), fc.integer(), (arr, val) => {
          const includesVal = fn.includes(val);
          expect(includesVal(arr)).toBe(arr.includes(val));
        })
      );
    });

    it('isEmpty should match zero length', () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), (arr) => {
          expect(fn.isEmpty(arr)).toBe(arr.length === 0);
        })
      );
    });
  });

  describe('Generator Functions Properties', () => {
    it('range should produce correct length', () => {
      fc.assert(
        fc.property(fc.nat(100), (n) => {
          const result = Array.from(fn.range(n));
          expect(result.length).toBe(n);
        })
      );
    });

    it('range with step should respect step', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 50 }),
          fc.integer({ min: 1, max: 10 }),
          (stop, step) => {
            const result = Array.from(fn.range(0, stop, step));
            for (let i = 1; i < result.length; i++) {
              expect(result[i]! - result[i - 1]!).toBe(step);
            }
          }
        )
      );
    });

    it('repeat should produce correct length', () => {
      fc.assert(
        fc.property(fc.anything(), fc.nat(100), (val, times) => {
          const result = Array.from(fn.repeat(val, times));
          expect(result.length).toBe(times);
          expect(result.every((x) => x === val)).toBe(true);
        })
      );
    });
  });

  describe('Grouping Operations Properties', () => {
    it('partition should preserve all elements', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const partitionEvens = fn.partition((x: number) => x % 2 === 0);
          const [evens, odds] = partitionEvens(arr);
          expect(evens.length + odds.length).toBe(arr.length);
        })
      );
    });

    it('groupBy should preserve all elements', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const groupByMod10 = fn.groupBy((x: number) => x % 10);
          const groups = groupByMod10(arr);
          let totalElements = 0;
          for (const group of groups.values()) {
            totalElements += group.length;
          }
          expect(totalElements).toBe(arr.length);
        })
      );
    });
  });

  describe('Composition Properties', () => {
    it('map and filter should be composable', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), (arr) => {
          const double = fn.map((x: number) => x * 2);
          const evens = fn.filter((x: number) => x % 2 === 0);

          // All elements after map should be even
          const result = Array.from(evens(double(arr)));
          expect(result.every((x) => x % 2 === 0)).toBe(true);
        })
      );
    });

    it('take and drop should sum to original length', () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), fc.nat(100), (arr, n) => {
          const takeN = fn.take(n);
          const dropN = fn.drop(n);
          const taken = Array.from(takeN(arr)).length;
          const dropped = Array.from(dropN(arr)).length;
          expect(taken + dropped).toBe(arr.length);
        })
      );
    });
  });
});
