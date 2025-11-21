import { bench, describe } from 'vitest';
import { iter } from '../src/index.js';

/**
 * Production Performance Profiling Benchmarks
 *
 * Benchmarks that simulate real-world production scenarios
 * to validate performance characteristics.
 */

// Simulate production data sizes
const SMALL_DATASET = 1_000;
const MEDIUM_DATASET = 10_000;
const LARGE_DATASET = 100_000;
const XLARGE_DATASET = 1_000_000;

describe('Production Scenario: Log Processing', () => {
  interface LogEntry {
    timestamp: number;
    level: 'INFO' | 'WARN' | 'ERROR';
    message: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  }

  function generateLogs(count: number): LogEntry[] {
    const levels: ('INFO' | 'WARN' | 'ERROR')[] = ['INFO', 'WARN', 'ERROR'];
    return Array.from({ length: count }, (_, i) => ({
      timestamp: Date.now() + i,
      level: levels[Math.floor(Math.random() * 3)],
      message: `Log message ${i}`,
      userId: i % 10 === 0 ? `user_${i % 1000}` : undefined,
      metadata: i % 5 === 0 ? { requestId: `req_${i}` } : undefined,
    }));
  }

  bench('Filter and count ERROR logs (10K logs)', () => {
    const logs = generateLogs(MEDIUM_DATASET);
    const errorCount = iter(logs)
      .filter(log => log.level === 'ERROR')
      .count();
    return errorCount;
  });

  bench('Group logs by level and user (10K logs)', () => {
    const logs = generateLogs(MEDIUM_DATASET);
    const grouped = iter(logs)
      .filter(log => log.userId != null)
      .groupBy(log => `${log.level}_${log.userId}`);
    return grouped.size;
  });

  bench('Window-based log analysis (100K logs)', () => {
    const logs = generateLogs(LARGE_DATASET);
    const windowedErrors = iter(logs)
      .window(1000)
      .map(win => iter(win).filter(log => log.level === 'ERROR').count())
      .filter(count => count > 10)
      .toArray();
    return windowedErrors;
  });
});

