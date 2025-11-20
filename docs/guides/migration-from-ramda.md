# Migration Guide: From Ramda to iterflow

This guide helps you migrate from Ramda to iterflow, with practical examples and migration strategies for functional programming patterns with iterators.

## Table of Contents

- [Why Migrate?](#why-migrate)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Migration Strategy](#migration-strategy)
- [API Styles Comparison](#api-styles-comparison)
- [Common Patterns](#common-patterns)
- [API Translation Table](#api-translation-table)
- [Composition Patterns](#composition-patterns)
- [Advanced Patterns](#advanced-patterns)
- [Performance Considerations](#performance-considerations)
- [Combining Both Libraries](#combining-both-libraries)
- [Common Pitfalls](#common-pitfalls)

## Why Migrate?

Consider migrating from Ramda to iterflow when you need:

### Benefits of iterflow

✅ **Lazy evaluation** - True lazy computation, not just curried functions
✅ **Memory efficiency** - Process large datasets without loading everything into memory
✅ **Advanced statistics** - Built-in mean, median, variance, percentiles, correlation, etc.
✅ **Windowing operations** - Sliding windows, chunking, pairwise operations
✅ **Infinite sequences** - Naturally work with generators and infinite data streams
✅ **ES2025 ready** - Forward compatible with native iterator helpers
✅ **Iterator-first design** - Optimized for data streaming and pipelines

### When to Keep Ramda

⚠️ **Lens operations** - Ramda's lens system for nested data access
⚠️ **Transducers** - If you heavily use Ramda's transducers
⚠️ **Object utilities** - Deep object manipulation (R.assoc, R.dissoc, R.path, etc.)
⚠️ **Currying everywhere** - If auto-currying is central to your codebase
⚠️ **Point-free style** - Heavy use of R.compose/R.pipe with curried functions
⚠️ **Small datasets** - For very small datasets where currying overhead is negligible

**Recommendation:** Use both together - Ramda for FP utilities and object manipulation, iterflow for data pipelines and statistical operations.

## Installation

```bash
npm install iterflow
```

## Quick Start

### Before (Ramda)
```javascript
import * as R from 'ramda';

const result = R.pipe(
  R.filter(x => x % 2 === 0),
  R.map(x => x * 2),
  R.take(2)
)([1, 2, 3, 4, 5, 6]);
// [4, 8]
```

### After (iterflow - Wrapper API)
```javascript
import { iter } from 'iterflow';

const result = iter([1, 2, 3, 4, 5, 6])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(2)
  .toArray();
// [4, 8]
```

### After (iterflow - Functional API)
```javascript
import { pipe } from 'iterflow/fn';
import { filter, map, take, toArray } from 'iterflow/fn';

const pipeline = pipe(
  filter(x => x % 2 === 0),
  map(x => x * 2),
  take(2),
  toArray
);

const result = pipeline([1, 2, 3, 4, 5, 6]);
// [4, 8]
```

## Migration Strategy

### Phase 1: Identify Candidates

Look for Ramda usage patterns that benefit from iterflow:

1. **List transformations**
   ```javascript
   // Good candidate
   R.pipe(
     R.filter(condition),
     R.map(transform),
     R.take(10)
   )(largeArray)
   ```

2. **Statistical operations**
   ```javascript
   // Good candidate
   R.mean(numbers)
   R.sum(numbers)
   ```

3. **Large dataset processing**
   ```javascript
   // Good candidate
   R.pipe(
     R.map(expensiveOperation),
     R.take(100)
   )(millionItems)
   ```

### Phase 2: Choose Your API Style

iterflow provides both wrapper and functional APIs:

**Wrapper API (Recommended for Migration):**
```javascript
import { iter } from 'iterflow';

iter(data)
  .filter(predicate)
  .map(transform)
  .toArray();
```

**Functional API (More Ramda-like):**
```javascript
import { pipe } from 'iterflow/fn';
import { filter, map, toArray } from 'iterflow/fn';

pipe(
  filter(predicate),
  map(transform),
  toArray
)(data);
```

### Phase 3: Side-by-Side Implementation

Keep Ramda while adding iterflow:

```javascript
import * as R from 'ramda';
import { iter } from 'iterflow';

// Use Ramda for object manipulation
const processRecord = R.pipe(
  R.pick(['id', 'value', 'timestamp']),
  R.evolve({
    value: R.multiply(2),
    timestamp: Date.parse
  })
);

// Use iterflow for data pipeline
const result = iter(records)
  .map(processRecord)
  .filter(x => x.value > 100)
  .mean();
```

## API Styles Comparison

### 1. Ramda Style (Curried, Function-First)

```javascript
import * as R from 'ramda';

const pipeline = R.pipe(
  R.filter(x => x > 0),
  R.map(R.multiply(2)),
  R.sum
);

pipeline([1, -2, 3, -4, 5]); // 18
```

### 2. iterflow Wrapper Style (Method Chaining)

```javascript
import { iter } from 'iterflow';

const pipeline = (data) => iter(data)
  .filter(x => x > 0)
  .map(x => x * 2)
  .sum();

pipeline([1, -2, 3, -4, 5]); // 18
```

### 3. iterflow Functional Style (Similar to Ramda)

```javascript
import { pipe } from 'iterflow/fn';
import { filter, map, sum } from 'iterflow/fn';

const pipeline = pipe(
  filter(x => x > 0),
  map(x => x * 2),
  sum
);

pipeline([1, -2, 3, -4, 5]); // 18
```

## Common Patterns

### 1. Basic Transformations

#### Map

**Before:**
```javascript
R.map(x => x * 2, [1, 2, 3]);
// [2, 4, 6]

// Curried
const double = R.map(x => x * 2);
double([1, 2, 3]); // [2, 4, 6]
```

**After (Wrapper):**
```javascript
iter([1, 2, 3])
  .map(x => x * 2)
  .toArray();
// [2, 4, 6]
```

**After (Functional):**
```javascript
import { map } from 'iterflow/fn';

const double = map(x => x * 2);
// Returns iterator, not array
Array.from(double([1, 2, 3])); // [2, 4, 6]
```

#### Filter

**Before:**
```javascript
R.filter(x => x % 2 === 0, [1, 2, 3, 4]);
// [2, 4]

// Curried
const evens = R.filter(x => x % 2 === 0);
evens([1, 2, 3, 4]); // [2, 4]
```

**After (Wrapper):**
```javascript
iter([1, 2, 3, 4])
  .filter(x => x % 2 === 0)
  .toArray();
// [2, 4]
```

**After (Functional):**
```javascript
import { filter } from 'iterflow/fn';

const evens = filter(x => x % 2 === 0);
Array.from(evens([1, 2, 3, 4])); // [2, 4]
```

#### Reduce

**Before:**
```javascript
R.reduce((acc, x) => acc + x, 0, [1, 2, 3, 4]);
// 10
```

**After (Wrapper):**
```javascript
iter([1, 2, 3, 4])
  .reduce((acc, x) => acc + x, 0);
// 10

// Or use built-in sum
iter([1, 2, 3, 4]).sum();
// 10
```

### 2. Composition

#### pipe (Left-to-Right)

**Before:**
```javascript
const pipeline = R.pipe(
  R.filter(x => x > 0),
  R.map(x => x * 2),
  R.sum
);

pipeline([1, -2, 3, -4, 5]); // 18
```

**After (Wrapper):**
```javascript
const pipeline = (data) => iter(data)
  .filter(x => x > 0)
  .map(x => x * 2)
  .sum();

pipeline([1, -2, 3, -4, 5]); // 18
```

**After (Functional):**
```javascript
import { pipe } from 'iterflow/fn';
import { filter, map, sum } from 'iterflow/fn';

const pipeline = pipe(
  filter(x => x > 0),
  map(x => x * 2),
  sum
);

pipeline([1, -2, 3, -4, 5]); // 18
```

#### compose (Right-to-Left)

**Before:**
```javascript
const pipeline = R.compose(
  R.sum,
  R.map(x => x * 2),
  R.filter(x => x > 0)
);

pipeline([1, -2, 3, -4, 5]); // 18
```

**After (Functional):**
```javascript
import { compose } from 'iterflow/fn';
import { filter, map, sum } from 'iterflow/fn';

const pipeline = compose(
  sum,
  map(x => x * 2),
  filter(x => x > 0)
);

pipeline([1, -2, 3, -4, 5]); // 18
```

### 3. Take and Drop

#### Take

**Before:**
```javascript
R.take(3, [1, 2, 3, 4, 5]);
// [1, 2, 3]
```

**After:**
```javascript
iter([1, 2, 3, 4, 5])
  .take(3)
  .toArray();
// [1, 2, 3]
```

#### Drop

**Before:**
```javascript
R.drop(2, [1, 2, 3, 4, 5]);
// [3, 4, 5]
```

**After:**
```javascript
iter([1, 2, 3, 4, 5])
  .drop(2)
  .toArray();
// [3, 4, 5]
```

#### TakeWhile

**Before:**
```javascript
R.takeWhile(x => x < 4, [1, 2, 3, 4, 1]);
// [1, 2, 3]
```

**After:**
```javascript
iter([1, 2, 3, 4, 1])
  .takeWhile(x => x < 4)
  .toArray();
// [1, 2, 3]
```

#### DropWhile

**Before:**
```javascript
R.dropWhile(x => x < 3, [1, 2, 3, 4, 5]);
// [3, 4, 5]
```

**After:**
```javascript
iter([1, 2, 3, 4, 5])
  .dropWhile(x => x < 3)
  .toArray();
// [3, 4, 5]
```

### 4. Statistical Operations

#### Sum

**Before:**
```javascript
R.sum([1, 2, 3, 4, 5]);
// 15
```

**After:**
```javascript
iter([1, 2, 3, 4, 5]).sum();
// 15
```

#### Mean

**Before:**
```javascript
R.mean([1, 2, 3, 4, 5]);
// 3
```

**After:**
```javascript
iter([1, 2, 3, 4, 5]).mean();
// 3
```

#### Median

**Before:**
```javascript
R.median([1, 2, 3, 4, 5]);
// 3
```

**After:**
```javascript
iter([1, 2, 3, 4, 5]).median();
// 3
```

#### Advanced Statistics (Not in Ramda)

**After (new capabilities):**
```javascript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

iter(data).variance();    // 8.25
iter(data).stdDev();      // ~2.87
iter(data).percentile(75); // 7.75
iter(data).quartiles();   // { Q1: 3.25, Q2: 5.5, Q3: 7.75 }
iter(data).mode();        // [mode value(s)]

// Correlation and covariance
iter([1, 2, 3, 4, 5]).correlation([2, 4, 6, 8, 10]); // 1
iter([1, 2, 3, 4, 5]).covariance([2, 4, 6, 8, 10]);  // 4
```

### 5. Grouping and Partitioning

#### GroupBy

**Before:**
```javascript
R.groupBy(name => name.length, ['alice', 'bob', 'charlie']);
// { '3': ['bob'], '5': ['alice'], '7': ['charlie'] }
```

**After:**
```javascript
iter(['alice', 'bob', 'charlie'])
  .groupBy(name => name.length);
// Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'] }
```

**Note:** iterflow returns Map instead of object. Convert if needed:
```javascript
const groups = iter(['alice', 'bob', 'charlie'])
  .groupBy(name => name.length);
const obj = Object.fromEntries(groups);
```

#### Partition

**Before:**
```javascript
R.partition(x => x % 2 === 0, [1, 2, 3, 4, 5]);
// [[2, 4], [1, 3, 5]]
```

**After:**
```javascript
iter([1, 2, 3, 4, 5])
  .partition(x => x % 2 === 0);
// [[2, 4], [1, 3, 5]]
```

### 6. Set Operations

#### Uniq / Distinct

**Before:**
```javascript
R.uniq([1, 2, 2, 3, 3, 3, 4]);
// [1, 2, 3, 4]
```

**After:**
```javascript
iter([1, 2, 2, 3, 3, 3, 4])
  .distinct()
  .toArray();
// [1, 2, 3, 4]
```

#### UniqBy / DistinctBy

**Before:**
```javascript
R.uniqBy(Math.abs, [-1, -2, 1, 2, 3]);
// [-1, -2, 3]
```

**After:**
```javascript
iter([-1, -2, 1, 2, 3])
  .distinctBy(Math.abs)
  .toArray();
// [-1, -2, 3]
```

### 7. Combining Operations

#### Zip

**Before:**
```javascript
R.zip([1, 2, 3], ['a', 'b', 'c']);
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

**After:**
```javascript
iter.zip([1, 2, 3], ['a', 'b', 'c'])
  .toArray();
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

#### ZipWith

**Before:**
```javascript
R.zipWith((a, b) => a + b, [1, 2, 3], [10, 20, 30]);
// [11, 22, 33]
```

**After:**
```javascript
iter.zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b)
  .toArray();
// [11, 22, 33]
```

#### Concat

**Before:**
```javascript
R.concat([1, 2], [3, 4]);
// [1, 2, 3, 4]
```

**After:**
```javascript
iter([1, 2])
  .concat([3, 4])
  .toArray();
// [1, 2, 3, 4]

// Or chain multiple
iter.chain([1, 2], [3, 4], [5, 6])
  .toArray();
// [1, 2, 3, 4, 5, 6]
```

### 8. Windowing Operations

#### Sliding Window / Aperture

**Before:**
```javascript
R.aperture(3, [1, 2, 3, 4, 5]);
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

**After:**
```javascript
iter([1, 2, 3, 4, 5])
  .window(3)
  .toArray();
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

#### Chunk / SplitEvery

**Before:**
```javascript
R.splitEvery(2, [1, 2, 3, 4, 5]);
// [[1, 2], [3, 4], [5]]
```

**After:**
```javascript
iter([1, 2, 3, 4, 5])
  .chunk(2)
  .toArray();
// [[1, 2], [3, 4], [5]]
```

#### Pairwise

**Before:**
```javascript
R.aperture(2, [1, 2, 3, 4]);
// [[1, 2], [2, 3], [3, 4]]
```

**After:**
```javascript
iter([1, 2, 3, 4])
  .pairwise()
  .toArray();
// [[1, 2], [2, 3], [3, 4]]
```

### 9. Finding and Searching

#### Find

**Before:**
```javascript
R.find(x => x > 2, [1, 2, 3, 4]);
// 3
```

**After:**
```javascript
iter([1, 2, 3, 4])
  .find(x => x > 2);
// 3
```

#### FindIndex

**Before:**
```javascript
R.findIndex(x => x > 2, [1, 2, 3, 4]);
// 2
```

**After:**
```javascript
iter([1, 2, 3, 4])
  .findIndex(x => x > 2);
// 2
```

#### Any / Some

**Before:**
```javascript
R.any(x => x > 3, [1, 2, 3, 4]);
// true
```

**After:**
```javascript
iter([1, 2, 3, 4])
  .some(x => x > 3);
// true
```

#### All / Every

**Before:**
```javascript
R.all(x => x > 0, [1, 2, 3, 4]);
// true
```

**After:**
```javascript
iter([1, 2, 3, 4])
  .every(x => x > 0);
// true
```

### 10. FlatMap / Chain

**Before:**
```javascript
R.chain(x => [x, x * 2], [1, 2, 3]);
// [1, 2, 2, 4, 3, 6]
```

**After:**
```javascript
iter([1, 2, 3])
  .flatMap(x => [x, x * 2])
  .toArray();
// [1, 2, 2, 4, 3, 6]
```

### 11. Scan

**Before:**
```javascript
R.scan((acc, x) => acc + x, 0, [1, 2, 3, 4]);
// [0, 1, 3, 6, 10]
```

**After:**
```javascript
iter([1, 2, 3, 4])
  .scan((acc, x) => acc + x, 0)
  .toArray();
// [0, 1, 3, 6, 10]
```

### 12. Range

**Before:**
```javascript
R.range(0, 5);
// [0, 1, 2, 3, 4]

R.range(2, 5);
// [2, 3, 4]
```

**After:**
```javascript
iter.range(5).toArray();
// [0, 1, 2, 3, 4]

iter.range(2, 5).toArray();
// [2, 3, 4]

iter.range(0, 10, 2).toArray();
// [0, 2, 4, 6, 8]
```

### 13. Repeat

**Before:**
```javascript
R.repeat('x', 3);
// ['x', 'x', 'x']
```

**After:**
```javascript
iter.repeat('x', 3).toArray();
// ['x', 'x', 'x']

// Infinite repeat
iter.repeat(0).take(5).toArray();
// [0, 0, 0, 0, 0]
```

### 14. Reverse

**Before:**
```javascript
R.reverse([1, 2, 3, 4, 5]);
// [5, 4, 3, 2, 1]
```

**After:**
```javascript
iter([1, 2, 3, 4, 5])
  .reverse()
  .toArray();
// [5, 4, 3, 2, 1]
```

### 15. Sort

**Before:**
```javascript
R.sort((a, b) => a - b, [3, 1, 4, 1, 5]);
// [1, 1, 3, 4, 5]
```

**After:**
```javascript
iter([3, 1, 4, 1, 5])
  .sort()
  .toArray();
// [1, 1, 3, 4, 5]

// Custom comparator
iter([3, 1, 4, 1, 5])
  .sortBy((a, b) => b - a)
  .toArray();
// [5, 4, 3, 1, 1]
```

## API Translation Table

| Ramda | iterflow (Wrapper) | iterflow (Functional) |
|-------|-------------------|----------------------|
| `R.map(fn, arr)` | `iter(arr).map(fn).toArray()` | `map(fn)(arr)` |
| `R.filter(fn, arr)` | `iter(arr).filter(fn).toArray()` | `filter(fn)(arr)` |
| `R.reduce(fn, init, arr)` | `iter(arr).reduce(fn, init)` | `reduce(fn, init)(arr)` |
| `R.find(fn, arr)` | `iter(arr).find(fn)` | `find(fn)(arr)` |
| `R.findIndex(fn, arr)` | `iter(arr).findIndex(fn)` | `findIndex(fn)(arr)` |
| `R.any(fn, arr)` | `iter(arr).some(fn)` | `some(fn)(arr)` |
| `R.all(fn, arr)` | `iter(arr).every(fn)` | `every(fn)(arr)` |
| `R.take(n, arr)` | `iter(arr).take(n).toArray()` | `take(n)(arr)` |
| `R.drop(n, arr)` | `iter(arr).drop(n).toArray()` | `drop(n)(arr)` |
| `R.takeWhile(fn, arr)` | `iter(arr).takeWhile(fn).toArray()` | `takeWhile(fn)(arr)` |
| `R.dropWhile(fn, arr)` | `iter(arr).dropWhile(fn).toArray()` | `dropWhile(fn)(arr)` |
| `R.chain(fn, arr)` | `iter(arr).flatMap(fn).toArray()` | `flatMap(fn)(arr)` |
| `R.uniq(arr)` | `iter(arr).distinct().toArray()` | `distinct()(arr)` |
| `R.uniqBy(fn, arr)` | `iter(arr).distinctBy(fn).toArray()` | `distinctBy(fn)(arr)` |
| `R.groupBy(fn, arr)` | `iter(arr).groupBy(fn)` | `groupBy(fn)(arr)` |
| `R.partition(fn, arr)` | `iter(arr).partition(fn)` | `partition(fn)(arr)` |
| `R.zip(a, b)` | `iter.zip(a, b).toArray()` | `zip(a, b)` |
| `R.zipWith(fn, a, b)` | `iter.zipWith(a, b, fn).toArray()` | `zipWith(a, b, fn)` |
| `R.concat(a, b)` | `iter(a).concat(b).toArray()` | `concat(a, b)` |
| `R.reverse(arr)` | `iter(arr).reverse().toArray()` | `reverse()(arr)` |
| `R.sort(fn, arr)` | `iter(arr).sortBy(fn).toArray()` | `sortBy(fn)(arr)` |
| `R.sum(arr)` | `iter(arr).sum()` | `sum()(arr)` |
| `R.mean(arr)` | `iter(arr).mean()` | `mean()(arr)` |
| `R.median(arr)` | `iter(arr).median()` | `median()(arr)` |
| `R.range(a, b)` | `iter.range(a, b).toArray()` | `range(a, b)` |
| `R.repeat(val, n)` | `iter.repeat(val, n).toArray()` | `repeat(val, n)` |
| `R.scan(fn, init, arr)` | `iter(arr).scan(fn, init).toArray()` | `scan(fn, init)(arr)` |
| `R.aperture(n, arr)` | `iter(arr).window(n).toArray()` | `window(n)(arr)` |
| `R.splitEvery(n, arr)` | `iter(arr).chunk(n).toArray()` | `chunk(n)(arr)` |

## Composition Patterns

### 1. Point-Free Style

**Before (Ramda):**
```javascript
const processNumbers = R.pipe(
  R.filter(R.gt(R.__, 0)),
  R.map(R.multiply(2)),
  R.sum
);

processNumbers([1, -2, 3, -4, 5]); // 18
```

**After (iterflow Functional):**
```javascript
import { pipe } from 'iterflow/fn';
import { filter, map, sum } from 'iterflow/fn';

const processNumbers = pipe(
  filter(x => x > 0),
  map(x => x * 2),
  sum
);

processNumbers([1, -2, 3, -4, 5]); // 18
```

### 2. Curried Transformations

**Before (Ramda):**
```javascript
const filterPositive = R.filter(R.gt(R.__, 0));
const doubleAll = R.map(R.multiply(2));

const result = R.pipe(
  filterPositive,
  doubleAll,
  R.sum
)(data);
```

**After (iterflow Functional):**
```javascript
import { filter, map, sum } from 'iterflow/fn';
import { pipe } from 'iterflow/fn';

const filterPositive = filter(x => x > 0);
const doubleAll = map(x => x * 2);

const result = pipe(
  filterPositive,
  doubleAll,
  sum
)(data);
```

### 3. Reusable Pipelines

**Before (Ramda):**
```javascript
const summarizeData = R.pipe(
  R.filter(R.propSatisfies(R.gt(R.__, 100), 'value')),
  R.map(R.prop('value')),
  values => ({
    count: values.length,
    total: R.sum(values),
    avg: R.mean(values)
  })
);
```

**After (iterflow):**
```javascript
const summarizeData = (data) => {
  const values = iter(data)
    .filter(x => x.value > 100)
    .map(x => x.value);

  return {
    count: values.count(),
    total: values.sum(),
    avg: values.mean(),
    median: values.median(),  // Bonus!
    stdDev: values.stdDev()   // Bonus!
  };
};
```

## Advanced Patterns

### 1. Complex Data Pipeline

**Before (Ramda):**
```javascript
const analyzeData = R.pipe(
  R.filter(R.propSatisfies(R.gt(R.__, 100), 'amount')),
  R.groupBy(R.prop('category')),
  R.map(R.pipe(
    R.pluck('amount'),
    amounts => ({
      count: amounts.length,
      total: R.sum(amounts),
      avg: R.mean(amounts)
    })
  ))
);
```

**After (iterflow):**
```javascript
const analyzeData = (data) => {
  const groups = iter(data)
    .filter(x => x.amount > 100)
    .groupBy(x => x.category);

  const result = new Map();
  for (const [category, items] of groups) {
    const amounts = iter(items).map(x => x.amount);
    result.set(category, {
      count: items.length,
      total: amounts.sum(),
      avg: amounts.mean(),
      median: amounts.median(),
      stdDev: amounts.stdDev()
    });
  }
  return result;
};
```

### 2. Moving Average (Time Series)

**Before (Ramda - manual):**
```javascript
const movingAverage = (windowSize) => (data) => {
  return R.pipe(
    R.aperture(windowSize),
    R.map(R.mean)
  )(data);
};

const avgTemps = movingAverage(3)(temperatures);
```

**After (iterflow):**
```javascript
const movingAverage = (windowSize) => (data) =>
  iter(data)
    .window(windowSize)
    .map(window => iter(window).mean())
    .toArray();

const avgTemps = movingAverage(3)(temperatures);
```

### 3. Infinite Sequences

**Before (Ramda - limited support):**
```javascript
// Ramda doesn't handle infinite sequences well
```

**After (iterflow):**
```javascript
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// First 10 even Fibonacci numbers
const evenFibs = iter(fibonacci())
  .filter(x => x % 2 === 0)
  .take(10)
  .toArray();
// [0, 2, 8, 34, 144, 610, 2584, 10946, 46368, 196418]
```

### 4. Statistical Analysis

**Before (Ramda):**
```javascript
const analyzeScores = (scores) => {
  const sorted = R.sort(R.subtract, scores);
  const mid = Math.floor(sorted.length / 2);

  return {
    mean: R.mean(scores),
    median: sorted[mid],
    min: R.reduce(R.min, Infinity, scores),
    max: R.reduce(R.max, -Infinity, scores)
  };
};
```

**After (iterflow):**
```javascript
const analyzeScores = (scores) => ({
  mean: iter(scores).mean(),
  median: iter(scores).median(),
  min: iter(scores).min(),
  max: iter(scores).max(),
  variance: iter(scores).variance(),
  stdDev: iter(scores).stdDev(),
  quartiles: iter(scores).quartiles()
});
```

## Performance Considerations

### Lazy Evaluation

**Ramda:**
```javascript
// Ramda is mostly eager
const result = R.pipe(
  R.filter(condition),
  R.map(expensiveOperation),
  R.take(5)
)(largeArray);
// Filters all, maps all, then takes 5
```

**iterflow:**
```javascript
// Truly lazy
const result = iter(largeArray)
  .filter(condition)
  .map(expensiveOperation)
  .take(5)
  .toArray();
// Only processes first 5 items that pass filter
```

### Memory Efficiency

**Ramda:**
```javascript
// Creates intermediate arrays
const result = R.pipe(
  R.filter(condition1),
  R.map(transform1),
  R.filter(condition2),
  R.map(transform2)
)(millionItems);
// O(n) memory at each step
```

**iterflow:**
```javascript
// Streams without intermediate arrays
const result = iter(millionItems)
  .filter(condition1)
  .map(transform1)
  .filter(condition2)
  .map(transform2)
  .toArray();
// O(1) memory during iteration
```

## Combining Both Libraries

Ramda and iterflow work well together:

```javascript
import * as R from 'ramda';
import { iter } from 'iterflow';

// Use Ramda for object/function utilities
const processRecord = R.pipe(
  R.pick(['id', 'value', 'timestamp']),
  R.evolve({
    value: R.multiply(2),
    timestamp: Date.parse
  })
);

// Use iterflow for data pipeline
const result = iter(records)
  .map(processRecord)           // Ramda processing
  .filter(x => x.value > 100)   // iterflow filtering
  .window(5)                    // iterflow windowing
  .map(window =>
    iter(window)
      .map(R.prop('value'))     // Ramda property access
      .mean()                   // iterflow statistics
  )
  .toArray();
```

## Common Pitfalls

### 1. Forgetting .toArray()

**Wrong:**
```javascript
const result = iter([1, 2, 3]).map(x => x * 2);
console.log(result); // IterFlow object, not [2, 4, 6]
```

**Correct:**
```javascript
const result = iter([1, 2, 3]).map(x => x * 2).toArray();
console.log(result); // [2, 4, 6]
```

### 2. Auto-Currying Differences

**Ramda (auto-curried):**
```javascript
const filterEvens = R.filter(x => x % 2 === 0);
filterEvens([1, 2, 3, 4]); // [2, 4]
```

**iterflow (not auto-curried):**
```javascript
// Functional API returns function
import { filter } from 'iterflow/fn';
const filterEvens = filter(x => x % 2 === 0);
// filterEvens returns iterator, not array
Array.from(filterEvens([1, 2, 3, 4])); // [2, 4]

// Wrapper API needs full data
const filterEvens = (data) => iter(data)
  .filter(x => x % 2 === 0)
  .toArray();
filterEvens([1, 2, 3, 4]); // [2, 4]
```

### 3. Map vs Object from groupBy

**Ramda (returns object):**
```javascript
const groups = R.groupBy(R.prop('category'), items);
groups.electronics; // Works
```

**iterflow (returns Map):**
```javascript
const groups = iter(items).groupBy(item => item.category);
groups.get('electronics'); // Correct

// Convert to object if needed
const obj = Object.fromEntries(groups);
obj.electronics; // Works
```

### 4. Reusing Iterators

**Wrong:**
```javascript
const numbers = iter([1, 2, 3, 4, 5]);
const sum = numbers.sum();     // 15
const mean = numbers.mean();   // undefined - exhausted!
```

**Correct:**
```javascript
const data = [1, 2, 3, 4, 5];
const sum = iter(data).sum();   // 15
const mean = iter(data).mean(); // 3
```

## Summary

### Quick Migration Checklist

- [ ] Install iterflow: `npm install iterflow`
- [ ] Choose API style: wrapper (recommended) or functional
- [ ] Replace Ramda list operations with iterflow
- [ ] Add `.toArray()` where needed
- [ ] Update `R.uniq` to `distinct()`
- [ ] Remember `groupBy()` returns Map
- [ ] Leverage new statistical operations
- [ ] Keep Ramda for object/lens utilities
- [ ] Test lazy evaluation benefits
- [ ] Update TypeScript types if needed

### Key Takeaways

✅ **Lazy evaluation** - True streaming, not just currying
✅ **Memory efficiency** - Process large datasets efficiently
✅ **Advanced statistics** - Rich statistical operations
✅ **Infinite sequences** - Natural support for generators
✅ **ES2025 ready** - Forward-compatible design

⚠️ **Not auto-curried** - Different from Ramda's default
⚠️ **Remember** `.toArray()` for array results
⚠️ **Don't reuse** exhausted iterators
⚠️ **Keep Ramda** for lenses, object utilities, transducers

### When to Use Each

**Use Ramda for:**
- Lens operations
- Complex object manipulation
- Transducers
- Point-free style with currying
- Small datasets

**Use iterflow for:**
- Data pipelines
- Statistical analysis
- Large datasets
- Memory efficiency
- Infinite sequences
- Windowing operations

**Use both together:**
- Ramda for FP utilities
- iterflow for data processing

For more information, see:
- [API Documentation](../api.md)
- [Comparison with Ramda](../comparisons/ramda.md)
- [Getting Started Guide](./getting-started.md)
- [Functional API Documentation](../../src/fn/index.ts)
