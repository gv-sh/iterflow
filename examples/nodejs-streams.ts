import { iter } from '../src/index.js';
import { Readable, Transform, Writable, pipeline } from 'stream';
import { promisify } from 'util';

/**
 * Node.js Streams Integration Example
 *
 * This example demonstrates how to integrate iterflow with Node.js streams
 * for processing streaming data with backpressure support.
 */

const pipelineAsync = promisify(pipeline);

// Helper: Convert iterable to Node.js Readable stream
function iterableToStream<T>(iterable: Iterable<T>): Readable {
  const iterator = iterable[Symbol.iterator]();

  return new Readable({
    objectMode: true,
    read() {
      const { value, done } = iterator.next();
      if (done) {
        this.push(null);
      } else {
        this.push(value);
      }
    }
  });
}

// Helper: Convert Node.js Readable stream to async iterable
async function* streamToAsyncIterable<T>(stream: Readable): AsyncIterable<T> {
  for await (const chunk of stream) {
    yield chunk as T;
  }
}

// Helper: Create a transform stream using iterflow operations
function createIterflowTransform<T, R>(
  transformFn: (iter: ReturnType<typeof iter<T>>) => Iterable<R>
): Transform {
  const chunks: T[] = [];

  return new Transform({
    objectMode: true,
    transform(chunk: T, encoding, callback) {
      chunks.push(chunk);
      callback();
    },
    flush(callback) {
      try {
        const transformed = transformFn(iter(chunks));
        for (const item of transformed) {
          this.push(item);
        }
        callback();
      } catch (error) {
        callback(error as Error);
      }
    }
  });
}

// Example: Log processing stream
interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  metadata?: Record<string, any>;
}

function createLogProcessor() {
  return createIterflowTransform<LogEntry, LogEntry>(iter =>
    iter
      .filter(log => log.level === 'ERROR' || log.level === 'WARN')
      .map(log => ({
        ...log,
        processed: true,
        alertSent: log.level === 'ERROR'
      }))
  );
}

// Example: Data aggregation stream
interface MetricData {
  timestamp: number;
  value: number;
  sensor: string;
}

function createMetricsAggregator(windowSize: number) {
  return createIterflowTransform<MetricData, { sensor: string; stats: any }>(iter => {
    const bySensor = iter.groupBy(m => m.sensor);
    return bySensor.map(([sensor, metrics]) => ({
      sensor,
      stats: {
        count: metrics.length,
        mean: iter(metrics).map(m => m.value).mean(),
        min: iter(metrics).map(m => m.value).min(),
        max: iter(metrics).map(m => m.value).max(),
        latest: metrics[metrics.length - 1]?.value
      }
    }));
  });
}

// Example: CSV-like data transformation stream
interface RawData {
  id: string;
  value: string;
}

interface ProcessedData {
  id: number;
  value: number;
  category: string;
}

function createDataTransformStream() {
  return createIterflowTransform<RawData, ProcessedData>(iter =>
    iter
      .filter(row => row.id && row.value)
      .map(row => ({
        id: parseInt(row.id, 10),
        value: parseFloat(row.value),
        category: parseFloat(row.value) > 50 ? 'HIGH' : 'LOW'
      }))
      .filter(row => !isNaN(row.id) && !isNaN(row.value))
  );
}

// Example: Batch processing stream
function createBatchProcessor<T>(batchSize: number) {
  return createIterflowTransform<T, T[]>(iter =>
    iter.chunk(batchSize)
  );
}

// Example: Windowing stream for time series
function createWindowingStream<T>(windowSize: number, step?: number) {
  return createIterflowTransform<T, T[]>(iter =>
    iter.window(windowSize)
  );
}