describe('Production Scenario: E-commerce Analytics', () => {
  interface Transaction {
    id: string;
    userId: string;
    amount: number;
    category: string;
    timestamp: number;
    items: number;
  }

  function generateTransactions(count: number): Transaction[] {
    const categories = ['Electronics', 'Books', 'Clothing', 'Food', 'Other'];
    return Array.from({ length: count }, (_, i) => ({
      id: `txn_${i}`,
      userId: `user_${i % 10000}`,
      amount: Math.random() * 1000 + 10,
      category: categories[i % categories.length],
      timestamp: Date.now() + i * 60000,
      items: Math.floor(Math.random() * 10) + 1,
    }));
  }

  bench('Calculate revenue by category (100K transactions)', () => {
    const transactions = generateTransactions(LARGE_DATASET);
    const revenue = iter(transactions)
      .groupBy(txn => txn.category);

    const results = new Map();
    for (const [category, txns] of revenue) {
      results.set(category, iter(txns).map(t => t.amount).sum());
    }
    return results;
  });

  bench('Top 100 spending users (100K transactions)', () => {
    const transactions = generateTransactions(LARGE_DATASET);
    const userSpending = iter(transactions)
      .groupBy(txn => txn.userId);

    const spending = Array.from(userSpending.entries())
      .map(([userId, txns]) => ({
        userId,
        total: iter(txns).map(t => t.amount).sum(),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 100);

    return spending;
  });

  bench('Daily revenue aggregation (100K transactions)', () => {
    const transactions = generateTransactions(LARGE_DATASET);
    const dailyRevenue = iter(transactions)
      .groupBy(txn => new Date(txn.timestamp).toDateString());

    const results = new Map();
    for (const [date, txns] of dailyRevenue) {
      results.set(date, {
        revenue: iter(txns).map(t => t.amount).sum(),
        count: txns.length,
      });
    }
    return results;
  });
});

describe('Production Scenario: Time Series Analysis', () => {
  interface DataPoint {
    timestamp: number;
    value: number;
    sensor: string;
  }

  function generateTimeSeries(count: number): DataPoint[] {
    return Array.from({ length: count }, (_, i) => ({
      timestamp: Date.now() + i * 1000,
      value: Math.sin(i / 100) * 50 + 50 + Math.random() * 10,
      sensor: `sensor_${i % 10}`,
    }));
  }

  bench('Moving average (window=100, 100K points)', () => {
    const data = generateTimeSeries(LARGE_DATASET);
    const movingAvg = iter(data)
      .filter(d => d.sensor === 'sensor_0')
      .map(d => d.value)
      .window(100)
      .map(win => iter(win).mean())
      .toArray();
    return movingAvg;
  });

  bench('Detect anomalies (3-sigma, 100K points)', () => {
    const data = generateTimeSeries(LARGE_DATASET);
    const anomalies = iter(data)
      .filter(d => d.sensor === 'sensor_0')
      .window(50)
      .flatMap(win => {
        const values = win.map(d => d.value);
        const mean = iter(values).mean();
        const stddev = iter(values).stddev();
        const threshold = mean + 3 * stddev;
        return win.filter(d => Math.abs(d.value - mean) > threshold);
      })
      .toArray();
    return anomalies;
  });

  bench('Multi-sensor statistics (100K points)', () => {
    const data = generateTimeSeries(LARGE_DATASET);
    const sensorStats = iter(data)
      .groupBy(d => d.sensor);

    const results = new Map();
    for (const [sensor, points] of sensorStats) {
      const values = iter(points).map(p => p.value);
      results.set(sensor, {
        mean: values.mean(),
        min: values.min(),
        max: values.max(),
        count: points.length,
      });
    }
    return results;
  });
});

describe('Production Scenario: Data Pipeline Processing', () => {
  interface Record {
    id: number;
    data: string;
    priority: number;
    tags: string[];
    processed: boolean;
  }

  function generateRecords(count: number): Record[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      data: `data_${i}`,
      priority: Math.floor(Math.random() * 10),
      tags: [`tag_${i % 5}`, `category_${i % 3}`],
      processed: false,
    }));
  }

  bench('Multi-stage pipeline (100K records)', () => {
    const records = generateRecords(LARGE_DATASET);
    const result = iter(records)
      .filter(r => r.priority >= 5)
      .map(r => ({ ...r, processed: true }))
      .groupBy(r => r.tags[0])
      .size;
    return result;
  });

  bench('Complex filtering and transformation (100K records)', () => {
    const records = generateRecords(LARGE_DATASET);
    const result = iter(records)
      .filter(r => r.priority > 3)
      .filter(r => r.tags.includes('tag_1'))
      .map(r => ({ id: r.id, priority: r.priority * 2 }))
      .distinctBy(r => r.id)
      .toArray();
    return result;
  });

  bench('Chunked batch processing (100K records)', () => {
    const records = generateRecords(LARGE_DATASET);
    const batches = iter(records)
      .chunk(1000)
      .map(batch =>
        iter(batch)
          .filter(r => r.priority >= 5)
          .count()
      )
      .toArray();
    return batches;
  });
});

