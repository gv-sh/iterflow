import { iter } from '../src/index.js';

/**
 * RxJS Interoperability Example
 *
 * This example demonstrates how iterflow can work alongside RxJS,
 * showing patterns for converting between Observables and iterables,
 * and when to use each library.
 *
 * Note: This example uses simulated RxJS types for demonstration.
 * In a real application, install RxJS: npm install rxjs
 */

// Simulated RxJS types and basic implementations for demonstration
type Observer<T> = {
  next: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
};

class Observable<T> {
  constructor(private subscriber: (observer: Observer<T>) => void) {}

  subscribe(observer: Observer<T>) {
    this.subscriber(observer);
  }

  static from<T>(iterable: Iterable<T>): Observable<T> {
    return new Observable(observer => {
      try {
        for (const value of iterable) {
          observer.next(value);
        }
        observer.complete?.();
      } catch (error) {
        observer.error?.(error);
      }
    });
  }

  toArray(): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const items: T[] = [];
      this.subscribe({
        next: (value) => items.push(value),
        error: reject,
        complete: () => resolve(items)
      });
    });
  }
}

// Helper: Convert iterable to Observable (using RxJS from() in real app)
function fromIterable<T>(iterable: Iterable<T>): Observable<T> {
  return Observable.from(iterable);
}

// Helper: Convert Observable to iterable (collect all values)
async function observableToIterable<T>(observable: Observable<T>): Promise<T[]> {
  return observable.toArray();
}

// Example 1: Process data with iterflow, then stream with Observable
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

async function processProductsWithIterflow(products: Product[]) {
  // Use iterflow for synchronous data processing
  const processed = iter(products)
    .filter(p => p.price > 50)
    .sortBy((a, b) => b.price - a.price)
    .take(5)
    .map(p => ({
      ...p,
      discountedPrice: p.price * 0.9
    }));

  // Convert to Observable for reactive streaming
  const observable = fromIterable(processed);

  // Simulate subscription (in real RxJS, you'd use operators)
  const result: any[] = [];
  observable.subscribe({
    next: (product) => result.push(product),
    complete: () => console.log('Processing complete')
  });

  return result;
}

// Example 2: Statistical analysis workflow
interface SensorData {
  timestamp: number;
  temperature: number;
  humidity: number;
}

async function analyzeSensorData(data: SensorData[]) {
  // Use iterflow for statistical computations
  const tempStats = {
    mean: iter(data).map(d => d.temperature).mean(),
    median: iter(data).map(d => d.temperature).median(),
    stdDev: iter(data).map(d => d.temperature).stdDev(),
    quartiles: iter(data).map(d => d.temperature).quartiles()
  };

  const humidityStats = {
    mean: iter(data).map(d => d.humidity).mean(),
    median: iter(data).map(d => d.humidity).median(),
    stdDev: iter(data).map(d => d.humidity).stdDev()
  };

  // Create windowed analysis
  const windows = iter(data)
    .window(5, 2)
    .map(window => ({
      avgTemp: iter(window).map(d => d.temperature).mean(),
      avgHumidity: iter(window).map(d => d.humidity).mean(),
      count: window.length
    }));

  return {
    tempStats,
    humidityStats,
    windows: [...windows]
  };
}

// Example 3: Combining iterflow aggregations with Observable patterns
async function combineDataSources<T>(
  source1: T[],
  source2: T[],
  mergeFn: (items: T[]) => T[]
) {
  // Use iterflow to process and merge
  const merged = iter(source1)
    .concat(iter(source2))
    .toArray();

  const processed = mergeFn(merged);

  // Return as Observable for reactive consumers
  return fromIterable(processed);
}

// Example 4: When to use iterflow vs RxJS
interface DataPoint {
  value: number;
  category: string;
}

async function dataProcessingComparison(data: DataPoint[]) {
  console.log('=== Iterflow vs RxJS Comparison ===\n');

  // Use iterflow for:
  // - Synchronous data processing
  // - Statistical operations
  // - Collection transformations
  console.log('1. Iterflow strengths (synchronous, statistical):');
  const stats = {
    byCategory: iter(data)
      .groupBy(d => d.category)
      .map(([cat, items]) => ({
        category: cat,
        count: items.length,
        mean: iter(items).map(i => i.value).mean(),
        median: iter(items).map(i => i.value).median()
      }))
      .toArray(),

    overall: {
      mean: iter(data).map(d => d.value).mean(),
      stdDev: iter(data).map(d => d.value).stdDev(),
      quartiles: iter(data).map(d => d.value).quartiles()
    }
  };
  console.log('Statistics computed:', stats);
  console.log();

  // Use RxJS for:
  // - Asynchronous event streams
  // - Time-based operations
  // - Complex event composition
  console.log('2. RxJS strengths (async, events, time-based):');
  console.log('- User interactions (clicks, scrolls)');
  console.log('- WebSocket messages');
  console.log('- HTTP requests with retry/timeout');
  console.log('- Real-time data streams');
  console.log('- Debouncing/throttling');
  console.log();

  // Combine both:
  console.log('3. Combined approach:');
  console.log('- Use RxJS to collect async events');
  console.log('- Use iterflow to analyze collected data');
  console.log('- Convert back to Observable if needed for reactive UI');

  return stats;
}

