import { iter } from '../src/index.js';

/**
 * Web Streams API Integration Example
 *
 * This example demonstrates how to integrate iterflow with the Web Streams API
 * for processing streaming data in browsers and modern JavaScript runtimes.
 */

// Helper: Convert iterable to ReadableStream
function iterableToReadableStream<T>(iterable: Iterable<T>): ReadableStream<T> {
  const iterator = iterable[Symbol.iterator]();

  return new ReadableStream({
    pull(controller) {
      const { value, done } = iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    }
  });
}

// Helper: Convert ReadableStream to async iterable
async function* readableStreamToAsyncIterable<T>(
  stream: ReadableStream<T>
): AsyncIterable<T> {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

// Helper: Create a TransformStream using iterflow operations
function createIterflowTransform<T, R>(
  transformFn: (items: T[]) => Iterable<R>,
  bufferSize: number = 100
): TransformStream<T, R> {
  let buffer: T[] = [];

  return new TransformStream({
    transform(chunk, controller) {
      buffer.push(chunk);
      if (buffer.length >= bufferSize) {
        this.flush?.(controller);
      }
    },
    flush(controller) {
      if (buffer.length > 0) {
        const transformed = transformFn(buffer);
        for (const item of transformed) {
          controller.enqueue(item);
        }
        buffer = [];
      }
    }
  });
}

// Example: Filter and transform stream
interface EventData {
  type: string;
  timestamp: number;
  payload: any;
}

function createEventFilterStream(allowedTypes: string[]): TransformStream<EventData, EventData> {
  return createIterflowTransform<EventData, EventData>(
    items => iter(items)
      .filter(event => allowedTypes.includes(event.type))
      .map(event => ({
        ...event,
        processed: true
      }))
  );
}

// Example: Aggregation stream
interface SensorReading {
  sensorId: string;
  value: number;
  timestamp: number;
}

interface AggregatedReading {
  sensorId: string;
  count: number;
  mean: number;
  min: number;
  max: number;
}

function createAggregationStream(): TransformStream<SensorReading, AggregatedReading> {
  return createIterflowTransform<SensorReading, AggregatedReading>(
    items => {
      const grouped = iter(items).groupBy(r => r.sensorId);
      return grouped.map(([sensorId, readings]) => ({
        sensorId,
        count: readings.length,
        mean: iter(readings).map(r => r.value).mean(),
        min: iter(readings).map(r => r.value).min() ?? 0,
        max: iter(readings).map(r => r.value).max() ?? 0
      }));
    }
  );
}

// Example: Batching stream
function createBatchStream<T>(batchSize: number): TransformStream<T, T[]> {
  let batch: T[] = [];

  return new TransformStream({
    transform(chunk, controller) {
      batch.push(chunk);
      if (batch.length >= batchSize) {
        controller.enqueue([...batch]);
        batch = [];
      }
    },
    flush(controller) {
      if (batch.length > 0) {
        controller.enqueue(batch);
      }
    }
  });
}

// Example: Moving average stream
function createMovingAverageStream(windowSize: number): TransformStream<number, number> {
  return createIterflowTransform<number, number>(
    numbers => {
      const windows = iter(numbers).window(windowSize);
      return windows.map(window => iter(window).mean());
    },
    windowSize * 2
  );
}

// Example: Deduplication stream
function createDeduplicationStream<T, K>(
  keyFn: (item: T) => K
): TransformStream<T, T> {
  return createIterflowTransform<T, T>(
    items => iter(items).distinctBy(keyFn)
  );
}

// Demonstration
async function demo() {
  console.log('=== Web Streams API Integration Examples ===\n');

  // Demo 1: Event filtering
  console.log('1. Event Filtering Stream:');
  const events: EventData[] = [
    { type: 'click', timestamp: 1000, payload: { x: 100, y: 200 } },
    { type: 'scroll', timestamp: 1100, payload: { y: 50 } },
    { type: 'click', timestamp: 1200, payload: { x: 150, y: 250 } },
    { type: 'keypress', timestamp: 1300, payload: { key: 'a' } },
    { type: 'click', timestamp: 1400, payload: { x: 120, y: 180 } },
  ];

  const eventStream = iterableToReadableStream(events);
  const eventFilter = createEventFilterStream(['click', 'keypress']);
  const filteredStream = eventStream.pipeThrough(eventFilter);

  const filteredEvents: EventData[] = [];
  for await (const event of readableStreamToAsyncIterable(filteredStream)) {
    filteredEvents.push(event);
  }

  console.log('Filtered events (click and keypress only):');
  filteredEvents.forEach(e => console.log(`  [${e.type}] at ${e.timestamp}`));
  console.log();

  // Demo 2: Sensor data aggregation
  console.log('2. Sensor Data Aggregation Stream:');
  const readings: SensorReading[] = [
    { sensorId: 'temp-1', value: 23.5, timestamp: 1000 },
    { sensorId: 'temp-2', value: 25.1, timestamp: 1000 },
    { sensorId: 'temp-1', value: 24.0, timestamp: 2000 },
    { sensorId: 'temp-2', value: 25.5, timestamp: 2000 },
    { sensorId: 'temp-1', value: 23.8, timestamp: 3000 },
  ];

  const readingsStream = iterableToReadableStream(readings);
  const aggregator = createAggregationStream();
  const aggregatedStream = readingsStream.pipeThrough(aggregator);

  const aggregated: AggregatedReading[] = [];
  for await (const reading of readableStreamToAsyncIterable(aggregatedStream)) {
    aggregated.push(reading);
  }

  console.log('Aggregated sensor readings:');
  aggregated.forEach(r =>
    console.log(`  ${r.sensorId}: count=${r.count}, mean=${r.mean.toFixed(1)}, min=${r.min}, max=${r.max}`)
  );
  console.log();

  // Demo 3: Batching
  console.log('3. Batching Stream:');
  const numbers = Array.from({ length: 17 }, (_, i) => i + 1);
  const numbersStream = iterableToReadableStream(numbers);
  const batcher = createBatchStream(5);
  const batchedStream = numbersStream.pipeThrough(batcher);

  const batches: number[][] = [];
  for await (const batch of readableStreamToAsyncIterable(batchedStream)) {
    batches.push(batch);
  }

  console.log('Batches (size=5):');
  batches.forEach((batch, i) =>
    console.log(`  Batch ${i + 1}: [${batch.join(', ')}]`)
  );
  console.log();

  // Demo 4: Moving average
  console.log('4. Moving Average Stream:');
  const timeSeries = [10, 12, 15, 14, 18, 20, 19, 22, 25, 23];
  const timeSeriesStream = iterableToReadableStream(timeSeries);
  const movingAvgStream = createMovingAverageStream(3);
  const avgStream = timeSeriesStream.pipeThrough(movingAvgStream);

  const averages: number[] = [];
  for await (const avg of readableStreamToAsyncIterable(avgStream)) {
    averages.push(avg);
  }

  console.log('Moving averages (window=3):');
  console.log('Original:', timeSeries.join(', '));
  console.log('Averages:', averages.map(a => a.toFixed(1)).join(', '));
  console.log();

  // Demo 5: Deduplication
  console.log('5. Deduplication Stream:');
  const items = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 1, name: 'Apple' }, // duplicate
    { id: 3, name: 'Cherry' },
    { id: 2, name: 'Banana' }, // duplicate
  ];

  const itemsStream = iterableToReadableStream(items);
  const deduplicator = createDeduplicationStream((item: typeof items[0]) => item.id);
  const uniqueStream = itemsStream.pipeThrough(deduplicator);

  const uniqueItems: typeof items = [];
  for await (const item of readableStreamToAsyncIterable(uniqueStream)) {
    uniqueItems.push(item);
  }

  console.log('Deduplicated items:');
  uniqueItems.forEach(item => console.log(`  ID: ${item.id}, Name: ${item.name}`));
  console.log();

  // Demo 6: Chaining multiple transforms
  console.log('6. Chained Transforms:');
  const data = Array.from({ length: 20 }, (_, i) => i + 1);
  const dataStream = iterableToReadableStream(data);

  // Filter even numbers, batch them, then transform each batch
  const evenFilter = new TransformStream<number, number>({
    transform(chunk, controller) {
      if (chunk % 2 === 0) {
        controller.enqueue(chunk);
      }
    }
  });

  const batchTransform = createBatchStream<number>(3);

  const batchProcessor = new TransformStream<number[], string>({
    transform(chunk, controller) {
      const sum = iter(chunk).sum();
      const avg = iter(chunk).mean();
      controller.enqueue(`[${chunk.join(', ')}] -> sum: ${sum}, avg: ${avg.toFixed(1)}`);
    }
  });

  const resultStream = dataStream
    .pipeThrough(evenFilter)
    .pipeThrough(batchTransform)
    .pipeThrough(batchProcessor);

  const results: string[] = [];
  for await (const result of readableStreamToAsyncIterable(resultStream)) {
    results.push(result);
  }

  console.log('Chained transform results:');
  results.forEach(r => console.log(`  ${r}`));
}

// Run demonstration
demo().catch(console.error);