describe('Production Scenario: API Response Processing', () => {
  interface ApiResponse {
    id: number;
    data: {
      value: number;
      status: string;
    };
    metadata: {
      timestamp: number;
      source: string;
    };
  }

  function generateApiResponses(count: number): ApiResponse[] {
    const statuses = ['success', 'pending', 'failed'];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      data: {
        value: Math.random() * 1000,
        status: statuses[i % 3],
      },
      metadata: {
        timestamp: Date.now() + i,
        source: `api_${i % 5}`,
      },
    }));
  }

  bench('Filter and transform API responses (10K)', () => {
    const responses = generateApiResponses(MEDIUM_DATASET);
    const result = iter(responses)
      .filter(r => r.data.status === 'success')
      .map(r => ({
        id: r.id,
        value: r.data.value,
        source: r.metadata.source,
      }))
      .toArray();
    return result;
  });

  bench('Group by source and calculate stats (10K)', () => {
    const responses = generateApiResponses(MEDIUM_DATASET);
    const grouped = iter(responses)
      .filter(r => r.data.status === 'success')
      .groupBy(r => r.metadata.source);

    const results = new Map();
    for (const [source, items] of grouped) {
      const values = iter(items).map(r => r.data.value);
      results.set(source, {
        mean: values.mean(),
        count: items.length,
      });
    }
    return results;
  });
});

describe('Production Scenario: Real-time Streaming', () => {
  bench('Stream processing with window aggregation (1M items)', () => {
    function* dataStream() {
      for (let i = 0; i < XLARGE_DATASET; i++) {
        yield { id: i, value: Math.random() * 100 };
      }
    }

    const result = iter(dataStream())
      .filter(d => d.value > 50)
      .window(1000)
      .map(win => iter(win).map(d => d.value).mean())
      .take(100)
      .toArray();

    return result;
  });

  bench('Stream deduplication and counting (1M items)', () => {
    function* dataStream() {
      for (let i = 0; i < XLARGE_DATASET; i++) {
        yield { id: i % 100000, value: Math.random() };
      }
    }

    const uniqueIds = iter(dataStream())
      .distinctBy(d => d.id)
      .count();

    return uniqueIds;
  });
});

describe('Production Scenario: Memory Efficiency', () => {
  bench('Large window without materialization (100K items)', () => {
    const data = Array.from({ length: LARGE_DATASET }, (_, i) => i);

    // Process windows without materializing all at once
    const result = iter(data)
      .window(1000)
      .map(win => iter(win).sum())
      .filter(sum => sum > 500000)
      .take(50)
      .toArray();

    return result;
  });

  bench('Lazy evaluation with early termination (1M items)', () => {
    function* largeGenerator() {
      for (let i = 0; i < XLARGE_DATASET; i++) {
        yield i;
      }
    }

    const result = iter(largeGenerator())
      .filter(x => x % 2 === 0)
      .map(x => x * 2)
      .filter(x => x > 10000)
      .take(100)
      .toArray();

    return result;
  });

  bench('Chunked processing avoiding full materialization (100K items)', () => {
    const data = Array.from({ length: LARGE_DATASET }, (_, i) => ({
      id: i,
      value: Math.random() * 1000,
    }));

    const result = iter(data)
      .chunk(1000)
      .map(chunk => ({
        min: iter(chunk).map(item => item.value).min(),
        max: iter(chunk).map(item => item.value).max(),
        count: chunk.length,
      }))
      .toArray();

    return result;
  });
});

describe('Production Scenario: Statistical Workloads', () => {
  function generateDataset(size: number): number[] {
    return Array.from({ length: size }, () => Math.random() * 1000);
  }

  bench('Full statistical analysis (10K points)', () => {
    const data = generateDataset(MEDIUM_DATASET);

    return {
      mean: iter(data).mean(),
      median: iter(data).median(),
      stddev: iter(data).stddev(),
      min: iter(data).min(),
      max: iter(data).max(),
      quartiles: iter(data).quartiles(),
    };
  });

  bench('Rolling statistics (100K points, window=1000)', () => {
    const data = generateDataset(LARGE_DATASET);

    const rollingStats = iter(data)
      .window(1000)
      .map(win => ({
        mean: iter(win).mean(),
        stddev: iter(win).stddev(),
      }))
      .take(100)
      .toArray();

    return rollingStats;
  });

  bench('Correlation calculation (10K points)', () => {
    const data1 = generateDataset(MEDIUM_DATASET);
    const data2 = generateDataset(MEDIUM_DATASET);

    const correlation = iter(data1).correlation(data2);
    return correlation;
  });
});
