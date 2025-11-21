import { describe, it, expect } from 'vitest';
import { iter } from '../../src/index.js';

/**
 * Production Load Testing Suite
 *
 * Tests iterflow performance and correctness with large-scale datasets
 * that represent realistic production scenarios.
 */

describe('Load Testing - Large Datasets', () => {
  describe('Processing large data streams', () => {
    it('should handle 1 million item transformations efficiently', () => {
      const MILLION = 1_000_000;

      function* largeDataset() {
        for (let i = 0; i < MILLION; i++) {
          yield i;
        }
      }

      const result = iter(largeDataset())
        .filter(x => x % 2 === 0)
        .map(x => x * 2)
        .take(1000)
        .toArray();

      expect(result).toHaveLength(1000);
      expect(result[0]).toBe(0);
      expect(result[999]).toBe(3996);
    });

    it('should process 10 million items with statistical operations', () => {
      const TEN_MILLION = 10_000_000;

      function* largeDataset() {
        for (let i = 1; i <= TEN_MILLION; i++) {
          yield i;
        }
      }

      // Sample every 1000th item for statistics
      const result = iter(largeDataset())
        .filter((_, idx) => idx % 1000 === 0)
        .take(10000)
        .mean();

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(TEN_MILLION);
    });

    it('should handle large arrays with complex transformations', () => {
      const largeArray = Array.from({ length: 100_000 }, (_, i) => ({
        id: i,
        value: Math.random() * 1000,
        category: i % 10,
        timestamp: Date.now() + i,
      }));

      const result = iter(largeArray)
        .filter(item => item.value > 500)
        .groupBy(item => item.category);

      expect(result.size).toBeGreaterThan(0);
      expect(result.size).toBeLessThanOrEqual(10);

      // Verify all groups have data
      for (const [category, items] of result) {
        expect(Array.isArray(items)).toBe(true);
        expect(items.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Memory-intensive operations', () => {
    it('should handle large windowing operations', () => {
      const LARGE_SIZE = 100_000;
      const data = Array.from({ length: LARGE_SIZE }, (_, i) => i);

      const windows = iter(data)
        .window(1000)
        .take(100)
        .toArray();

      expect(windows).toHaveLength(100);
      expect(windows[0]).toHaveLength(1000);
      expect(windows[99]).toHaveLength(1000);
    });

    it('should handle large chunking operations', () => {
      const LARGE_SIZE = 500_000;

      function* generator() {
        for (let i = 0; i < LARGE_SIZE; i++) {
          yield i;
        }
      }

      const chunks = iter(generator())
        .chunk(5000)
        .take(50)
        .toArray();

      expect(chunks).toHaveLength(50);
      expect(chunks[0]).toHaveLength(5000);
      expect(chunks[49]).toHaveLength(5000);
    });

    it('should process large grouped datasets', () => {
      const LARGE_SIZE = 200_000;
      const data = Array.from({ length: LARGE_SIZE }, (_, i) => ({
        category: `cat_${i % 100}`,
        value: Math.random() * 1000,
      }));

      const grouped = iter(data).groupBy(item => item.category);

      expect(grouped.size).toBe(100);

      // Calculate mean for each group
      const categoryMeans = new Map<string, number>();
      for (const [category, items] of grouped) {
        const mean = iter(items).map(item => item.value).mean();
        categoryMeans.set(category, mean);
      }

      expect(categoryMeans.size).toBe(100);
    });
  });

  describe('Complex pipeline stress tests', () => {
    it('should handle deeply nested transformations', () => {
      const data = Array.from({ length: 50_000 }, (_, i) => i);

      const result = iter(data)
        .filter(x => x % 3 === 0)
        .map(x => x * 2)
        .window(10)
        .map(win => win.reduce((a, b) => a + b, 0))
        .filter(sum => sum > 100)
        .chunk(5)
        .map(chunk => chunk.reduce((a, b) => a + b, 0))
        .take(100)
        .toArray();

      expect(result).toHaveLength(100);
      expect(result.every(val => val > 0)).toBe(true);
    });

    it('should handle large-scale statistical computations', () => {
      const DATASET_SIZE = 100_000;
      const data = Array.from({ length: DATASET_SIZE }, () =>
        Math.random() * 100
      );

      const stats = {
        mean: iter(data).mean(),
        median: iter(data).median(),
        min: iter(data).min(),
        max: iter(data).max(),
        sum: iter(data).sum(),
        variance: iter(data).variance(),
        stddev: iter(data).stddev(),
      };

      expect(stats.mean).toBeGreaterThan(0);
      expect(stats.mean).toBeLessThan(100);
      expect(stats.median).toBeGreaterThan(0);
      expect(stats.median).toBeLessThan(100);
      expect(stats.min).toBeGreaterThanOrEqual(0);
      expect(stats.max).toBeLessThanOrEqual(100);
      expect(stats.sum).toBeGreaterThan(0);
      expect(stats.variance).toBeGreaterThan(0);
      expect(stats.stddev).toBeGreaterThan(0);
    });
  });

  describe('Concurrent data processing scenarios', () => {
    it('should handle multiple large pipelines simultaneously', () => {
      const data1 = Array.from({ length: 50_000 }, (_, i) => i);
      const data2 = Array.from({ length: 50_000 }, (_, i) => i * 2);
      const data3 = Array.from({ length: 50_000 }, (_, i) => i * 3);

      const [result1, result2, result3] = [
        iter(data1).filter(x => x % 2 === 0).take(1000).toArray(),
        iter(data2).filter(x => x % 3 === 0).take(1000).toArray(),
        iter(data3).filter(x => x % 5 === 0).take(1000).toArray(),
      ];

      expect(result1).toHaveLength(1000);
      expect(result2).toHaveLength(1000);
      expect(result3).toHaveLength(1000);
    });

    it('should handle interleaving of large iterators', () => {
      const iter1 = Array.from({ length: 10_000 }, (_, i) => i);
      const iter2 = Array.from({ length: 10_000 }, (_, i) => i * 10);

      const result = iter(iter1)
        .interleave(iter2)
        .take(1000)
        .toArray();

      expect(result).toHaveLength(1000);
      // Should alternate between iter1 and iter2
      expect(result[0]).toBe(0);
      expect(result[1]).toBe(0);
    });
  });

  describe('Real-world data simulation', () => {
    it('should process log file simulation (1M entries)', () => {
      interface LogEntry {
        timestamp: number;
        level: 'INFO' | 'WARN' | 'ERROR';
        message: string;
        userId?: string;
      }

      function* generateLogs(): Generator<LogEntry> {
        const levels: ('INFO' | 'WARN' | 'ERROR')[] = ['INFO', 'WARN', 'ERROR'];
        for (let i = 0; i < 1_000_000; i++) {
          yield {
            timestamp: Date.now() + i,
            level: levels[i % 3],
            message: `Log message ${i}`,
            userId: i % 100 === 0 ? `user_${i % 1000}` : undefined,
          };
        }
      }

      const errorCount = iter(generateLogs())
        .filter(log => log.level === 'ERROR')
        .count();

      expect(errorCount).toBeGreaterThan(0);
    });

    it('should process time-series data with windowing', () => {
      interface DataPoint {
        timestamp: number;
        value: number;
        sensor: string;
      }

      const timeSeriesData = Array.from({ length: 100_000 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        value: Math.sin(i / 100) * 50 + 50 + Math.random() * 10,
        sensor: `sensor_${i % 10}`,
      }));

      // Calculate moving averages
      const movingAverages = iter(timeSeriesData)
        .filter(d => d.sensor === 'sensor_0')
        .map(d => d.value)
        .window(100)
        .map(win => win.reduce((a, b) => a + b, 0) / win.length)
        .toArray();

      expect(movingAverages.length).toBeGreaterThan(0);
      expect(movingAverages.every(avg => avg > 0 && avg < 120)).toBe(true);
    });

    it('should process e-commerce transaction data', () => {
      interface Transaction {
        id: string;
        userId: string;
        amount: number;
        category: string;
        timestamp: number;
      }

      const transactions = Array.from({ length: 200_000 }, (_, i) => ({
        id: `txn_${i}`,
        userId: `user_${i % 10000}`,
        amount: Math.random() * 1000 + 10,
        category: ['Electronics', 'Books', 'Clothing', 'Food', 'Other'][i % 5],
        timestamp: Date.now() + i * 60000,
      }));

      // Calculate revenue by category
      const revenueByCategory = iter(transactions)
        .groupBy(txn => txn.category);

      const categoryStats = new Map<string, { total: number; count: number; avg: number }>();

      for (const [category, txns] of revenueByCategory) {
        const amounts = iter(txns).map(t => t.amount);
        categoryStats.set(category, {
          total: amounts.sum(),
          count: txns.length,
          avg: amounts.mean(),
        });
      }

      expect(categoryStats.size).toBe(5);
      expect(Array.from(categoryStats.values()).every(s => s.total > 0)).toBe(true);
    });
  });

  describe('Extreme scale scenarios', () => {
    it('should handle infinite sequence with early termination', () => {
      function* infiniteSequence() {
        let i = 0;
        while (true) {
          yield i++;
        }
      }

      const result = iter(infiniteSequence())
        .filter(x => x % 1000 === 0)
        .take(100)
        .toArray();

      expect(result).toHaveLength(100);
      expect(result[0]).toBe(0);
      expect(result[99]).toBe(99000);
    });

    it('should handle very large skip operations efficiently', () => {
      function* largeSequence() {
        for (let i = 0; i < 10_000_000; i++) {
          yield i;
        }
      }

      const result = iter(largeSequence())
        .skip(9_900_000)
        .take(100)
        .toArray();

      expect(result).toHaveLength(100);
      expect(result[0]).toBe(9_900_000);
      expect(result[99]).toBe(9_900_099);
    });
  });
});
