import { iter } from '../src/index.js';

/**
 * Express Middleware Integration Example
 *
 * This example demonstrates how to use iterflow in Express.js middleware
 * for processing request data, response transformation, and analytics.
 *
 * Note: This example uses simulated Express types for demonstration.
 * In a real application, install Express: npm install express @types/express
 */

// Simulated Express types for demonstration
interface Request {
  method: string;
  path: string;
  query: Record<string, any>;
  body: any;
  headers: Record<string, string>;
  ip: string;
  timestamp?: number;
}

interface Response {
  status(code: number): Response;
  json(data: any): Response;
  send(data: any): Response;
  set(field: string, value: string): Response;
}

type NextFunction = () => void;
type Middleware = (req: Request, res: Response, next: NextFunction) => void;

// Example 1: Request analytics middleware
const requestStore: Request[] = [];

function analyticsMiddleware(): Middleware {
  return (req: Request, res: Response, next: NextFunction) => {
    req.timestamp = Date.now();
    requestStore.push({ ...req });

    // Analyze recent requests
    const recentRequests = iter(requestStore)
      .toArray().slice(-100)
      .toArray();

    const analytics = {
      totalRequests: recentRequests.length,
      methodBreakdown: iter(recentRequests)
        .groupBy(r => r.method)
        .map(([method, reqs]) => ({ method, count: reqs.length }))
        .toArray(),
      topPaths: iter(recentRequests)
        .groupBy(r => r.path)
        .map(([path, reqs]) => ({ path, count: reqs.length }))
        .sortBy((a, b) => b.count - a.count)
        .take(5)
        .toArray(),
      uniqueIPs: iter(recentRequests)
        .map(r => r.ip)
        .distinct()
        .count()
    };

    // Attach analytics to request for later use
    (req as any).analytics = analytics;

    next();
  };
}

// Example 2: Query parameter validation and transformation
interface ValidationRule<T> {
  field: string;
  type: 'string' | 'number' | 'boolean';
  required?: boolean;
  min?: number;
  max?: number;
  transform?: (value: any) => T;
}

function queryValidationMiddleware(rules: ValidationRule<any>[]): Middleware {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
    const validated: Record<string, any> = {};

    for (const rule of rules) {
      const value = req.query[rule.field];

      // Check required
      if (rule.required && (value === undefined || value === null)) {
        errors.push(`Field '${rule.field}' is required`);
        continue;
      }

      if (value !== undefined && value !== null) {
        // Type validation and conversion
        let converted: any = value;

        if (rule.type === 'number') {
          converted = Number(value);
          if (isNaN(converted)) {
            errors.push(`Field '${rule.field}' must be a number`);
            continue;
          }
          if (rule.min !== undefined && converted < rule.min) {
            errors.push(`Field '${rule.field}' must be >= ${rule.min}`);
          }
          if (rule.max !== undefined && converted > rule.max) {
            errors.push(`Field '${rule.field}' must be <= ${rule.max}`);
          }
        } else if (rule.type === 'boolean') {
          converted = value === 'true' || value === '1';
        }

        // Apply transform
        if (rule.transform) {
          converted = rule.transform(converted);
        }

        validated[rule.field] = converted;
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    (req as any).validated = validated;
    next();
  };
}

// Example 3: Response data aggregation middleware
interface DataPoint {
  id: number;
  value: number;
  category: string;
  timestamp: number;
}

function dataAggregationMiddleware(): Middleware {
  return (req: Request, res: Response, next: NextFunction) => {
    // Simulate getting data
    const data: DataPoint[] = (req.body?.data || []) as DataPoint[];

    if (data.length === 0) {
      next();
      return;
    }

    // Use iterflow for aggregation
    const aggregated = {
      byCategory: iter(data)
        .groupBy(d => d.category)
        .map(([category, items]) => ({
          category,
          count: items.length,
          total: iter(items).map(i => i.value).sum(),
          average: iter(items).map(i => i.value).mean(),
          min: iter(items).map(i => i.value).min(),
          max: iter(items).map(i => i.value).max()
        }))
        .toArray(),

      overall: {
        count: data.length,
        total: iter(data).map(d => d.value).sum(),
        average: iter(data).map(d => d.value).mean(),
        median: iter(data).map(d => d.value).median(),
        stdDev: iter(data).map(d => d.value).stdDev()
      },

      timeline: iter(data)
        .sortBy((a, b) => a.timestamp - b.timestamp)
        .window(10)
        .map((window, index) => ({
          windowIndex: index,
          startTime: window[0]?.timestamp,
          endTime: window[window.length - 1]?.timestamp,
          average: iter(window).map(d => d.value).mean(),
          count: window.length
        }))
        .toArray()
    };

    (req as any).aggregatedData = aggregated;
    next();
  };
}

// Example 4: Rate limiting middleware with statistics
const requestTimestamps = new Map<string, number[]>();

function rateLimitMiddleware(maxRequests: number, windowMs: number): Middleware {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get and clean old timestamps
    const timestamps = requestTimestamps.get(key) || [];
    const recentTimestamps = iter(timestamps)
      .filter(ts => ts > windowStart)
      .toArray();

    recentTimestamps.push(now);
    requestTimestamps.set(key, recentTimestamps);

    // Calculate rate limit info
    const requestCount = recentTimestamps.length;
    const remaining = Math.max(0, maxRequests - requestCount);
    const resetTime = Math.min(...recentTimestamps) + windowMs;

    // Set rate limit headers
    res.set('X-RateLimit-Limit', String(maxRequests));
    res.set('X-RateLimit-Remaining', String(remaining));
    res.set('X-RateLimit-Reset', String(resetTime));

    if (requestCount > maxRequests) {
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((resetTime - now) / 1000)
      });
      return;
    }

    next();
  };
}