// Demonstration
async function demo() {
  console.log('=== Node.js Streams Integration Examples ===\n');

  // Demo 1: Log processing
  console.log('1. Log Processing Stream:');
  const logs: LogEntry[] = [
    { timestamp: '2025-01-01T10:00:00Z', level: 'INFO', message: 'App started' },
    { timestamp: '2025-01-01T10:01:00Z', level: 'ERROR', message: 'Database connection failed' },
    { timestamp: '2025-01-01T10:02:00Z', level: 'WARN', message: 'Slow query detected' },
    { timestamp: '2025-01-01T10:03:00Z', level: 'INFO', message: 'Request processed' },
    { timestamp: '2025-01-01T10:04:00Z', level: 'ERROR', message: 'API timeout' },
  ];

  const logStream = iterableToStream(logs);
  const logProcessor = createLogProcessor();
  const processedLogs: any[] = [];

  await pipelineAsync(
    logStream,
    logProcessor,
    new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        processedLogs.push(chunk);
        callback();
      }
    })
  );

  console.log('Processed logs (errors and warnings only):');
  processedLogs.forEach(log => console.log(`  [${log.level}] ${log.message}`));
  console.log();

  // Demo 2: Metrics aggregation
  console.log('2. Metrics Aggregation Stream:');
  const metrics: MetricData[] = [
    { timestamp: 1000, value: 23, sensor: 'temp-1' },
    { timestamp: 2000, value: 25, sensor: 'temp-1' },
    { timestamp: 3000, value: 45, sensor: 'temp-2' },
    { timestamp: 4000, value: 24, sensor: 'temp-1' },
    { timestamp: 5000, value: 46, sensor: 'temp-2' },
  ];

  const metricsStream = iterableToStream(metrics);
  const metricsAggregator = createMetricsAggregator(3);
  const aggregatedMetrics: any[] = [];

  await pipelineAsync(
    metricsStream,
    metricsAggregator,
    new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        aggregatedMetrics.push(chunk);
        callback();
      }
    })
  );

  console.log('Aggregated metrics by sensor:');
  aggregatedMetrics.forEach(m =>
    console.log(`  ${m.sensor}: mean=${m.stats.mean.toFixed(1)}, min=${m.stats.min}, max=${m.stats.max}`)
  );
  console.log();

  // Demo 3: Data transformation
  console.log('3. Data Transformation Stream:');
  const rawData: RawData[] = [
    { id: '1', value: '45.5' },
    { id: '2', value: '78.2' },
    { id: 'invalid', value: '50' },
    { id: '3', value: '23.1' },
    { id: '4', value: 'not-a-number' },
    { id: '5', value: '91.7' },
  ];

  const rawDataStream = iterableToStream(rawData);
  const transformer = createDataTransformStream();
  const transformedData: ProcessedData[] = [];

  await pipelineAsync(
    rawDataStream,
    transformer,
    new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        transformedData.push(chunk);
        callback();
      }
    })
  );

  console.log('Transformed data (invalid rows filtered):');
  transformedData.forEach(d =>
    console.log(`  ID: ${d.id}, Value: ${d.value}, Category: ${d.category}`)
  );
  console.log();

  // Demo 4: Batch processing
  console.log('4. Batch Processing Stream:');
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
  const numbersStream = iterableToStream(numbers);
  const batchProcessor = createBatchProcessor(5);
  const batches: number[][] = [];

  await pipelineAsync(
    numbersStream,
    batchProcessor,
    new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        batches.push(chunk);
        callback();
      }
    })
  );

  console.log('Batches (size=5):');
  batches.forEach((batch, i) =>
    console.log(`  Batch ${i + 1}: [${batch.join(', ')}]`)
  );
  console.log();

  // Demo 5: Sliding window
  console.log('5. Sliding Window Stream:');
  const timeSeriesData = [10, 15, 20, 18, 25, 30, 28, 35];
  const timeSeriesStream = iterableToStream(timeSeriesData);
  const windowingStream = createWindowingStream(3, 1);
  const windows: number[][] = [];

  await pipelineAsync(
    timeSeriesStream,
    windowingStream,
    new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        windows.push(chunk);
        callback();
      }
    })
  );

  console.log('Sliding windows (size=3, step=1):');
  windows.forEach((window, i) => {
    const avg = iter(window).mean();
    console.log(`  Window ${i + 1}: [${window.join(', ')}] -> avg: ${avg.toFixed(1)}`);
  });
}

// Run demonstration
demo().catch(console.error);
