import { iter } from '../src/index.js';

/**
 * Fastify Plugin Integration Example
 *
 * This example demonstrates how to use iterflow in Fastify plugins
 * for processing request data, response transformation, and analytics.
 *
 * Note: This example uses simulated Fastify types for demonstration.
 * In a real application, install Fastify: npm install fastify @types/node
 */

// Simulated Fastify types for demonstration
interface FastifyRequest {
  method: string;
  url: string;
  query: Record<string, any>;
  body: any;
  headers: Record<string, string>;
  ip: string;
  timestamp?: number;
  [key: string]: any;
}

interface FastifyReply {
  code(statusCode: number): FastifyReply;
  send(payload?: any): FastifyReply;
  header(name: string, value: string): FastifyReply;
  [key: string]: any;
}

type FastifyPluginCallback = (
  instance: any,
  opts: any,
  done: () => void
) => void;

type RouteHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => void | Promise<void>;

// Example 1: Analytics Plugin
const analyticsStore: FastifyRequest[] = [];

const analyticsPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  // Add hook to track requests
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    request.timestamp = Date.now();
    analyticsStore.push({ ...request });
  });

  // Add analytics route
  fastify.route({
    method: 'GET',
    url: '/analytics',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const recentRequests = iter(analyticsStore)
        .toArray().slice(-1000)
        .toArray();

      const analytics = {
        totalRequests: recentRequests.length,
        methodBreakdown: iter(recentRequests)
          .groupBy(r => r.method)
          .map(([method, reqs]) => ({
            method,
            count: reqs.length,
            percentage: (reqs.length / recentRequests.length) * 100
          }))
          .sortBy((a, b) => b.count - a.count)
          .toArray(),
        topEndpoints: iter(recentRequests)
          .groupBy(r => r.url)
          .map(([url, reqs]) => ({ url, count: reqs.length }))
          .sortBy((a, b) => b.count - a.count)
          .take(10)
          .toArray(),
        uniqueIPs: iter(recentRequests)
          .map(r => r.ip)
          .distinct()
          .count(),
        requestsPerMinute: iter(recentRequests)
          .filter(r => r.timestamp && r.timestamp > Date.now() - 60000)
          .count()
      };

      return reply.send(analytics);
    }
  });

  done();
};

// Example 2: Data Processing Plugin
interface DataItem {
  id: number;
  value: number;
  category: string;
  timestamp?: number;
}

const dataProcessingPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  // Decorator for data aggregation
  fastify.decorate('aggregateData', (data: DataItem[]) => {
    return {
      byCategory: iter(data)
        .groupBy(d => d.category)
        .map(([category, items]) => ({
          category,
          count: items.length,
          sum: iter(items).map(i => i.value).sum(),
          average: iter(items).map(i => i.value).mean(),
          median: iter(items).map(i => i.value).median(),
          min: iter(items).map(i => i.value).min(),
          max: iter(items).map(i => i.value).max(),
          stdDev: iter(items).map(i => i.value).stdDev()
        }))
        .sortBy((a, b) => b.average - a.average)
        .toArray(),

      overall: {
        total: data.length,
        sum: iter(data).map(d => d.value).sum(),
        average: iter(data).map(d => d.value).mean(),
        median: iter(data).map(d => d.value).median(),
        quartiles: iter(data).map(d => d.value).quartiles()
      },

      topItems: iter(data)
        .sortBy((a, b) => b.value - a.value)
        .take(10)
        .toArray()
    };
  });

  // Route for data processing
  fastify.route({
    method: 'POST',
    url: '/data/process',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const data: DataItem[] = request.body?.items || [];

      if (data.length === 0) {
        return reply.code(400).send({ error: 'No data provided' });
      }

      const aggregated = (fastify as any).aggregateData(data);
      return reply.send(aggregated);
    }
  });

  done();
};

// Example 3: Pagination Plugin
interface PaginationOptions {
  defaultPageSize?: number;
  maxPageSize?: number;
}