// Example 5: Response transformation middleware
function transformResponseMiddleware(): Middleware {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function (data: any) {
      // If data is an array, add statistics
      if (Array.isArray(data)) {
        const enhanced = {
          data,
          metadata: {
            count: data.length,
            page: Number(req.query.page) || 1,
            pageSize: Number(req.query.pageSize) || data.length
          }
        };

        // Add numeric statistics if applicable
        if (data.length > 0 && typeof data[0] === 'number') {
          (enhanced.metadata as any).statistics = {
            sum: iter(data).sum(),
            mean: iter(data).mean(),
            median: iter(data).median(),
            min: iter(data).min(),
            max: iter(data).max()
          };
        }

        return originalJson(enhanced);
      }

      return originalJson(data);
    };

    next();
  };
}

// Example 6: Batch operation middleware
function batchOperationMiddleware<T, R>(
  processor: (items: T[]) => R[],
  batchSize: number = 100
): Middleware {
  return (req: Request, res: Response, next: NextFunction) => {
    const items: T[] = req.body?.items || [];

    if (items.length === 0) {
      next();
      return;
    }

    // Process in batches using iterflow
    const batches = iter(items).chunk(batchSize);
    const results: R[] = [];

    for (const batch of batches) {
      const batchResults = processor(batch);
      results.push(...batchResults);
    }

    (req as any).batchResults = {
      total: items.length,
      processed: results.length,
      batches: Math.ceil(items.length / batchSize),
      results
    };

    next();
  };
}

// Demonstration
function simulateExpressApp() {
  console.log('=== Express Middleware Integration Examples ===\n');

  // Create mock request/response
  const createMockRes = (): Response => {
    const headers: Record<string, string> = {};
    return {
      status: function (code: number) {
        console.log(`  Status: ${code}`);
        return this;
      },
      json: function (data: any) {
        console.log('  Response:', JSON.stringify(data, null, 2));
        return this;
      },
      send: function (data: any) {
        console.log('  Send:', data);
        return this;
      },
      set: function (field: string, value: string) {
        headers[field] = value;
        return this;
      }
    };
  };

  const next = () => console.log('  Next called');

  // Demo 1: Analytics
  console.log('1. Request Analytics Middleware:');
  const analyticsReq: Request = {
    method: 'GET',
    path: '/api/users',
    query: {},
    body: {},
    headers: {},
    ip: '192.168.1.1'
  };

  // Simulate some requests
  for (let i = 0; i < 5; i++) {
    requestStore.push({
      ...analyticsReq,
      path: i % 2 === 0 ? '/api/users' : '/api/posts',
      method: i % 3 === 0 ? 'POST' : 'GET'
    });
  }

  const analyticsMw = analyticsMiddleware();
  analyticsMw(analyticsReq, createMockRes(), next);
  console.log('Analytics:', (analyticsReq as any).analytics);
  console.log();

  // Demo 2: Query validation
  console.log('2. Query Validation Middleware:');
  const validationReq: Request = {
    method: 'GET',
    path: '/api/search',
    query: { page: '2', limit: '50', active: 'true' },
    body: {},
    headers: {},
    ip: '192.168.1.1'
  };

  const validationMw = queryValidationMiddleware([
    { field: 'page', type: 'number', required: true, min: 1 },
    { field: 'limit', type: 'number', min: 1, max: 100 },
    { field: 'active', type: 'boolean' }
  ]);

  validationMw(validationReq, createMockRes(), next);
  console.log('Validated:', (validationReq as any).validated);
  console.log();

  // Demo 3: Data aggregation
  console.log('3. Data Aggregation Middleware:');
  const dataReq: Request = {
    method: 'POST',
    path: '/api/analytics',
    query: {},
    body: {
      data: [
        { id: 1, value: 100, category: 'A', timestamp: 1000 },
        { id: 2, value: 150, category: 'B', timestamp: 2000 },
        { id: 3, value: 120, category: 'A', timestamp: 3000 },
        { id: 4, value: 180, category: 'B', timestamp: 4000 },
        { id: 5, value: 110, category: 'A', timestamp: 5000 }
      ]
    },
    headers: {},
    ip: '192.168.1.1'
  };

  const aggMw = dataAggregationMiddleware();
  aggMw(dataReq, createMockRes(), next);
  console.log('Aggregated data:', (dataReq as any).aggregatedData.byCategory);
  console.log();

  // Demo 4: Rate limiting
  console.log('4. Rate Limiting Middleware:');
  const rateLimitReq: Request = {
    method: 'GET',
    path: '/api/data',
    query: {},
    body: {},
    headers: {},
    ip: '192.168.1.100'
  };

  const rateLimitMw = rateLimitMiddleware(3, 60000);

  // Simulate multiple requests
  for (let i = 1; i <= 4; i++) {
    console.log(`Request ${i}:`);
    rateLimitMw(rateLimitReq, createMockRes(), next);
  }
  console.log();

  // Demo 5: Batch processing
  console.log('5. Batch Operation Middleware:');
  const batchReq: Request = {
    method: 'POST',
    path: '/api/batch',
    query: {},
    body: {
      items: Array.from({ length: 23 }, (_, i) => ({ id: i + 1, value: i * 2 }))
    },
    headers: {},
    ip: '192.168.1.1'
  };

  const batchMw = batchOperationMiddleware(
    (items: any[]) => items.map(item => ({ ...item, processed: true })),
    10
  );

  batchMw(batchReq, createMockRes(), next);
  console.log('Batch results summary:');
  console.log('  Total:', (batchReq as any).batchResults.total);
  console.log('  Processed:', (batchReq as any).batchResults.processed);
  console.log('  Batches:', (batchReq as any).batchResults.batches);
}

// Run demonstration
simulateExpressApp();
