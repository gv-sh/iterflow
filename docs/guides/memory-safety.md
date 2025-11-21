# Memory Safety Guide

This guide explains memory consumption patterns in IterFlow and provides best practices for working with large datasets.

## Table of Contents

- [Understanding Memory Consumption](#understanding-memory-consumption)
- [High-Memory Operations](#high-memory-operations)
- [Memory-Efficient Alternatives](#memory-efficient-alternatives)
- [Memory Safety Best Practices](#memory-safety-best-practices)
- [Performance Benchmarks](#performance-benchmarks)
- [Troubleshooting Memory Issues](#troubleshooting-memory-issues)

---

## Understanding Memory Consumption

IterFlow operations fall into two categories:

### Streaming Operations (Constant Memory)

These operations use **O(1) memory** because they process elements lazily:

- `map()`, `filter()`, `flatMap()`
- `take()`, `drop()`, `skip()`, `takeWhile()`, `dropWhile()`
- `forEach()`, `reduce()` (accumulator size is user-controlled)
- `find()`, `every()`, `some()` (short-circuit evaluation)

**Memory usage:** Minimal (typically < 1 KB)

### Collecting Operations (Linear Memory)

These operations **load all elements into memory** and use **O(n) space**:

- `toArray()`, `toSet()`, `toMap()`
- `reverse()`, `sort()`, `sortBy()`
- `median()`, `variance()`, `stddev()`, `mode()`
- `groupBy()`, `groupByToMap()`, `partition()`

**Memory usage:** Proportional to dataset size (~8 bytes per number in JavaScript)

---

## High-Memory Operations

### Terminal Collection Operations

#### `toArray()`

**Memory Usage:** O(n) - Allocates array for all elements

```typescript
// ⚠️ High memory: Loads 10M elements into memory (~80 MB)
const data = iter.range(1, 10_000_000).toArray();

// ✅ Better: Stream and process in chunks
iter.range(1, 10_000_000)
  .chunk(10_000)
  .forEach(chunk => processChunk(chunk));
```

**Memory Estimate:**
- 1 million numbers: ~8 MB
- 10 million numbers: ~80 MB
- 100 million numbers: ~800 MB (may cause slowdown)

#### `toSet()` and `toMap()`

**Memory Usage:** O(n) - Similar to toArray() but with hash table overhead

```typescript
// ⚠️ High memory: Deduplicates 1M elements in memory
const unique = iter(largeArray).toSet();

// ✅ Better: Use uniqueBy() with streaming
iter(largeArray)
  .uniqueBy(x => x.id)
  .take(1000) // Limit if only need sample
  .toArray();
```

### Sorting Operations

#### `sort()` and `sortBy()`

**Memory Usage:** O(n) space + O(n log n) time

```typescript
// ⚠️ High memory: Loads all elements to sort
const sorted = iter(millionsOfRecords).sort().toArray();

// ✅ Better: Sort in database or external merge sort
// Or limit the result set first
const topTen = iter(records)
  .map(r => r.score)
  .toArray()
  .sort((a, b) => b - a)
  .slice(0, 10);
```

**Note:** JavaScript's built-in sort uses Timsort (O(n log n)) but requires loading all data into memory first.

### Statistical Operations

#### `median()`, `variance()`, `stddev()`

**Memory Usage:** O(n) - Must collect all values

```typescript
// ⚠️ High memory: Calculates median of 1M numbers
const med = iter.range(1, 1_000_000).median();

// ✅ Better: Use streaming approximations for large datasets
// Or use mean() which is less memory-intensive for estimation
const avg = iter.range(1, 1_000_000).mean(); // O(1) memory
```

**Alternative:** For extremely large datasets, use:
- **Median:** Approximate with reservoir sampling or t-digest
- **Variance:** Welford's online algorithm (streaming)
- **Percentiles:** P² algorithm for approximate percentiles

#### `mode()`

**Memory Usage:** O(n) - Creates frequency map

```typescript
// ⚠️ High memory: Counts frequency of all elements
const mostCommon = iter(allUserActions).mode();

// ✅ Better: Use groupBy() with take() for top-k
const topActions = iter(allUserActions)
  .groupBy(action => action)
  .entries()
  .map(([action, instances]) => ({ action, count: instances.length }))
  .sortBy(x => -x.count)
  .take(10)
  .toArray();
```

### Grouping Operations

#### `groupBy()` and `groupByToMap()`

**Memory Usage:** O(n) - Stores all elements in grouped structure

```typescript
// ⚠️ High memory: Groups millions of records
const byCategory = iter(allProducts).groupBy(p => p.category);

// ✅ Better: Process groups in streaming fashion
iter(allProducts)
  .groupBy(p => p.category)
  .forEach(([category, products]) => {
    // Process each group immediately
    const summary = processGroup(category, products);
    saveSummary(summary);
    // products array can be garbage collected after this
  });
```

---

## Memory-Efficient Alternatives

### Pattern 1: Chunking Large Datasets

Process large datasets in manageable chunks:

```typescript
// Instead of: iter(hugeArray).map(expensive).toArray()
// Use chunking:
const results: T[] = [];
for (const chunk of iter(hugeArray).chunk(10_000)) {
  const processed = chunk.map(expensive);
  results.push(...processed);

  // Optional: Allow garbage collection between chunks
  if (results.length % 100_000 === 0) {
    await new Promise(resolve => setImmediate(resolve));
  }
}
```

### Pattern 2: Streaming Aggregation

Replace collecting operations with streaming equivalents:

```typescript
// ❌ Bad: Loads all into memory then reduces
const total = iter(numbers).toArray().reduce((a, b) => a + b, 0);

// ✅ Good: Streams and reduces in one pass
const total = iter(numbers).sum(); // O(1) memory
```

### Pattern 3: Early Limiting

Apply filters and limits before expensive operations:

```typescript
// ❌ Bad: Sorts all, then takes 10
const topTen = iter(millionRecords).sortBy(r => -r.score).take(10).toArray();

// ✅ Good: Use a min-heap for top-k (future feature)
// Current best approach:
const topTen = iter(millionRecords)
  .filter(r => r.score > minimumThreshold) // Filter first
  .toArray()
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);
```

### Pattern 4: Pagination

Process large datasets in pages:

```typescript
const PAGE_SIZE = 1000;

function* processInPages<T>(source: Iterable<T>, pageSize: number) {
  let page: T[] = [];

  for (const item of source) {
    page.push(item);

    if (page.length >= pageSize) {
      yield page;
      page = [];
    }
  }

  if (page.length > 0) {
    yield page;
  }
}

// Usage
for (const page of processInPages(hugDataset, PAGE_SIZE)) {
  await processPage(page);
}
```

---

## Memory Safety Best Practices

### 1. Know Your Dataset Size

Always be aware of how much data you're processing:

```typescript
// ⚠️ Dangerous: Unknown size
iter(unknownSource).toArray();

// ✅ Safe: Limit first
iter(unknownSource).take(10_000).toArray();

// ✅ Safe: Check size if possible
if (array.length < 1_000_000) {
  iter(array).sort().toArray();
} else {
  // Use external sorting or database
}
```

### 2. Use Memory-Efficient Operations

Prefer streaming operations when possible:

```typescript
// ❌ High memory
const doubled = iter(huge).toArray().map(x => x * 2);

// ✅ Low memory (streaming)
const doubled = iter(huge).map(x => x * 2); // Still lazy
```

### 3. Be Cautious with Infinite Sequences

Never use collecting operations on infinite iterators:

```typescript
// ❌ FATAL: Out of memory crash
iter.range(0, Infinity).toArray();

// ✅ Safe: Always limit infinite sequences
iter.range(0, Infinity).take(1000).toArray();

// ✅ Safe: Use streaming operations
iter.range(0, Infinity)
  .filter(x => x % 2 === 0)
  .take(100)
  .forEach(x => console.log(x));
```

### 4. Monitor Memory Usage

Track memory consumption in production:

```typescript
import { iter } from 'iterflow';

function processWithMemoryTracking<T>(data: Iterable<T>) {
  const memBefore = process.memoryUsage().heapUsed;

  const result = iter(data)
    .filter(x => isValid(x))
    .map(x => transform(x))
    .toArray();

  const memAfter = process.memoryUsage().heapUsed;
  const memUsed = (memAfter - memBefore) / 1024 / 1024;

  console.log(`Memory used: ${memUsed.toFixed(2)} MB`);

  return result;
}
```

### 5. Clean Up When Possible

Help the garbage collector by releasing references:

```typescript
// Process and discard immediately
iter(largeDataset)
  .groupBy(x => x.category)
  .forEach(([category, items]) => {
    processGroup(category, items);
    // items can be GC'd after forEach iteration
  });

// Instead of storing everything
const grouped = iter(largeDataset).groupBy(x => x.category); // All in memory
```

---

## Performance Benchmarks

### Memory Consumption by Operation

| Operation | 1K Elements | 10K Elements | 100K Elements | 1M Elements |
|-----------|-------------|--------------|---------------|-------------|
| `map()` (lazy) | < 1 KB | < 1 KB | < 1 KB | < 1 KB |
| `filter()` (lazy) | < 1 KB | < 1 KB | < 1 KB | < 1 KB |
| `toArray()` | 8 KB | 80 KB | 800 KB | 8 MB |
| `sort()` | 8 KB | 80 KB | 800 KB | 8 MB |
| `median()` | 8 KB | 80 KB | 800 KB | 8 MB |
| `groupBy()` | 16 KB | 160 KB | 1.6 MB | 16 MB |
| `window(100)` | 800 B | 800 B | 800 B | 800 B |

*Note: Memory estimates assume 8-byte numbers (IEEE 754 doubles)*

### Time Complexity

| Operation | Best Case | Average Case | Worst Case | Memory |
|-----------|-----------|--------------|------------|--------|
| `map()` | O(1) | O(1) | O(1) | O(1) |
| `filter()` | O(1) | O(1) | O(1) | O(1) |
| `toArray()` | O(n) | O(n) | O(n) | O(n) |
| `sort()` | O(n) | O(n log n) | O(n log n) | O(n) |
| `median()` | O(n) | O(n log n) | O(n log n) | O(n) |
| `groupBy()` | O(n) | O(n) | O(n) | O(n) |

---

## Troubleshooting Memory Issues

### Symptom: "JavaScript heap out of memory"

**Cause:** Attempting to allocate more memory than available

**Solutions:**
1. Increase Node.js heap size: `node --max-old-space-size=4096 script.js`
2. Process data in chunks instead of all at once
3. Use streaming operations instead of collecting operations
4. Filter/limit data earlier in the pipeline

```typescript
// Before
const result = iter(hugeDataset).sort().toArray(); // OOM error

// After
const result = iter(hugeDataset)
  .filter(x => x.priority === 'high') // Reduce size first
  .take(10_000) // Limit results
  .toArray()
  .sort(); // Sort smaller array
```

### Symptom: Slow performance with large arrays

**Cause:** O(n log n) operations on very large datasets

**Solutions:**
1. Use approximate algorithms for statistics
2. Sample the data if exact values not needed
3. Preprocess in database before loading into memory

```typescript
// Slow: Sort 10M elements
const sorted = iter(tenMillionItems).sort();

// Faster: Sample then sort
const sample = iter(tenMillionItems)
  .filter((_, i) => i % 100 === 0) // Every 100th item
  .sort();
```

### Symptom: Memory usage grows over time (memory leak)

**Cause:** Holding references to large objects

**Solutions:**
1. Don't store IterFlow instances - they hold onto iterators
2. Use `forEach()` instead of `toArray()` when possible
3. Process and discard immediately

```typescript
// Bad: Holds reference
const flow = iter(largeData);
// ... later ...
flow.toArray(); // Still holding all data

// Good: Process immediately
iter(largeData).forEach(item => process(item));
```

---

## Memory Limits Reference

### Safe Dataset Sizes (General Guidelines)

| Memory Available | Safe Array Size | Notes |
|------------------|-----------------|-------|
| 512 MB | < 50M elements | Minimal headroom |
| 1 GB | < 100M elements | Comfortable for most operations |
| 2 GB | < 200M elements | Room for multiple operations |
| 4 GB | < 400M elements | Good for large-scale processing |

**Note:** These are conservative estimates for Node.js. Actual limits depend on:
- Element size (objects vs. numbers)
- Other memory usage in your application
- Operating system limits
- Concurrent operations

### When to Use External Processing

Consider using external tools when:
- Dataset > 100M elements
- Available memory < 2x dataset size
- Need to process multiple large datasets concurrently
- Processing time > 1 minute

**Alternatives:**
- Database sorting and grouping (SQL)
- Stream processing frameworks (Apache Spark, Flink)
- External merge sort for very large sorts
- Sampling for statistical approximations

---

## Summary

**Key Takeaways:**

1. ✅ **Use streaming operations** (`map`, `filter`, `take`) for large datasets
2. ✅ **Limit early** with `take()` or `filter()` before collecting operations
3. ✅ **Chunk large datasets** instead of loading all into memory
4. ⚠️ **Avoid collecting operations** (`toArray`, `sort`, `median`) on large datasets
5. ⚠️ **Never use collecting operations** on infinite iterators
6. 📊 **Monitor memory usage** in production
7. 🔄 **Prefer streaming alternatives** when exact results not needed

**Memory Formula:**
```
Memory (MB) ≈ (Number of Elements × Element Size in Bytes) / 1,000,000
```

For numbers: `Memory (MB) ≈ Number of Elements × 8 / 1,000,000`

**Example:**
- 1M numbers ≈ 8 MB
- 10M numbers ≈ 80 MB
- 100M numbers ≈ 800 MB

---

## Related Documentation

- [Performance Optimization Guide](./performance-optimization.md)
- [Infinite Sequences Guide](./infinite-sequences.md)
- [Security Policy](../../SECURITY.md)
- [DoS Protection Guide](./dos-protection.md)