const paginationPlugin: FastifyPluginCallback = (
  fastify,
  opts: PaginationOptions,
  done
) => {
  const defaultPageSize = opts.defaultPageSize || 20;
  const maxPageSize = opts.maxPageSize || 100;

  fastify.decorate('paginate', <T>(items: T[], page: number, pageSize: number) => {
    const validPageSize = Math.min(Math.max(1, pageSize), maxPageSize);
    const validPage = Math.max(1, page);

    const paginatedItems = iter(items)
      .drop((validPage - 1) * validPageSize)
      .take(validPageSize)
      .toArray();

    const totalPages = Math.ceil(items.length / validPageSize);

    return {
      data: paginatedItems,
      pagination: {
        page: validPage,
        pageSize: validPageSize,
        totalItems: items.length,
        totalPages,
        hasNext: validPage < totalPages,
        hasPrevious: validPage > 1
      }
    };
  });

  done();
};

// Example 4: Statistics Plugin
const statisticsPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.decorate('calculateStats', (numbers: number[]) => {
    const quartiles = iter(numbers).quartiles();

    return {
      count: numbers.length,
      sum: iter(numbers).sum(),
      mean: iter(numbers).mean(),
      median: iter(numbers).median(),
      mode: iter(numbers).mode(),
      min: iter(numbers).min(),
      max: iter(numbers).max(),
      range: iter(numbers).span(),
      variance: iter(numbers).variance(),
      stdDev: iter(numbers).stdDev(),
      quartiles: {
        q1: quartiles.Q1,
        q2: quartiles.Q2,
        q3: quartiles.Q3,
        iqr: quartiles.Q3 - quartiles.Q1
      }
    };
  });

  fastify.route({
    method: 'POST',
    url: '/statistics',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const numbers: number[] = request.body?.numbers || [];

      if (numbers.length === 0) {
        return reply.code(400).send({ error: 'No numbers provided' });
      }

      if (!numbers.every(n => typeof n === 'number' && !isNaN(n))) {
        return reply.code(400).send({ error: 'Invalid number data' });
      }

      const stats = (fastify as any).calculateStats(numbers);
      return reply.send(stats);
    }
  });

  done();
};

// Example 5: Batch Processing Plugin
interface BatchOptions {
  batchSize?: number;
  concurrency?: number;
}

const batchProcessingPlugin: FastifyPluginCallback = (
  fastify,
  opts: BatchOptions,
  done
) => {
  const batchSize = opts.batchSize || 100;

  fastify.decorate('processBatch', async <T, R>(
    items: T[],
    processor: (batch: T[]) => Promise<R[]> | R[]
  ) => {
    const batches = iter(items).chunk(batchSize).toArray();
    const results: R[] = [];

    for (const batch of batches) {
      const batchResults = await processor(batch);
      results.push(...batchResults);
    }

    return {
      totalItems: items.length,
      processedItems: results.length,
      batchCount: batches.length,
      batchSize,
      results
    };
  });

  done();
};

// Example 6: Time Series Plugin
const timeSeriesPlugin: FastifyPluginCallback = (fastify, opts, done) => {
  interface TimeSeriesPoint {
    timestamp: number;
    value: number;
  }

  fastify.decorate('analyzeTimeSeries', (data: TimeSeriesPoint[], windowSize: number = 5) => {
    // Sort by timestamp
    const sortedData = iter(data)
      .sortBy((a, b) => a.timestamp - b.timestamp)
      .toArray();

    // Calculate moving averages
    const movingAverages = iter(sortedData)
      .window(windowSize)
      .map((window, index) => ({
        windowIndex: index,
        timestamp: window[Math.floor(window.length / 2)]?.timestamp,
        average: iter(window).map(p => p.value).mean(),
        min: iter(window).map(p => p.value).min(),
        max: iter(window).map(p => p.value).max()
      }))
      .toArray();

    // Detect trends
    const values = sortedData.map(p => p.value);
    const firstHalf = iter(values).take(Math.floor(values.length / 2)).mean();
    const secondHalf = iter(values).drop(Math.floor(values.length / 2)).mean();
    const trend = secondHalf > firstHalf ? 'increasing' : secondHalf < firstHalf ? 'decreasing' : 'stable';

    return {
      dataPoints: sortedData.length,
      timeRange: {
        start: sortedData[0]?.timestamp,
        end: sortedData[sortedData.length - 1]?.timestamp
      },
      statistics: {
        mean: iter(values).mean(),
        median: iter(values).median(),
        min: iter(values).min(),
        max: iter(values).max(),
        stdDev: iter(values).stdDev()
      },
      movingAverages,
      trend
    };
  });

  fastify.route({
    method: 'POST',
    url: '/timeseries/analyze',
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const data: TimeSeriesPoint[] = request.body?.data || [];
      const windowSize = request.query?.windowSize ? Number(request.query.windowSize) : 5;

      if (data.length === 0) {
        return reply.code(400).send({ error: 'No data provided' });
      }

      const analysis = (fastify as any).analyzeTimeSeries(data, windowSize);
      return reply.send(analysis);
    }
  });

  done();
};

