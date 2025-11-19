# Performance Optimization Guide

This guide helps you get the best performance from IterFlow by understanding when and how to use different operations effectively.

## Table of Contents

- [Understanding Performance Characteristics](#understanding-performance-characteristics)
- [Lazy vs Eager Evaluation](#lazy-vs-eager-evaluation)
- [Operation Categories](#operation-categories)
- [When to Use IterFlow](#when-to-use-iterflow)
- [When to Use Arrays](#when-to-use-arrays)
- [Optimization Strategies](#optimization-strategies)
- [Memory Considerations](#memory-considerations)
- [Benchmarking Your Code](#benchmarking-your-code)
- [Real-World Examples](#real-world-examples)

## Understanding Performance Characteristics

IterFlow's performance depends on several factors:

1. **Lazy evaluation** - Operations are deferred until needed
2. **Early termination** - Pipeline stops when result is found
3. **Memory efficiency** - No intermediate arrays
4. **Operation type** - Lazy vs terminal, buffering vs streaming

### The Performance Model

```typescript
import { iter } from 'iterflow';

// This creates a pipeline but doesn't execute anything
const pipeline = iter([1, 2, 3, 4, 5])
  .map(x => x * 2)      // Lazy
  .filter(x => x > 5);  // Lazy

// This triggers execution
const result = pipeline.toArray(); // Terminal
```

**Key insight:** IterFlow processes elements one at a time through the entire pipeline, rather than creating intermediate collections.

## Lazy vs Eager Evaluation

### Lazy Evaluation Benefits

**Example: Early Termination**

```typescript
// Array: processes all 1 million elements
const hugeArray = Array.from({ length: 1_000_000 }, (_, i) => i);
const arrayResult = hugeArray
  .filter(x => x % 2 === 0)  // Creates 500k element array
  .slice(0, 10);             // Discards 499,990 elements

// IterFlow: stops after finding 10 elements
const iterResult = iter(hugeArray)
  .filter(x => x % 2 === 0)  // Lazy
  .take(10)                   // Only processes ~20 elements
  .toArray();

// IterFlow is ~50,000x more efficient here!
```

**Example: No Intermediate Arrays**

```typescript
// Array: creates 2 intermediate arrays
const numbers = Array.from({ length: 10_000 }, (_, i) => i);
const arrayResult = numbers
  .map(x => x * 2)      // Creates 10k element array
  .filter(x => x > 100) // Creates ~9.9k element array
  .slice(0, 5);         // Final 5 element array

// IterFlow: zero intermediate arrays
const iterResult = iter(numbers)
  .map(x => x * 2)      // Lazy
  .filter(x => x > 100) // Lazy
  .take(5)              // Lazy
  .toArray();           // Processes exactly what's needed
```

### When Eager is Better

For small datasets where overhead matters:

```typescript
// For arrays < 100 elements, native methods may be faster
const smallArray = [1, 2, 3, 4, 5];

// Native: ~0.001ms
const result1 = smallArray.filter(x => x > 2);

// IterFlow: ~0.002ms (overhead of iterator creation)
const result2 = iter(smallArray).filter(x => x > 2).toArray();
```

## Operation Categories

### Streaming Operations (Most Efficient)

These operations process one element at a time with O(1) memory:

```typescript
// All streaming - very efficient
iter(data)
  .map(transform)       // O(1) memory
  .filter(predicate)    // O(1) memory
  .take(10)             // O(1) memory
  .drop(5)              // O(1) memory
  .tap(log)             // O(1) memory
  .flatMap(expand)      // O(1) memory
  .toArray();
```

**Streaming operations:**
- `map()`, `filter()`, `flatMap()`
- `take()`, `drop()`, `takeWhile()`, `dropWhile()`
- `tap()`, `enumerate()`
- `concat()`, `intersperse()`

### Buffering Operations (Memory Usage)

These operations must buffer elements in memory:

```typescript
// Buffers entire dataset
iter(data)
  .window(3)      // O(window size)
  .chunk(10)      // O(chunk size)
  .reverse()      // O(n) - buffers all
  .sort()         // O(n) - buffers all
  .toArray();     // O(n) - buffers all
```

**Buffering operations:**
- `window()` - O(window size)
- `chunk()` - O(chunk size)
- `pairwise()` - O(2)
- `reverse()` - O(n)
- `sort()`, `sortBy()` - O(n)
- `distinct()`, `distinctBy()` - O(unique elements)

### Terminal Operations (Varies)

Some terminal operations are single-pass and efficient:

```typescript
// Single-pass terminals (efficient)
iter(data).sum();       // O(1) memory
iter(data).count();     // O(1) memory
iter(data).find(pred);  // O(1) memory, early termination
iter(data).some(pred);  // O(1) memory, early termination
iter(data).every(pred); // O(1) memory, early termination
```

Others require buffering:

```typescript
// Buffering terminals (use memory)
iter(data).median();     // O(n) - must sort
iter(data).variance();   // O(n) - two passes
iter(data).quartiles();  // O(n) - must sort
iter(data).groupBy(key); // O(n) - stores groups
```

## When to Use IterFlow

### ✅ Excellent Use Cases

#### 1. Large Datasets with Early Termination

```typescript
// Find first 10 matching items in millions
const matches = iter(millionsOfRecords)
  .filter(complexPredicate)
  .take(10)
  .toArray();
```

#### 2. Long Transformation Chains

```typescript
// Multiple transformations without intermediate arrays
const result = iter(data)
  .filter(isValid)
  .map(normalize)
  .filter(inRange)
  .map(transform)
  .distinct()
  .toArray();
```

#### 3. Statistical Operations

```typescript
// Built-in optimized implementations
const stats = {
  mean: iter(numbers).mean(),
  median: iter(numbers).median(),
  stdDev: iter(numbers).stdDev(),
  p95: iter(numbers).percentile(95),
};
```

#### 4. Windowing Operations

```typescript
// Moving averages
const movingAvg = iter(timeSeries)
  .window(7)
  .map(week => iter(week).mean())
  .toArray();
```

#### 5. Infinite Sequences

```typescript
// Generate and process infinite sequences
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const firstTenFibs = iter(fibonacci())
  .take(10)
  .toArray();
```

#### 6. Stream Processing

```typescript
// Process data streams without loading all into memory
async function processLargeFile(stream) {
  return iter(stream)
    .filter(isValid)
    .map(parse)
    .chunk(100)
    .map(batch => processBatch(batch));
}
```

## When to Use Arrays

### ✅ Better Array Use Cases

#### 1. Small Datasets

```typescript
// For < 100 elements, native methods have less overhead
const small = [1, 2, 3, 4, 5];
const result = small.filter(x => x > 2); // Simpler, faster
```

#### 2. Single Operation

```typescript
// One operation, no chaining
const doubled = numbers.map(x => x * 2); // Fine with arrays
```

#### 3. Random Access Needed

```typescript
// Need to access by index multiple times
const arr = [1, 2, 3, 4, 5];
const value1 = arr[2];
const value2 = arr[4];
// Arrays are O(1) for index access
```

#### 4. Full Materialization Required

```typescript
// When you need the entire result anyway
const allResults = data.map(transform); // If you need all results
```

#### 5. Sorting Small Lists

```typescript
// Native sort is highly optimized for small arrays
const sorted = smallArray.sort((a, b) => a - b);
```

## Optimization Strategies

### Strategy 1: Filter Early

Place filters as early as possible in the pipeline:

```typescript
// ❌ Bad: processes all elements through expensive operations
iter(data)
  .map(expensiveTransform)
  .map(anotherTransform)
  .filter(isRelevant)
  .toArray();

// ✅ Good: filters first, processes less data
iter(data)
  .filter(isRelevant)
  .map(expensiveTransform)
  .map(anotherTransform)
  .toArray();
```

### Strategy 2: Use take() for Limits

Replace slice after processing with take before:

```typescript
// ❌ Bad: processes all then discards most
iter(data)
  .map(transform)
  .filter(predicate)
  .toArray()
  .slice(0, 10);

// ✅ Good: stops after finding 10
iter(data)
  .map(transform)
  .filter(predicate)
  .take(10)
  .toArray();
```

### Strategy 3: Avoid Multiple Passes

```typescript
// ❌ Bad: iterates multiple times
const sum = iter(data).sum();
const count = iter(data).count();
const mean = sum / count;

// ✅ Good: single pass
const mean = iter(data).mean();
```

### Strategy 4: Use Specialized Operations

```typescript
// ❌ Bad: manual implementation
const sum = iter(data).reduce((a, b) => a + b, 0);

// ✅ Good: optimized built-in
const sum = iter(data).sum();
```

### Strategy 5: Minimize Buffering Operations

```typescript
// ❌ Bad: multiple buffering operations
iter(data)
  .reverse()      // Buffers all
  .sort()         // Buffers all again
  .distinct()     // Buffers unique
  .toArray();

// ✅ Better: combine where possible
iter(data)
  .distinct()     // Reduce size first
  .sort()         // Sort smaller set
  .toArray();
// (reverse at end if needed)
```

### Strategy 6: Reuse Pipelines for Hot Paths

```typescript
// ❌ Bad: recreates pipeline each time
function processRequest(data: number[]) {
  return iter(data)
    .filter(x => x > 0)
    .map(x => x * 2)
    .toArray();
}

// ✅ Good: reuse pipeline structure (for functional API)
import { pipe, filter, map, toArray } from 'iterflow/fn';

const processRequest = pipe(
  filter((x: number) => x > 0),
  map((x: number) => x * 2),
  toArray
);
```

## Memory Considerations

### Understanding Memory Usage

```typescript
// Low memory: streaming operations
iter(millionsOfItems)
  .filter(pred)
  .map(transform)
  .take(100)
  .toArray(); // Only 100 items in memory

// High memory: buffering operations
iter(millionsOfItems)
  .toArray()     // ALL items in memory
  .reverse()     // Duplicate in memory
  .sort();       // Another copy in memory
```

### Memory-Efficient Patterns

#### Pattern 1: Streaming Aggregation

```typescript
// ✅ Good: constant memory
const sum = iter(hugeDataset).sum(); // O(1) memory

// ❌ Bad: loads all data
const sum = iter(hugeDataset)
  .toArray()
  .reduce((a, b) => a + b, 0); // O(n) memory
```

#### Pattern 2: Chunked Processing

```typescript
// Process large data in chunks to control memory
iter(hugeDataset)
  .chunk(1000)
  .map(chunk => processChunk(chunk))
  .toArray();
```

#### Pattern 3: Window Size Management

```typescript
// ❌ Bad: large windows on huge datasets
iter(millionsOfItems).window(10000); // 10k items in memory per window

// ✅ Good: smaller windows
iter(millionsOfItems).window(100); // 100 items in memory per window
```

## Benchmarking Your Code

### Using Vitest Bench

```typescript
import { bench, describe } from 'vitest';
import { iter } from 'iterflow';

describe('Performance comparison', () => {
  const data = Array.from({ length: 10_000 }, (_, i) => i);

  bench('Array approach', () => {
    data
      .filter(x => x % 2 === 0)
      .map(x => x * 2)
      .slice(0, 100);
  });

  bench('IterFlow approach', () => {
    iter(data)
      .filter(x => x % 2 === 0)
      .map(x => x * 2)
      .take(100)
      .toArray();
  });
});
```

### Using console.time

```typescript
const data = Array.from({ length: 1_000_000 }, (_, i) => i);

console.time('Array');
const result1 = data
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .slice(0, 10);
console.timeEnd('Array');

console.time('IterFlow');
const result2 = iter(data)
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(10)
  .toArray();
console.timeEnd('IterFlow');
```

## Real-World Examples

### Example 1: Log Processing

```typescript
// Process millions of log entries efficiently
async function analyzeLogFiles(logStream: AsyncIterable<string>) {
  const errorStats = iter(logStream)
    .filter(line => line.includes('ERROR'))
    .map(line => parseLogLine(line))
    .filter(entry => entry.timestamp > yesterday)
    .groupBy(entry => entry.errorCode);

  return errorStats;
}
```

**Why IterFlow wins:**
- Streams data without loading all logs
- Filters early to reduce processing
- Built-in groupBy is optimized

### Example 2: Time Series Analysis

```typescript
interface DataPoint {
  timestamp: number;
  value: number;
}

function calculateMovingAverage(
  data: DataPoint[],
  windowSize: number
): DataPoint[] {
  return iter(data)
    .window(windowSize)
    .map(window => ({
      timestamp: window[Math.floor(window.length / 2)].timestamp,
      value: iter(window).map(d => d.value).mean()!,
    }))
    .toArray();
}
```

**Why IterFlow wins:**
- Window operation is built-in and efficient
- Statistical mean is optimized
- No intermediate arrays

### Example 3: Data Validation Pipeline

```typescript
interface Record {
  id: string;
  value: number;
  tags: string[];
}

function validateAndProcess(records: Record[]): Record[] {
  return iter(records)
    .filter(r => r.value > 0)           // Early filtering
    .distinctBy(r => r.id)              // Remove duplicates
    .filter(r => r.tags.length > 0)     // More filtering
    .map(r => ({                        // Transform
      ...r,
      value: r.value * 1.1,
    }))
    .take(1000)                         // Limit results
    .toArray();
}
```

**Why IterFlow wins:**
- Filters early and often
- Deduplication is built-in
- Stops at 1000 items
- No intermediate arrays

### Example 4: Pagination Processing

```typescript
// Efficiently process paginated API results
async function* fetchAllPages(endpoint: string) {
  let page = 1;
  while (true) {
    const response = await fetch(`${endpoint}?page=${page}`);
    const data = await response.json();
    if (data.length === 0) break;
    yield* data;
    page++;
  }
}

// Process only what you need
const firstHundredValid = iter(fetchAllPages('/api/users'))
  .filter(user => user.active)
  .take(100)
  .toArray();
```

**Why IterFlow wins:**
- Works with async generators
- Stops fetching after finding 100 items
- No need to load all pages

## Performance Decision Tree

```
Is the dataset > 1000 elements?
├─ YES
│  └─ Do you need early termination (take, find, some)?
│     ├─ YES → Use IterFlow ✅
│     └─ NO
│        └─ Do you have 3+ operations chained?
│           ├─ YES → Use IterFlow ✅
│           └─ NO → Consider Arrays
└─ NO
   └─ Is it a single operation?
      ├─ YES → Use Arrays ✅
      └─ NO
         └─ Do you need statistical/windowing operations?
            ├─ YES → Use IterFlow ✅
            └─ NO → Use Arrays ✅
```

## Summary

### Use IterFlow When:
- ✅ Working with large datasets (> 1000 elements)
- ✅ Chaining multiple operations
- ✅ Need early termination (take, find, etc.)
- ✅ Performing statistical operations
- ✅ Using windowing (chunk, window, pairwise)
- ✅ Processing streams or generators
- ✅ Memory efficiency is important

### Use Arrays When:
- ✅ Small datasets (< 100 elements)
- ✅ Single operation, no chaining
- ✅ Need random access by index
- ✅ Full materialization required
- ✅ Integration with array-only APIs

### Key Optimizations:
1. Filter early in the pipeline
2. Use `take()` instead of processing then slicing
3. Avoid multiple passes when possible
4. Use specialized operations (sum, mean, etc.)
5. Minimize buffering operations
6. Control memory with chunking

## Next Steps

- Read about [Working with Infinite Sequences](infinite-sequences.md)
- Explore [Common Patterns and Recipes](common-patterns.md)
- Check the [Migration Guide](migration-from-arrays.md) for more examples
