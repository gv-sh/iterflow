# Migration Guide: From Array Methods to IterFlow

This guide helps you transition from traditional array methods to IterFlow, showing you how to leverage iterators for more efficient data processing.

## Table of Contents

- [Why Migrate?](#why-migrate)
- [Quick Reference](#quick-reference)
- [Basic Transformations](#basic-transformations)
- [Aggregations and Statistics](#aggregations-and-statistics)
- [Finding and Testing](#finding-and-testing)
- [Grouping and Partitioning](#grouping-and-partitioning)
- [Advanced Patterns](#advanced-patterns)
- [Performance Considerations](#performance-considerations)
- [Migration Strategy](#migration-strategy)

## Why Migrate?

IterFlow offers several advantages over traditional array methods:

1. **Lazy Evaluation** - Process only what you need
2. **Memory Efficiency** - No intermediate arrays
3. **Statistical Operations** - Built-in mean, median, variance, etc.
4. **Windowing Operations** - Easy chunking and sliding windows
5. **Infinite Sequences** - Work with generators and streams
6. **Type Safety** - Better TypeScript inference

## Quick Reference

| Array Method | IterFlow Equivalent | Notes |
|--------------|---------------------|-------|
| `arr.map()` | `iter(arr).map()` | Lazy evaluation |
| `arr.filter()` | `iter(arr).filter()` | Lazy evaluation |
| `arr.reduce()` | `iter(arr).reduce()` | Terminal operation |
| `arr.find()` | `iter(arr).find()` | Terminal operation |
| `arr.some()` | `iter(arr).some()` | Terminal operation |
| `arr.every()` | `iter(arr).every()` | Terminal operation |
| `arr.slice(0, n)` | `iter(arr).take(n)` | Lazy, more efficient |
| `arr.slice(n)` | `iter(arr).drop(n)` | Lazy, more efficient |
| `arr.concat()` | `iter(arr).concat()` | Lazy evaluation |
| `arr.flat()` | `iter(arr).flatMap()` | Lazy evaluation |
| `arr.reverse()` | `iter(arr).reverse()` | Buffers elements |
| `arr.sort()` | `iter(arr).sort()` | Buffers elements |
| `[...new Set(arr)]` | `iter(arr).distinct()` | Lazy evaluation |
| `arr.length` | `iter(arr).count()` | Terminal operation |
| `arr.includes()` | `iter(arr).includes()` | Terminal operation |
| `arr[0]` | `iter(arr).first()` | Terminal operation |
| `arr[arr.length-1]` | `iter(arr).last()` | Terminal operation |
| N/A | `iter(arr).sum()` | New functionality |
| N/A | `iter(arr).mean()` | New functionality |
| N/A | `iter(arr).median()` | New functionality |
| N/A | `iter(arr).window()` | New functionality |
| N/A | `iter(arr).chunk()` | New functionality |

## Basic Transformations

### map()

**Array approach:**
```typescript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
```

**IterFlow approach:**
```typescript
import { iter } from 'iterflow';

const numbers = [1, 2, 3, 4, 5];
const doubled = iter(numbers)
  .map(x => x * 2)
  .toArray();
```

**Key difference:** IterFlow's `map()` is lazy - it doesn't execute until you call a terminal operation like `toArray()`.

### filter()

**Array approach:**
```typescript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(x => x % 2 === 0);
```

**IterFlow approach:**
```typescript
const evens = iter(numbers)
  .filter(x => x % 2 === 0)
  .toArray();
```

### Chaining map() and filter()

**Array approach (creates intermediate array):**
```typescript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const result = numbers
  .filter(x => x % 2 === 0)  // Creates intermediate array
  .map(x => x * 2)            // Creates another intermediate array
  .filter(x => x > 8);        // Creates final array
```

**IterFlow approach (no intermediate arrays):**
```typescript
const result = iter(numbers)
  .filter(x => x % 2 === 0)  // Lazy
  .map(x => x * 2)            // Lazy
  .filter(x => x > 8)         // Lazy
  .toArray();                 // Execute pipeline once
```

### slice() → take() / drop()

**Array approach:**
```typescript
const first3 = numbers.slice(0, 3);
const skip2 = numbers.slice(2);
const middle = numbers.slice(2, 5);
```

**IterFlow approach:**
```typescript
const first3 = iter(numbers).take(3).toArray();
const skip2 = iter(numbers).drop(2).toArray();
const middle = iter(numbers).drop(2).take(3).toArray();
```

**Advantage:** With IterFlow, you don't process elements you don't need.

### concat()

**Array approach:**
```typescript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = arr1.concat(arr2);
```

**IterFlow approach:**
```typescript
const combined = iter(arr1)
  .concat(arr2)
  .toArray();

// Or use static method
const combined = iter.chain(arr1, arr2).toArray();
```

## Aggregations and Statistics

### reduce()

**Array approach:**
```typescript
const sum = numbers.reduce((acc, x) => acc + x, 0);
const product = numbers.reduce((acc, x) => acc * x, 1);
```

**IterFlow approach:**
```typescript
const sum = iter(numbers).reduce((acc, x) => acc + x, 0);
const product = iter(numbers).reduce((acc, x) => acc * x, 1);

// Or use built-in methods
const sum = iter(numbers).sum();
const product = iter(numbers).product();
```

### Calculating Sum

**Array approach:**
```typescript
const sum = numbers.reduce((acc, x) => acc + x, 0);
```

**IterFlow approach:**
```typescript
const sum = iter(numbers).sum();
```

### Calculating Average

**Array approach:**
```typescript
const avg = numbers.reduce((acc, x) => acc + x, 0) / numbers.length;
```

**IterFlow approach:**
```typescript
const avg = iter(numbers).mean();
```

### Finding Min/Max

**Array approach:**
```typescript
const min = Math.min(...numbers);
const max = Math.max(...numbers);
```

**IterFlow approach:**
```typescript
const min = iter(numbers).min();
const max = iter(numbers).max();
```

**Advantage:** IterFlow doesn't spread the array, which is more memory efficient for large datasets.

### Counting Elements

**Array approach:**
```typescript
const count = numbers.length;
const evenCount = numbers.filter(x => x % 2 === 0).length;
```

**IterFlow approach:**
```typescript
const count = iter(numbers).count();
const evenCount = iter(numbers)
  .filter(x => x % 2 === 0)
  .count();
```

## Finding and Testing

### find()

**Array approach:**
```typescript
const found = numbers.find(x => x > 5);
```

**IterFlow approach:**
```typescript
const found = iter(numbers).find(x => x > 5);
```

**Advantage:** Same API, but works with any iterable, not just arrays.

### findIndex()

**Array approach:**
```typescript
const index = numbers.findIndex(x => x > 5);
```

**IterFlow approach:**
```typescript
const index = iter(numbers).findIndex(x => x > 5);
```

### some()

**Array approach:**
```typescript
const hasLarge = numbers.some(x => x > 100);
```

**IterFlow approach:**
```typescript
const hasLarge = iter(numbers).some(x => x > 100);
```

### every()

**Array approach:**
```typescript
const allPositive = numbers.every(x => x > 0);
```

**IterFlow approach:**
```typescript
const allPositive = iter(numbers).every(x => x > 0);
```

### includes()

**Array approach:**
```typescript
const hasValue = numbers.includes(42);
```

**IterFlow approach:**
```typescript
const hasValue = iter(numbers).includes(42);
```

## Grouping and Partitioning

### Removing Duplicates

**Array approach:**
```typescript
const unique = [...new Set(numbers)];
```

**IterFlow approach:**
```typescript
const unique = iter(numbers).distinct().toArray();
```

### Removing Duplicates by Key

**Array approach (manual):**
```typescript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' },
];

const uniqueUsers = users.filter(
  (user, index, self) =>
    self.findIndex(u => u.id === user.id) === index
);
```

**IterFlow approach:**
```typescript
const uniqueUsers = iter(users)
  .distinctBy(user => user.id)
  .toArray();
```

### Partitioning

**Array approach (manual):**
```typescript
const evens = numbers.filter(x => x % 2 === 0);
const odds = numbers.filter(x => x % 2 !== 0);
```

**IterFlow approach:**
```typescript
const [evens, odds] = iter(numbers)
  .partition(x => x % 2 === 0);
```

**Advantage:** Only iterates once through the data.

### Grouping

**Array approach (manual):**
```typescript
const grouped = numbers.reduce((acc, x) => {
  const key = x % 3;
  if (!acc[key]) acc[key] = [];
  acc[key].push(x);
  return acc;
}, {} as Record<number, number[]>);
```

**IterFlow approach:**
```typescript
const grouped = iter(numbers).groupBy(x => x % 3);
```

## Advanced Patterns

### Chunking Arrays

**Array approach (manual):**
```typescript
const chunks: number[][] = [];
for (let i = 0; i < numbers.length; i += 3) {
  chunks.push(numbers.slice(i, i + 3));
}
```

**IterFlow approach:**
```typescript
const chunks = iter(numbers).chunk(3).toArray();
```

### Sliding Window

**Array approach (manual):**
```typescript
const windows: number[][] = [];
for (let i = 0; i <= numbers.length - 3; i++) {
  windows.push(numbers.slice(i, i + 3));
}
```

**IterFlow approach:**
```typescript
const windows = iter(numbers).window(3).toArray();
```

### Pairwise Operations

**Array approach (manual):**
```typescript
const pairs: [number, number][] = [];
for (let i = 0; i < numbers.length - 1; i++) {
  pairs.push([numbers[i], numbers[i + 1]]);
}
```

**IterFlow approach:**
```typescript
const pairs = iter(numbers).pairwise().toArray();
```

### Zipping Arrays

**Array approach (manual):**
```typescript
const arr1 = [1, 2, 3];
const arr2 = ['a', 'b', 'c'];
const zipped = arr1.map((x, i) => [x, arr2[i]]);
```

**IterFlow approach:**
```typescript
const zipped = iter.zip(arr1, arr2).toArray();
```

### Interleaving Arrays

**Array approach (manual):**
```typescript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const interleaved: number[] = [];
const maxLen = Math.max(arr1.length, arr2.length);
for (let i = 0; i < maxLen; i++) {
  if (i < arr1.length) interleaved.push(arr1[i]);
  if (i < arr2.length) interleaved.push(arr2[i]);
}
```

**IterFlow approach:**
```typescript
const interleaved = iter.interleave(arr1, arr2).toArray();
```

### Take While

**Array approach (manual):**
```typescript
const result: number[] = [];
for (const x of numbers) {
  if (x < 5) result.push(x);
  else break;
}
```

**IterFlow approach:**
```typescript
const result = iter(numbers).takeWhile(x => x < 5).toArray();
```

### Drop While

**Array approach (manual):**
```typescript
let dropping = true;
const result = numbers.filter(x => {
  if (dropping && x < 5) return false;
  dropping = false;
  return true;
});
```

**IterFlow approach:**
```typescript
const result = iter(numbers).dropWhile(x => x < 5).toArray();
```

## Performance Considerations

### When IterFlow is Faster

**Scenario 1: Early Termination**

```typescript
// Array: processes ALL 1 million elements then takes 10
const hugeArray = Array.from({ length: 1_000_000 }, (_, i) => i);
const first10Evens = hugeArray
  .filter(x => x % 2 === 0)
  .slice(0, 10);

// IterFlow: stops after finding 10 evens
const first10Evens = iter(hugeArray)
  .filter(x => x % 2 === 0)
  .take(10)
  .toArray();
```

**Scenario 2: Multiple Transformations**

```typescript
// Array: creates 3 intermediate arrays
const result = numbers
  .map(x => x * 2)      // Intermediate array 1
  .filter(x => x > 10)  // Intermediate array 2
  .map(x => x + 1);     // Final array

// IterFlow: no intermediate arrays
const result = iter(numbers)
  .map(x => x * 2)
  .filter(x => x > 10)
  .map(x => x + 1)
  .toArray();
```

**Scenario 3: Statistical Operations**

```typescript
// Array: multiple passes through data
const data = [1, 2, 3, 4, 5];
const sum = data.reduce((a, b) => a + b, 0);
const mean = sum / data.length;
const variance = data.reduce((acc, x) =>
  acc + Math.pow(x - mean, 2), 0) / data.length;

// IterFlow: optimized single-pass algorithms
const mean = iter(data).mean();
const variance = iter(data).variance();
```

### When Arrays are Faster

- **Small datasets** (< 100 elements) where overhead dominates
- **Single operation** with no chaining
- **Full materialization** when you need all results anyway

## Migration Strategy

### Step 1: Identify Candidates

Look for:
- Long chains of array operations
- Statistical calculations (sum, average, etc.)
- Processing of large datasets
- Chunking or windowing operations
- Code with manual loops for transformations

### Step 2: Gradual Migration

Start with one module or file:

```typescript
// Before
function processData(data: number[]) {
  return data
    .filter(x => x > 0)
    .map(x => x * 2)
    .slice(0, 10);
}

// After
import { iter } from 'iterflow';

function processData(data: number[]) {
  return iter(data)
    .filter(x => x > 0)
    .map(x => x * 2)
    .take(10)
    .toArray();
}
```

### Step 3: Leverage New Features

Once migrated, enhance with IterFlow-specific features:

```typescript
function analyzeData(data: number[]) {
  return {
    mean: iter(data).mean(),
    median: iter(data).median(),
    stdDev: iter(data).stdDev(),
    quartiles: iter(data).quartiles(),
  };
}
```

### Step 4: Optimize for Performance

Replace manual implementations with built-in operations:

```typescript
// Before
const chunks: number[][] = [];
for (let i = 0; i < data.length; i += batchSize) {
  chunks.push(data.slice(i, i + batchSize));
}

// After
const chunks = iter(data).chunk(batchSize).toArray();
```

## Common Patterns

### Pattern 1: Filter → Map → Reduce

**Before:**
```typescript
const total = users
  .filter(u => u.active)
  .map(u => u.score)
  .reduce((a, b) => a + b, 0);
```

**After:**
```typescript
const total = iter(users)
  .filter(u => u.active)
  .map(u => u.score)
  .sum();
```

### Pattern 2: Map → Filter → Take

**Before:**
```typescript
const results = data
  .map(transform)
  .filter(isValid)
  .slice(0, limit);
```

**After:**
```typescript
const results = iter(data)
  .map(transform)
  .filter(isValid)
  .take(limit)
  .toArray();
```

### Pattern 3: Group By Property

**Before:**
```typescript
const byCategory = data.reduce((acc, item) => {
  const cat = item.category;
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(item);
  return acc;
}, {} as Record<string, typeof data>);
```

**After:**
```typescript
const byCategory = iter(data).groupBy(item => item.category);
```

## Summary

IterFlow provides a more expressive and efficient way to work with data transformations:

- **Lazy evaluation** reduces memory usage
- **Built-in statistical operations** simplify common tasks
- **Windowing operations** make complex patterns easy
- **Type safety** catches errors at compile time
- **Chainable API** improves readability

Start migrating your array-heavy code today and experience the benefits of iterator-based data processing!

## Next Steps

- Read the [Performance Optimization Guide](performance-optimization.md)
- Explore [Common Patterns and Recipes](common-patterns.md)
- Learn about [Working with Infinite Sequences](infinite-sequences.md)