// Demonstration
function demonstrateFastifyPlugins() {
  console.log('=== Fastify Plugin Integration Examples ===\n');

  // Mock Fastify instance
  const mockFastify = {
    decorations: {} as Record<string, any>,
    hooks: [] as any[],
    routes: [] as any[],

    decorate(name: string, value: any) {
      this.decorations[name] = value;
    },

    addHook(hookName: string, fn: any) {
      this.hooks.push({ hookName, fn });
    },

    route(opts: any) {
      this.routes.push(opts);
    }
  };

  // Demo 1: Analytics Plugin
  console.log('1. Analytics Plugin:');
  analyticsPlugin(mockFastify, {}, () => {});
  console.log(`  Registered ${mockFastify.hooks.length} hooks`);
  console.log(`  Registered ${mockFastify.routes.length} routes`);
  console.log();

  // Demo 2: Data Processing
  console.log('2. Data Processing Plugin:');
  dataProcessingPlugin(mockFastify, {}, () => {});

  const sampleData: DataItem[] = [
    { id: 1, value: 100, category: 'A' },
    { id: 2, value: 150, category: 'B' },
    { id: 3, value: 120, category: 'A' },
    { id: 4, value: 200, category: 'B' },
    { id: 5, value: 90, category: 'A' }
  ];

  const aggregated = mockFastify.decorations.aggregateData(sampleData);
  console.log('  Aggregated data by category:', aggregated.byCategory);
  console.log('  Overall stats:', aggregated.overall);
  console.log();

  // Demo 3: Pagination
  console.log('3. Pagination Plugin:');
  paginationPlugin(mockFastify, { defaultPageSize: 5, maxPageSize: 20 }, () => {});

  const items = Array.from({ length: 47 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
  const page1 = mockFastify.decorations.paginate(items, 1, 10);
  console.log('  Page 1:');
  console.log('    Items:', page1.data.length);
  console.log('    Pagination:', page1.pagination);
  console.log();

  // Demo 4: Statistics
  console.log('4. Statistics Plugin:');
  statisticsPlugin(mockFastify, {}, () => {});

  const numbers = [12, 15, 18, 14, 20, 22, 19, 16, 25, 13, 17, 21];
  const stats = mockFastify.decorations.calculateStats(numbers);
  console.log('  Statistics for', numbers.join(', '));
  console.log('  Mean:', stats.mean.toFixed(2));
  console.log('  Median:', stats.median.toFixed(2));
  console.log('  Std Dev:', stats.stdDev.toFixed(2));
  console.log('  Quartiles:', stats.quartiles);
  console.log();

  // Demo 5: Batch Processing
  console.log('5. Batch Processing Plugin:');
  batchProcessingPlugin(mockFastify, { batchSize: 10 }, () => {});

  const batchItems = Array.from({ length: 35 }, (_, i) => i + 1);
  mockFastify.decorations.processBatch(
    batchItems,
    (batch: number[]) => batch.map(n => n * 2)
  ).then((result: any) => {
    console.log('  Batch processing result:');
    console.log('    Total items:', result.totalItems);
    console.log('    Batch count:', result.batchCount);
    console.log('    Processed items:', result.processedItems);
    console.log('    First 10 results:', result.results.slice(0, 10).join(', '));
    console.log();

    // Demo 6: Time Series
    console.log('6. Time Series Plugin:');
    timeSeriesPlugin(mockFastify, {}, () => {});

    const timeSeriesData = Array.from({ length: 20 }, (_, i) => ({
      timestamp: Date.now() + i * 60000,
      value: 20 + Math.random() * 10 + i * 0.5
    }));

    const analysis = mockFastify.decorations.analyzeTimeSeries(timeSeriesData, 5);
    console.log('  Time series analysis:');
    console.log('    Data points:', analysis.dataPoints);
    console.log('    Trend:', analysis.trend);
    console.log('    Mean:', analysis.statistics.mean.toFixed(2));
    console.log('    Moving averages (first 3):', analysis.movingAverages.slice(0, 3).map((ma: any) =>
      ma.average.toFixed(2)
    ).join(', '));
  });
}

// Run demonstration
demonstrateFastifyPlugins();
