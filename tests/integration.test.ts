import { describe, it, expect } from 'vitest';
import { iter } from '../src/index.js';

describe('Integration Tests', () => {
  describe('Method chaining', () => {
    it('should chain filter, map, and statistical operations', () => {
      const result = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .filter(x => x % 2 === 0)  // [2, 4, 6, 8, 10]
        .map(x => x * 2)           // [4, 8, 12, 16, 20]
        .sum();                    // 60
      
      expect(result).toBe(60);
    });

    it('should chain windowing with aggregation', () => {
      const result = iter([1, 2, 3, 4, 5])
        .window(3)                 // [[1,2,3], [2,3,4], [3,4,5]]
        .map(window => window.reduce((a, b) => a + b, 0)) // [6, 9, 12]
        .max();                    // 12
      
      expect(result).toBe(12);
    });

    it('should chain distinct with grouping', () => {
      const result = iter([
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 1 }, // duplicate
        { category: 'A', value: 3 },
        { category: 'B', value: 4 }
      ])
        .distinctBy(item => `${item.category}-${item.value}`)
        .groupBy(item => item.category);

      expect(result.get('A')).toEqual([
        { category: 'A', value: 1 },
        { category: 'A', value: 3 }
      ]);
      expect(result.get('B')).toEqual([
        { category: 'B', value: 2 },
        { category: 'B', value: 4 }
      ]);
    });

    it('should chain multiple transformations', () => {
      const result = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .filter(x => x > 3)        // [4, 5, 6, 7, 8, 9, 10]
        .take(5)                   // [4, 5, 6, 7, 8]
        .map(x => x ** 2)          // [16, 25, 36, 49, 64]
        .chunk(2)                  // [[16, 25], [36, 49], [64]]
        .map(chunk => chunk.reduce((a, b) => a + b, 0)) // [41, 85, 64]
        .toArray();
      
      expect(result).toEqual([41, 85, 64]);
    });

    it('should handle complex data processing pipeline', () => {
      interface Sale {
        product: string;
        amount: number;
        category: string;
        date: string;
      }

      const sales: Sale[] = [
        { product: 'Laptop', amount: 1200, category: 'Electronics', date: '2024-01' },
        { product: 'Mouse', amount: 25, category: 'Electronics', date: '2024-01' },
        { product: 'Book', amount: 15, category: 'Books', date: '2024-01' },
        { product: 'Phone', amount: 800, category: 'Electronics', date: '2024-02' },
        { product: 'Novel', amount: 12, category: 'Books', date: '2024-02' }
      ];

      const electronicsAverage = iter(sales)
        .filter(sale => sale.category === 'Electronics')
        .map(sale => sale.amount)
        .mean();

      expect(electronicsAverage).toBe((1200 + 25 + 800) / 3);
    });

    it('should chain utility operations', () => {
      const sideEffects: number[] = [];
      
      const result = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .takeWhile(x => x <= 7)    // [1, 2, 3, 4, 5, 6, 7]
        .tap(x => sideEffects.push(x)) // Record each value
        .dropWhile(x => x < 3)     // [3, 4, 5, 6, 7]
        .pairwise()                // [[3,4], [4,5], [5,6], [6,7]]
        .map(([a, b]) => b - a)    // [1, 1, 1, 1]
        .distinct()                // [1]
        .toArray();

      expect(result).toEqual([1]);
      expect(sideEffects).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('Static methods integration', () => {
    it('should combine zip with other operations', () => {
      const names = ['Alice', 'Bob', 'Charlie'];
      const ages = [25, 30, 35];
      
      const result = iter.zip(names, ages)
        .filter(([name, age]) => age >= 30)
        .map(([name, age]) => ({ name, age }))
        .toArray();

      expect(result).toEqual([
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 }
      ]);
    });

    it('should use zipWith for calculations', () => {
      const prices = [10, 20, 30];
      const quantities = [2, 3, 1];
      
      const total = iter.zipWith(prices, quantities, (price, qty) => price * qty)
        .sum();

      expect(total).toBe(20 + 60 + 30); // 110
    });

    it('should combine range with statistical operations', () => {
      const variance = iter.range(1, 11) // [1, 2, 3, ..., 10]
        .variance();

      // Variance of 1,2,3,...,10 should be approximately 8.25
      expect(variance).toBeCloseTo(8.25);
    });

    it('should use repeat with take and statistics', () => {
      const mean = iter.repeat(5, 10)  // [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
        .mean();

      expect(mean).toBe(5);
      
      const count = iter.repeat(42)
        .take(100)
        .count();
        
      expect(count).toBe(100);
    });
  });

  describe('Performance considerations', () => {
    it('should handle lazy evaluation correctly', () => {
      let computationCount = 0;
      
      const expensiveMap = (x: number) => {
        computationCount++;
        return x * 2;
      };

      // Create the iterator but don't consume it yet
      const lazyResult = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .map(expensiveMap)
        .filter(x => x > 10);

      // Should not have computed anything yet
      expect(computationCount).toBe(0);

      // Now consume only first 2 results
      const firstTwo = lazyResult.take(2).toArray();
      
      // Should have computed only what was necessary
      expect(firstTwo).toEqual([12, 14]); // 6*2, 7*2
      expect(computationCount).toBeGreaterThanOrEqual(6); // Should have computed at least 1,2,3,4,5,6 to get first 2 results > 10
      expect(computationCount).toBeLessThanOrEqual(8); // But not too many more
    });

    it('should work with infinite sequences', () => {
      const fibonacci = function* () {
        let a = 0, b = 1;
        while (true) {
          yield a;
          [a, b] = [b, a + b];
        }
      };

      const result = iter(fibonacci())
        .filter(x => x % 2 === 0)  // Even fibonacci numbers
        .take(5)                   // First 5 even ones
        .toArray();

      expect(result).toEqual([0, 2, 8, 34, 144]);
    });
  });
});