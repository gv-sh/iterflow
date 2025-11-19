# Common Patterns and Recipes

A collection of practical patterns and recipes for solving real-world problems with IterFlow.

## Table of Contents

- [Data Processing](#data-processing)
- [Statistical Analysis](#statistical-analysis)
- [Time Series Processing](#time-series-processing)
- [Data Validation](#data-validation)
- [File Processing](#file-processing)
- [API Response Handling](#api-response-handling)
- [Data Transformation](#data-transformation)
- [Grouping and Aggregation](#grouping-and-aggregation)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)

## Data Processing

### Filter and Transform Pipeline

Process data through multiple transformations:

```typescript
import { iter } from 'iterflow';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

const products: Product[] = [...];

// Get names of in-stock products over $50 in Electronics
const result = iter(products)
  .filter(p => p.inStock)
  .filter(p => p.price > 50)
  .filter(p => p.category === 'Electronics')
  .map(p => p.name)
  .toArray();
```

### Batch Processing

Process data in chunks:

```typescript
// Process large dataset in batches
function processBatch(items: number[]): number {
  return items.reduce((a, b) => a + b, 0);
}

const batchResults = iter(largeDataset)
  .chunk(1000)  // Process 1000 items at a time
  .map(batch => processBatch(batch))
  .toArray();
```

### Deduplication

Remove duplicates from data:

```typescript
// Simple deduplication
const uniqueValues = iter([1, 2, 2, 3, 3, 3, 4])
  .distinct()
  .toArray();
// [1, 2, 3, 4]

// Deduplicate by property
interface User {
  id: number;
  email: string;
}

const uniqueUsers = iter(users)
  .distinctBy(u => u.email)
  .toArray();
```

### Pagination

Implement pagination logic:

```typescript
function paginate<T>(
  items: Iterable<T>,
  page: number,
  pageSize: number
): T[] {
  return iter(items)
    .drop((page - 1) * pageSize)
    .take(pageSize)
    .toArray();
}

// Get page 3 with 20 items per page
const page3 = paginate(allItems, 3, 20);
```

## Statistical Analysis

### Basic Statistics

Calculate common statistics:

```typescript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const stats = {
  count: iter(data).count(),
  sum: iter(data).sum(),
  mean: iter(data).mean(),
  median: iter(data).median(),
  min: iter(data).min(),
  max: iter(data).max(),
  stdDev: iter(data).stdDev(),
  variance: iter(data).variance(),
};
```

### Quartile Analysis

Analyze data distribution:

```typescript
const scores = [65, 70, 75, 80, 85, 90, 95, 100];

const distribution = iter(scores).quartiles();
// { Q1: 71.25, Q2: 82.5, Q3: 93.75 }

const p95 = iter(scores).percentile(95);
// 98.5
```

### Frequency Distribution

Count occurrences:

```typescript
const grades = ['A', 'B', 'A', 'C', 'B', 'A', 'D', 'B', 'A'];

const frequency = iter(grades)
  .groupBy(g => g)
  .entries()
  .map(([grade, occurrences]) => ({
    grade,
    count: occurrences.length,
  }))
  .toArray();
// [
//   { grade: 'A', count: 4 },
//   { grade: 'B', count: 3 },
//   { grade: 'C', count: 1 },
//   { grade: 'D', count: 1 }
// ]
```

### Outlier Detection

Identify outliers using IQR method:

```typescript
function findOutliers(data: number[]): number[] {
  const q = iter(data).quartiles();
  if (!q) return [];

  const iqr = q.Q3 - q.Q1;
  const lowerBound = q.Q1 - 1.5 * iqr;
  const upperBound = q.Q3 + 1.5 * iqr;

  return iter(data)
    .filter(x => x < lowerBound || x > upperBound)
    .toArray();
}

const outliers = findOutliers([1, 2, 3, 4, 5, 100, 200]);
// [100, 200]
```

### Correlation Analysis

Calculate correlation between two datasets:

```typescript
const studyHours = [2, 3, 4, 5, 6, 7, 8];
const testScores = [60, 65, 70, 75, 80, 85, 90];

const correlation = iter(studyHours).correlation(testScores);
// ~0.999 (strong positive correlation)
```

## Time Series Processing

### Moving Average

Calculate moving averages:

```typescript
const prices = [10, 12, 13, 15, 14, 16, 18, 17, 19, 20];

// 3-period simple moving average
const sma = iter(prices)
  .window(3)
  .map(window => iter(window).mean())
  .toArray();
// [11.67, 13.33, 14, 15, 16, 17, 18, 18.67]
```

### Exponential Moving Average

Implement EMA:

```typescript
function ema(data: number[], period: number): number[] {
  const multiplier = 2 / (period + 1);
  const result: number[] = [];

  iter(data).reduce((prev, current) => {
    const emaValue = prev === null
      ? current
      : (current - prev) * multiplier + prev;
    result.push(emaValue);
    return emaValue;
  }, null as number | null);

  return result;
}
```

### Rate of Change

Calculate percentage change:

```typescript
const values = [100, 105, 110, 108, 112];

const changes = iter(values)
  .pairwise()
  .map(([prev, curr]) => ((curr - prev) / prev) * 100)
  .toArray();
// [5, 4.76, -1.82, 3.70]
```

### Trend Detection

Detect increasing/decreasing trends:

```typescript
function detectTrend(data: number[], windowSize: number) {
  return iter(data)
    .window(windowSize)
    .map(window => {
      const increasing = iter(window)
        .pairwise()
        .every(([a, b]) => b >= a);

      const decreasing = iter(window)
        .pairwise()
        .every(([a, b]) => b <= a);

      return increasing ? 'up' : decreasing ? 'down' : 'sideways';
    })
    .toArray();
}

const trend = detectTrend([1, 2, 3, 4, 3, 2, 1], 3);
// ['up', 'up', 'down', 'down', 'down']
```

### Time-Windowed Aggregation

Aggregate data by time windows:

```typescript
interface DataPoint {
  timestamp: number;
  value: number;
}

function aggregateByMinute(data: DataPoint[]) {
  return iter(data)
    .groupBy(d => Math.floor(d.timestamp / 60000)) // Group by minute
    .entries()
    .map(([minute, points]) => ({
      timestamp: minute * 60000,
      avg: iter(points).map(p => p.value).mean(),
      min: iter(points).map(p => p.value).min(),
      max: iter(points).map(p => p.value).max(),
      count: points.length,
    }))
    .toArray();
}
```

## Data Validation

### Validate and Filter

Validate data and collect errors:

```typescript
interface ValidationResult<T> {
  valid: T[];
  invalid: Array<{ item: T; error: string }>;
}

function validateAndSplit<T>(
  items: T[],
  validator: (item: T) => string | null
): ValidationResult<T> {
  const [valid, invalid] = iter(items)
    .map(item => ({ item, error: validator(item) }))
    .partition(result => result.error === null);

  return {
    valid: valid.map(r => r.item),
    invalid: invalid.map(r => ({ item: r.item, error: r.error! })),
  };
}

// Usage
const result = validateAndSplit(
  [{ age: 25 }, { age: -5 }, { age: 30 }],
  user => user.age < 0 ? 'Age cannot be negative' : null
);
```

### Schema Validation

Validate against a schema:

```typescript
interface Schema {
  [key: string]: (value: any) => boolean;
}

function validateSchema<T extends Record<string, any>>(
  items: T[],
  schema: Schema
): T[] {
  return iter(items)
    .filter(item =>
      Object.entries(schema).every(([key, validator]) =>
        validator(item[key])
      )
    )
    .toArray();
}

// Usage
const validUsers = validateSchema(users, {
  age: (age: number) => age >= 0 && age <= 120,
  email: (email: string) => email.includes('@'),
  name: (name: string) => name.length > 0,
});
```

### Data Sanitization

Clean and sanitize input:

```typescript
function sanitizeData(items: string[]): string[] {
  return iter(items)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => s.toLowerCase())
    .distinct()
    .toArray();
}

const cleaned = sanitizeData(['  Hello  ', 'WORLD', 'hello', '  ', 'world']);
// ['hello', 'world']
```

## File Processing

### CSV Processing

Process CSV-like data:

```typescript
function parseCSV(lines: string[]) {
  return iter(lines)
    .drop(1) // Skip header
    .map(line => line.split(','))
    .filter(row => row.length > 0)
    .map(row => ({
      name: row[0]?.trim(),
      value: parseFloat(row[1]) || 0,
    }))
    .filter(item => item.name && !isNaN(item.value))
    .toArray();
}
```

### Log File Analysis

Analyze log files:

```typescript
interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

function analyzeLogFile(logs: string[]) {
  const entries = iter(logs)
    .map(parseLogLine)
    .filter(entry => entry !== null)
    .toArray() as LogEntry[];

  return {
    total: entries.length,
    byLevel: iter(entries).groupBy(e => e.level),
    errors: iter(entries)
      .filter(e => e.level === 'ERROR')
      .toArray(),
    errorRate: iter(entries)
      .filter(e => e.level === 'ERROR')
      .count() / entries.length,
  };
}
```

### Large File Streaming

Process files in chunks to control memory:

```typescript
async function* readFileInChunks(filePath: string, chunkSize: number) {
  // Pseudo-code for file reading
  const fileHandle = await openFile(filePath);
  while (!fileHandle.eof) {
    yield await fileHandle.read(chunkSize);
  }
}

// Process large file
async function processLargeFile(filePath: string) {
  const results: number[] = [];

  for await (const chunk of readFileInChunks(filePath, 1024)) {
    const processed = iter(chunk.split('\n'))
      .filter(line => line.length > 0)
      .map(line => parseInt(line))
      .filter(n => !isNaN(n))
      .toArray();

    results.push(...processed);
  }

  return iter(results).sum();
}
```

## API Response Handling

### Flatten Nested Responses

Flatten paginated API responses:

```typescript
interface ApiResponse {
  data: Item[];
  nextPage: string | null;
}

async function* fetchAllPages(endpoint: string) {
  let url: string | null = endpoint;
  while (url) {
    const response: ApiResponse = await fetch(url).then(r => r.json());
    yield* response.data;
    url = response.nextPage;
  }
}

// Get all items
const allItems = iter(fetchAllPages('/api/items'))
  .take(1000) // Limit to prevent infinite fetching
  .toArray();
```

### Response Transformation

Transform API responses to domain models:

```typescript
interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email_address: string;
}

interface DomainUser {
  id: number;
  fullName: string;
  email: string;
}

function transformUsers(apiUsers: ApiUser[]): DomainUser[] {
  return iter(apiUsers)
    .map(u => ({
      id: u.id,
      fullName: `${u.first_name} ${u.last_name}`,
      email: u.email_address,
    }))
    .toArray();
}
```

### Error Recovery

Handle API errors gracefully:

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function processResults<T>(results: Result<T>[]): T[] {
  return iter(results)
    .filter((r): r is Extract<Result<T>, { success: true }> => r.success)
    .map(r => r.data)
    .toArray();
}
```

## Data Transformation

### Denormalization

Flatten nested structures:

```typescript
interface Department {
  id: number;
  name: string;
  employees: Employee[];
}

interface Employee {
  id: number;
  name: string;
}

interface FlatRecord {
  deptId: number;
  deptName: string;
  empId: number;
  empName: string;
}

function denormalize(departments: Department[]): FlatRecord[] {
  return iter(departments)
    .flatMap(dept =>
      dept.employees.map(emp => ({
        deptId: dept.id,
        deptName: dept.name,
        empId: emp.id,
        empName: emp.name,
      }))
    )
    .toArray();
}
```

### Normalization

Convert flat data to nested structures:

```typescript
function normalize(records: FlatRecord[]): Department[] {
  const deptMap = iter(records)
    .groupBy(r => r.deptId);

  return Array.from(deptMap.entries()).map(([deptId, records]) => ({
    id: deptId,
    name: records[0].deptName,
    employees: iter(records)
      .map(r => ({
        id: r.empId,
        name: r.empName,
      }))
      .distinctBy(e => e.id)
      .toArray(),
  }));
}
```

### Pivoting Data

Transform rows to columns:

```typescript
interface Sale {
  product: string;
  month: string;
  amount: number;
}

function pivotByMonth(sales: Sale[]) {
  const products = iter(sales)
    .map(s => s.product)
    .distinct()
    .toArray();

  return products.map(product => {
    const productSales = iter(sales)
      .filter(s => s.product === product)
      .groupBy(s => s.month);

    return {
      product,
      ...Object.fromEntries(productSales),
    };
  });
}
```

## Grouping and Aggregation

### Multi-Level Grouping

Group by multiple criteria:

```typescript
interface Transaction {
  category: string;
  type: 'income' | 'expense';
  amount: number;
}

function groupByCategoryAndType(transactions: Transaction[]) {
  return iter(transactions)
    .groupBy(t => t.category)
    .entries()
    .map(([category, items]) => ({
      category,
      byType: iter(items).groupBy(t => t.type),
    }))
    .toArray();
}
```

### Aggregate with Calculations

Perform complex aggregations:

```typescript
interface Order {
  customerId: number;
  amount: number;
  date: Date;
}

function customerStats(orders: Order[]) {
  return iter(orders)
    .groupBy(o => o.customerId)
    .entries()
    .map(([customerId, customerOrders]) => ({
      customerId,
      totalOrders: customerOrders.length,
      totalAmount: iter(customerOrders).map(o => o.amount).sum(),
      avgAmount: iter(customerOrders).map(o => o.amount).mean(),
      maxAmount: iter(customerOrders).map(o => o.amount).max(),
      firstOrder: iter(customerOrders)
        .map(o => o.date)
        .reduce((min, date) => date < min ? date : min, new Date()),
    }))
    .toArray();
}
```

### Top N by Group

Find top items in each group:

```typescript
function topProductsByCategory(
  products: Product[],
  n: number
) {
  return iter(products)
    .groupBy(p => p.category)
    .entries()
    .map(([category, items]) => ({
      category,
      topProducts: iter(items)
        .sortBy((a, b) => b.price - a.price)
        .take(n)
        .toArray(),
    }))
    .toArray();
}
```

## Error Handling

### Try-Catch in Pipeline

Handle errors in transformations:

```typescript
function safeParseInt(str: string): number | null {
  try {
    const num = parseInt(str);
    return isNaN(num) ? null : num;
  } catch {
    return null;
  }
}

const numbers = iter(['1', '2', 'abc', '3'])
  .map(safeParseInt)
  .filter((n): n is number => n !== null)
  .toArray();
// [1, 2, 3]
```

### Error Collection

Collect errors while processing:

```typescript
interface ProcessingResult<T, E> {
  successes: T[];
  errors: E[];
}

function processWithErrors<T, U>(
  items: T[],
  processor: (item: T) => U
): ProcessingResult<U, { item: T; error: Error }> {
  const successes: U[] = [];
  const errors: { item: T; error: Error }[] = [];

  iter(items).forEach(item => {
    try {
      successes.push(processor(item));
    } catch (error) {
      errors.push({ item, error: error as Error });
    }
  });

  return { successes, errors };
}
```

## Performance Optimization

### Early Filtering

Filter before expensive operations:

```typescript
// ❌ Bad: expensive operation on all items
const result = iter(items)
  .map(expensiveTransform)
  .filter(isRelevant)
  .toArray();

// ✅ Good: filter first
const result = iter(items)
  .filter(isRelevant)
  .map(expensiveTransform)
  .toArray();
```

### Lazy Evaluation for Large Datasets

Use lazy evaluation to avoid processing everything:

```typescript
// Find first 10 matches in millions of records
const matches = iter(millionRecords)
  .filter(matchesCriteria)
  .take(10)
  .toArray();
// Only processes until 10 matches are found
```

### Memoization

Cache expensive computations:

```typescript
const cache = new Map<string, number>();

function expensiveOperation(key: string): number {
  if (!cache.has(key)) {
    cache.set(key, /* expensive calculation */);
  }
  return cache.get(key)!;
}

const results = iter(items)
  .map(item => expensiveOperation(item.key))
  .toArray();
```

## Summary

This guide covered:

- **Data Processing**: Filtering, batching, deduplication, pagination
- **Statistical Analysis**: Basic stats, quartiles, frequency, outliers, correlation
- **Time Series**: Moving averages, rate of change, trend detection
- **Data Validation**: Validation, schema checking, sanitization
- **File Processing**: CSV, log files, streaming large files
- **API Handling**: Pagination, transformation, error recovery
- **Data Transformation**: Denormalization, normalization, pivoting
- **Grouping**: Multi-level grouping, aggregations, top N
- **Error Handling**: Safe parsing, error collection
- **Performance**: Early filtering, lazy evaluation, memoization

## Next Steps

- Read the [Performance Optimization Guide](performance-optimization.md) for more tips
- Check out [TypeScript Best Practices](typescript-best-practices.md)
- Explore the [API Reference](../api.md) for all available operations

Happy coding with IterFlow! 🚀