// Example 5: Batch processing pattern
async function batchProcessingPattern<T, R>(
  items: T[],
  processFn: (batch: T[]) => R[],
  batchSize: number
): Promise<R[]> {
  // Use iterflow for batching
  const batches = iter(items).chunk(batchSize);

  const results: R[] = [];

  // Process each batch
  for (const batch of batches) {
    const batchResults = processFn(batch);
    results.push(...batchResults);
  }

  return results;
}

// Example 6: Moving window analysis
function createMovingWindowAnalysis(data: number[], windowSize: number) {
  return iter(data)
    .window(windowSize)
    .map((window, index) => ({
      windowIndex: index,
      values: window,
      mean: iter(window).mean(),
      min: iter(window).min() ?? 0,
      max: iter(window).max() ?? 0,
      range: (iter(window).max() ?? 0) - (iter(window).min() ?? 0)
    }))
    .toArray();
}

// Demonstration
async function demo() {
  console.log('=== RxJS Interoperability Examples ===\n');

  // Demo 1: Product processing
  console.log('1. Product Processing with Iterflow + Observable:');
  const products: Product[] = [
    { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
    { id: 2, name: 'Mouse', price: 25, category: 'Electronics' },
    { id: 3, name: 'Keyboard', price: 75, category: 'Electronics' },
    { id: 4, name: 'Monitor', price: 299, category: 'Electronics' },
    { id: 5, name: 'Desk', price: 399, category: 'Furniture' },
    { id: 6, name: 'Chair', price: 199, category: 'Furniture' },
  ];

  const processedProducts = await processProductsWithIterflow(products);
  console.log('Top 5 products (price > $50, with discount):');
  processedProducts.forEach(p =>
    console.log(`  ${p.name}: $${p.price} -> $${p.discountedPrice.toFixed(2)}`)
  );
  console.log();

  // Demo 2: Sensor data analysis
  console.log('2. Sensor Data Statistical Analysis:');
  const sensorData: SensorData[] = Array.from({ length: 20 }, (_, i) => ({
    timestamp: Date.now() + i * 1000,
    temperature: 20 + Math.random() * 10,
    humidity: 40 + Math.random() * 20
  }));

  const analysis = await analyzeSensorData(sensorData);
  console.log('Temperature stats:', {
    mean: analysis.tempStats.mean.toFixed(1),
    median: analysis.tempStats.median.toFixed(1),
    stdDev: analysis.tempStats.stdDev.toFixed(1)
  });
  console.log('Windowed analysis (first 3 windows):');
  analysis.windows.slice(0, 3).forEach((w, i) =>
    console.log(`  Window ${i + 1}: temp=${w.avgTemp.toFixed(1)}°C, humidity=${w.avgHumidity.toFixed(1)}%`)
  );
  console.log();

  // Demo 3: Data source combination
  console.log('3. Combining Data Sources:');
  const source1 = [1, 2, 3, 4, 5];
  const source2 = [6, 7, 8, 9, 10];
  const combined = await combineDataSources(source1, source2, items =>
    iter(items).filter(n => n % 2 === 0).toArray()
  );
  const combinedResult = await observableToIterable(combined);
  console.log('Combined even numbers:', combinedResult);
  console.log();

  // Demo 4: Comparison guide
  const dataPoints: DataPoint[] = [
    { value: 10, category: 'A' },
    { value: 20, category: 'B' },
    { value: 15, category: 'A' },
    { value: 25, category: 'B' },
    { value: 12, category: 'A' },
  ];
  await dataProcessingComparison(dataPoints);

  // Demo 5: Batch processing
  console.log('4. Batch Processing Pattern:');
  const items = Array.from({ length: 23 }, (_, i) => i + 1);
  const batchResults = await batchProcessingPattern(
    items,
    batch => batch.map(n => n * 2),
    5
  );
  console.log('Batch processed (multiply by 2, batch size=5):');
  console.log('Results:', batchResults.slice(0, 15).join(', '), '...');
  console.log();

  // Demo 6: Moving window
  console.log('5. Moving Window Analysis:');
  const timeSeries = [12, 15, 18, 16, 20, 22, 19, 25, 23, 27];
  const windowAnalysis = createMovingWindowAnalysis(timeSeries, 3);
  console.log('Moving window stats (window=3):');
  windowAnalysis.slice(0, 5).forEach(w =>
    console.log(`  Window ${w.windowIndex + 1}: mean=${w.mean.toFixed(1)}, range=${w.range.toFixed(1)}`)
  );
}

// Run demonstration
demo().catch(console.error);
