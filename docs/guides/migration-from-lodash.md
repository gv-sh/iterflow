# Migration Guide: From Lodash to iterflow

This guide helps you migrate from lodash to iterflow, with practical examples and migration strategies for common use cases.

## Table of Contents

- [Why Migrate?](#why-migrate)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Migration Strategy](#migration-strategy)
- [Common Patterns](#common-patterns)
- [API Translation Table](#api-translation-table)
- [Advanced Patterns](#advanced-patterns)
- [Performance Considerations](#performance-considerations)
- [Incremental Migration](#incremental-migration)
- [Common Pitfalls](#common-pitfalls)

## Why Migrate?

Consider migrating from lodash to iterflow when you need:

### Benefits of iterflow

✅ **Memory efficiency** - Process large datasets without loading everything into memory
✅ **Lazy evaluation** - Only compute what you need, when you need it
✅ **Advanced statistics** - Built-in mean, median, variance, percentiles, correlation, etc.
✅ **Infinite sequences** - Work with generators and infinite data streams
✅ **Windowing operations** - Sliding windows, chunking, pairwise operations
✅ **ES2025 ready** - Forward compatible with native iterator helpers
✅ **Type safety** - Excellent TypeScript support with intelligent type inference

### When to Keep lodash

⚠️ **Object utilities** - lodash has comprehensive object manipulation (_.pick, _.omit, _.merge, etc.)
⚠️ **String utilities** - String manipulation functions (_.camelCase, _.kebabCase, etc.)
⚠️ **Small arrays** - For very small datasets (< 100 items), lodash may be slightly faster
⚠️ **Deep cloning** - If you heavily use _.cloneDeep
⚠️ **Existing codebase** - Large codebases with heavy lodash usage may not benefit from full migration

**Recommendation:** Use both together - lodash for object/string utilities, iterflow for data pipelines and statistical operations.

## Installation

```bash
npm install iterflow
```

## Quick Start

### Before (lodash)
```javascript
import _ from 'lodash';

const result = _.chain([1, 2, 3, 4, 5, 6])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(2)
  .value();
// [4, 8]
```

### After (iterflow)
```javascript
import { iter } from 'iterflow';

const result = iter([1, 2, 3, 4, 5, 6])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(2)
  .toArray();
// [4, 8]
```

**Key Change:** Replace `.value()` with `.toArray()`

## Migration Strategy

### Phase 1: Identify Candidates

Look for lodash usage patterns that benefit from iterflow:

1. **Array transformations with multiple steps**
   ```javascript
   // Good candidate
   _.map(_.filter(_.map(data, transform1), predicate), transform2)
   ```

2. **Statistical operations**
   ```javascript
   // Good candidate
   _.mean(numbers)
   _.sum(numbers)
   _.max(numbers)
   ```

3. **Large dataset processing**
   ```javascript
   // Good candidate
   _.take(_.map(millionItems, expensiveOperation), 10)
   ```

4. **Windowing/chunking operations**
   ```javascript
   // Good candidate
   _.chunk(data, 5)
   ```

### Phase 2: Side-by-Side Implementation

Keep lodash while adding iterflow:

```javascript
import _ from 'lodash';
import { iter } from 'iterflow';

// Use lodash for object manipulation
const processedData = _.pick(rawData, ['id', 'value', 'timestamp']);

// Use iterflow for data pipeline
const result = iter(processedData)
  .filter(x => x.value > 100)
  .map(x => x.value * 2)
  .mean();
```

### Phase 3: Gradual Replacement

Replace lodash calls module by module:

```javascript
// Before
// import _ from 'lodash';
import { iter } from 'iterflow';

// Replace lodash array operations
// const result = _.map(data, transform);
const result = iter(data).map(transform).toArray();

// Keep lodash for utilities
// Keep using: _.cloneDeep, _.merge, _.pick, _.omit, etc.
```

## Common Patterns

### 1. Basic Transformations

#### Map

**Before:**
```javascript
_.map([1, 2, 3], x => x * 2);
// [2, 4, 6]
```

**After:**
```javascript
iter([1, 2, 3])
  .map(x => x * 2)
  .toArray();
// [2, 4, 6]
```

#### Filter

**Before:**
```javascript
_.filter([1, 2, 3, 4], x => x % 2 === 0);
// [2, 4]
```

**After:**
```javascript
iter([1, 2, 3, 4])
  .filter(x => x % 2 === 0)
  .toArray();
// [2, 4]
```

#### Reduce

**Before:**
```javascript
_.reduce([1, 2, 3, 4], (acc, x) => acc + x, 0);
// 10
```

**After:**
```javascript
iter([1, 2, 3, 4])
  .reduce((acc, x) => acc + x, 0);
// 10

// Or use built-in sum
iter([1, 2, 3, 4]).sum();
// 10
```

### 2. Chaining Operations

#### Chain

**Before:**
```javascript
_.chain([1, 2, 3, 4, 5, 6])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(2)
  .value();
// [4, 8]
```

**After:**
```javascript
iter([1, 2, 3, 4, 5, 6])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(2)
  .toArray();
// [4, 8]
```

**Note:** iterflow is lazy by default, no need for explicit chaining wrapper.

### 3. Statistical Operations

#### Sum

**Before:**
```javascript
_.sum([1, 2, 3, 4, 5]);
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
_.mean([1, 2, 3, 4, 5]);
// 3
```

**After:**
```javascript
iter([1, 2, 3, 4, 5]).mean();
// 3
```

#### Min/Max

**Before:**
```javascript
_.min([3, 1, 4, 1, 5]); // 1
_.max([3, 1, 4, 1, 5]); // 5
```

**After:**
```javascript
iter([3, 1, 4, 1, 5]).min(); // 1
iter([3, 1, 4, 1, 5]).max(); // 5
```

#### Advanced Statistics (Not in lodash)

**After (new capabilities):**
```javascript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

iter(data).median();      // 5.5
iter(data).variance();    // 8.25
iter(data).stdDev();      // ~2.87
iter(data).percentile(75); // 7.75
iter(data).quartiles();   // { Q1: 3.25, Q2: 5.5, Q3: 7.75 }

iter([1, 2, 2, 3, 3, 3]).mode(); // [3]

// Correlation and covariance
iter([1, 2, 3, 4, 5]).correlation([2, 4, 6, 8, 10]); // 1
iter([1, 2, 3, 4, 5]).covariance([2, 4, 6, 8, 10]);  // 4
```

### 4. Take and Drop

#### Take

**Before:**
```javascript
_.take([1, 2, 3, 4, 5], 3);
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
_.drop([1, 2, 3, 4, 5], 2);
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
_.takeWhile([1, 2, 3, 4, 1], x => x < 4);
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
_.dropWhile([1, 2, 3, 4, 5], x => x < 3);
// [3, 4, 5]
```

**After:**
```javascript
iter([1, 2, 3, 4, 5])
  .dropWhile(x => x < 3)
  .toArray();
// [3, 4, 5]
```

### 5. Searching

#### Find

**Before:**
```javascript
_.find([1, 2, 3, 4], x => x > 2);
// 3
```

**After:**
```javascript
iter([1, 2, 3, 4])
  .find(x => x > 2);
// 3
```

#### Some

**Before:**
```javascript
_.some([1, 2, 3, 4], x => x > 3);
// true
```

**After:**
```javascript
iter([1, 2, 3, 4])
  .some(x => x > 3);
// true
```

#### Every

**Before:**
```javascript
_.every([2, 4, 6], x => x % 2 === 0);
// true
```

**After:**
```javascript
iter([2, 4, 6])
  .every(x => x % 2 === 0);
// true
```

### 6. Grouping and Partitioning

#### GroupBy

**Before:**
```javascript
_.groupBy(['alice', 'bob', 'charlie'], name => name.length);
// { '3': ['bob'], '5': ['alice'], '7': ['charlie'] }
```

**After:**
```javascript
iter(['alice', 'bob', 'charlie'])
  .groupBy(name => name.length);
// Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'] }
```

**Note:** iterflow returns a Map instead of a plain object. Convert if needed:
```javascript
const map = iter(['alice', 'bob', 'charlie'])
  .groupBy(name => name.length);
const obj = Object.fromEntries(map);
```

#### Partition

**Before:**
```javascript
_.partition([1, 2, 3, 4, 5], x => x % 2 === 0);
// [[2, 4], [1, 3, 5]]
```

**After:**
```javascript
iter([1, 2, 3, 4, 5])
  .partition(x => x % 2 === 0);
// [[2, 4], [1, 3, 5]]
```

### 7. Unique/Distinct

#### Uniq

**Before:**
```javascript
_.uniq([1, 2, 2, 3, 3, 3, 4]);
// [1, 2, 3, 4]
```

**After:**
```javascript
iter([1, 2, 2, 3, 3, 3, 4])
  .distinct()
  .toArray();
// [1, 2, 3, 4]
```

#### UniqBy

**Before:**
```javascript
_.uniqBy([{id: 1}, {id: 2}, {id: 1}], 'id');
// [{id: 1}, {id: 2}]

// Or with function
_.uniqBy([{id: 1}, {id: 2}, {id: 1}], obj => obj.id);
// [{id: 1}, {id: 2}]
```

**After:**
```javascript
iter([{id: 1}, {id: 2}, {id: 1}])
  .distinctBy(obj => obj.id)
  .toArray();
// [{id: 1}, {id: 2}]
```

### 8. Combining Operations

#### Zip

**Before:**
```javascript
_.zip([1, 2, 3], ['a', 'b', 'c']);
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
_.zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b);
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
_.concat([1, 2], [3, 4], [5, 6]);
// [1, 2, 3, 4, 5, 6]
```

**After:**
```javascript
// Using instance method
iter([1, 2])
  .concat([3, 4], [5, 6])
  .toArray();
// [1, 2, 3, 4, 5, 6]

// Using static method
iter.chain([1, 2], [3, 4], [5, 6])
  .toArray();
// [1, 2, 3, 4, 5, 6]
```

### 9. Windowing Operations

#### Chunk

**Before:**
```javascript
_.chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]
```

**After:**
```javascript
iter([1, 2, 3, 4, 5])
  .chunk(2)
  .toArray();
// [[1, 2], [3, 4], [5]]
```

#### Sliding Window (Not in lodash)

**After (new capability):**
```javascript
iter([1, 2, 3, 4, 5])
  .window(3)
  .toArray();
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

#### Pairwise (Not in lodash)

**After (new capability):**
```javascript
iter([1, 2, 3, 4])
  .pairwise()
  .toArray();
// [[1, 2], [2, 3], [3, 4]]
```

### 10. Sorting

#### SortBy

**Before:**
```javascript
_.sortBy([3, 1, 4, 1, 5]);
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
  .sortBy((a, b) => b - a)  // descending
  .toArray();
// [5, 4, 3, 1, 1]
```

#### Reverse

**Before:**
```javascript
_.reverse([1, 2, 3, 4, 5]);
// [5, 4, 3, 2, 1]
// ⚠️ Mutates the original array
```

**After:**
```javascript
iter([1, 2, 3, 4, 5])
  .reverse()
  .toArray();
// [5, 4, 3, 2, 1]
// ✓ Original array unchanged
```

### 11. FlatMap

**Before:**
```javascript
_.flatMap([1, 2, 3], x => [x, x * 2]);
// [1, 2, 2, 4, 3, 6]
```

**After:**
```javascript
iter([1, 2, 3])
  .flatMap(x => [x, x * 2])
  .toArray();
// [1, 2, 2, 4, 3, 6]
```

### 12. Range

**Before:**
```javascript
_.range(5);        // [0, 1, 2, 3, 4]
_.range(2, 5);     // [2, 3, 4]
_.range(0, 10, 2); // [0, 2, 4, 6, 8]
```

**After:**
```javascript
iter.range(5).toArray();        // [0, 1, 2, 3, 4]
iter.range(2, 5).toArray();     // [2, 3, 4]
iter.range(0, 10, 2).toArray(); // [0, 2, 4, 6, 8]
```

## API Translation Table

| Lodash | iterflow | Notes |
|--------|----------|-------|
| `_.map(arr, fn)` | `iter(arr).map(fn).toArray()` | Lazy in iterflow |
| `_.filter(arr, fn)` | `iter(arr).filter(fn).toArray()` | Lazy in iterflow |
| `_.reduce(arr, fn, init)` | `iter(arr).reduce(fn, init)` | Same API |
| `_.find(arr, fn)` | `iter(arr).find(fn)` | Same API |
| `_.findIndex(arr, fn)` | `iter(arr).findIndex(fn)` | Same API |
| `_.some(arr, fn)` | `iter(arr).some(fn)` | Same API |
| `_.every(arr, fn)` | `iter(arr).every(fn)` | Same API |
| `_.includes(arr, val)` | `iter(arr).includes(val)` | Same API |
| `_.take(arr, n)` | `iter(arr).take(n).toArray()` | Lazy in iterflow |
| `_.drop(arr, n)` | `iter(arr).drop(n).toArray()` | Lazy in iterflow |
| `_.takeWhile(arr, fn)` | `iter(arr).takeWhile(fn).toArray()` | Lazy in iterflow |
| `_.dropWhile(arr, fn)` | `iter(arr).dropWhile(fn).toArray()` | Lazy in iterflow |
| `_.flatMap(arr, fn)` | `iter(arr).flatMap(fn).toArray()` | Lazy in iterflow |
| `_.chunk(arr, n)` | `iter(arr).chunk(n).toArray()` | Lazy in iterflow |
| `_.uniq(arr)` | `iter(arr).distinct().toArray()` | Different name |
| `_.uniqBy(arr, fn)` | `iter(arr).distinctBy(fn).toArray()` | Different name |
| `_.groupBy(arr, fn)` | `iter(arr).groupBy(fn)` | Returns Map, not object |
| `_.partition(arr, fn)` | `iter(arr).partition(fn)` | Same API |
| `_.zip(a, b)` | `iter.zip(a, b).toArray()` | Static method |
| `_.zipWith(a, b, fn)` | `iter.zipWith(a, b, fn).toArray()` | Static method |
| `_.concat(a, b, c)` | `iter.chain(a, b, c).toArray()` | Different name |
| `_.reverse(arr)` | `iter(arr).reverse().toArray()` | Doesn't mutate |
| `_.sortBy(arr)` | `iter(arr).sort().toArray()` | Different name |
| `_.sum(arr)` | `iter(arr).sum()` | Same API |
| `_.mean(arr)` | `iter(arr).mean()` | Same API |
| `_.min(arr)` | `iter(arr).min()` | Same API |
| `_.max(arr)` | `iter(arr).max()` | Same API |
| `_.size(arr)` | `iter(arr).count()` | Different name |
| `_.range(n)` | `iter.range(n).toArray()` | Static method |
| `_.times(n, fn)` | `iter.range(n).map(fn).toArray()` | Different approach |

## Advanced Patterns

### 1. Complex Data Pipeline

**Before:**
```javascript
const result = _.chain(salesData)
  .filter(sale => sale.amount > 100)
  .map(sale => ({
    ...sale,
    profit: sale.amount * 0.2
  }))
  .groupBy('category')
  .mapValues(sales => ({
    count: sales.length,
    total: _.sumBy(sales, 'amount'),
    avgProfit: _.meanBy(sales, 'profit')
  }))
  .value();
```

**After:**
```javascript
const byCategory = iter(salesData)
  .filter(sale => sale.amount > 100)
  .map(sale => ({
    ...sale,
    profit: sale.amount * 0.2
  }))
  .groupBy(sale => sale.category);

const result = new Map();
for (const [category, sales] of byCategory) {
  result.set(category, {
    count: sales.length,
    total: iter(sales).map(s => s.amount).sum(),
    avgProfit: iter(sales).map(s => s.profit).mean()
  });
}
```

### 2. Moving Average (Time Series)

**Before:**
```javascript
// Manual implementation needed
function movingAverage(data, windowSize) {
  const result = [];
  for (let i = 0; i <= data.length - windowSize; i++) {
    const window = data.slice(i, i + windowSize);
    result.push(_.mean(window));
  }
  return result;
}

const avgTemps = movingAverage(temperatures, 3);
```

**After:**
```javascript
const avgTemps = iter(temperatures)
  .window(3)
  .map(window => iter(window).mean())
  .toArray();
```

### 3. Early Termination with Large Datasets

**Before:**
```javascript
// Processes ALL items through map, then finds first
const result = _.find(
  _.map(millionItems, expensiveOperation),
  condition
);
```

**After:**
```javascript
// Only processes items until condition is met
const result = iter(millionItems)
  .map(expensiveOperation)
  .find(condition);
```

### 4. Statistical Analysis Pipeline

**Before:**
```javascript
const filtered = _.filter(data, x => x > threshold);
const avg = _.mean(filtered);
const sorted = _.sortBy(filtered);
const median = sorted[Math.floor(sorted.length / 2)];
const min = _.min(filtered);
const max = _.max(filtered);
```

**After:**
```javascript
const filtered = iter(data)
  .filter(x => x > threshold);

const stats = {
  avg: filtered.mean(),
  median: filtered.median(),
  min: filtered.min(),
  max: filtered.max(),
  stdDev: filtered.stdDev(),
  quartiles: filtered.quartiles()
};
```

### 5. Infinite Sequences

**Before:**
```javascript
// Not possible with lodash
// _.take(infiniteGenerator(), 10) // Won't work
```

**After:**
```javascript
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const first10Fibs = iter(fibonacci())
  .take(10)
  .toArray();
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## Performance Considerations

### When iterflow is Faster

1. **Early termination scenarios**
   ```javascript
   // iterflow: Only processes first 10 even numbers
   iter(hugeArray)
     .filter(x => x % 2 === 0)
     .take(10)
     .toArray();

   // lodash: Filters entire array first
   _.take(_.filter(hugeArray, x => x % 2 === 0), 10);
   ```

2. **Large pipelines**
   ```javascript
   // iterflow: Single pass through data
   iter(largeArray)
     .filter(condition1)
     .map(transform1)
     .filter(condition2)
     .map(transform2)
     .toArray();

   // lodash: Multiple passes, intermediate arrays
   _.map(
     _.filter(
       _.map(
         _.filter(largeArray, condition1),
         transform1
       ),
       condition2
     ),
     transform2
   );
   ```

3. **Memory-constrained environments**
   ```javascript
   // iterflow: O(1) memory during iteration
   iter(millionItems)
     .filter(condition)
     .map(transform)
     .take(100)
     .toArray();
   // Total memory: O(100)

   // lodash: O(n) intermediate arrays
   _.take(
     _.map(
       _.filter(millionItems, condition),
       transform
     ),
     100
   );
   // Total memory: O(n) during processing
   ```

### When lodash May Be Faster

1. **Small arrays (< 100 items)**
   ```javascript
   // For small arrays, lodash's direct approach may be faster
   _.map([1, 2, 3, 4, 5], x => x * 2);
   ```

2. **Full materialization needed**
   ```javascript
   // When you need all results anyway
   _.map(smallArray, transform);
   ```

## Incremental Migration

### Step 1: Add iterflow Alongside lodash

```javascript
// package.json
{
  "dependencies": {
    "lodash": "^4.17.21",
    "iterflow": "^0.1.0"
  }
}
```

### Step 2: Identify High-Value Targets

Start with:
- Large array operations
- Statistical computations
- Pipeline-heavy code
- Performance-critical sections

### Step 3: Migrate Module by Module

```javascript
// users.service.js - BEFORE
import _ from 'lodash';

export function getActiveUserStats(users) {
  const activeUsers = _.filter(users, u => u.active);
  return {
    count: activeUsers.length,
    avgAge: _.meanBy(activeUsers, 'age'),
    maxAge: _.maxBy(activeUsers, 'age').age
  };
}

// users.service.js - AFTER
import { iter } from 'iterflow';
import _ from 'lodash'; // Keep for other uses

export function getActiveUserStats(users) {
  const activeUsers = iter(users)
    .filter(u => u.active);

  return {
    count: activeUsers.count(),
    avgAge: iter(activeUsers).map(u => u.age).mean(),
    maxAge: iter(activeUsers).map(u => u.age).max(),
    // New capability!
    medianAge: iter(activeUsers).map(u => u.age).median()
  };
}
```

### Step 4: Use Both Libraries Together

```javascript
import _ from 'lodash';
import { iter } from 'iterflow';

// Use lodash for object manipulation
const cleanedData = data.map(item =>
  _.pick(item, ['id', 'value', 'timestamp'])
);

// Use iterflow for data pipeline
const result = iter(cleanedData)
  .filter(item => item.value > 100)
  .window(5)
  .map(window =>
    iter(window).map(item => item.value).mean()
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

### 2. Reusing Iterators

**Wrong:**
```javascript
const numbers = iter([1, 2, 3, 4, 5]);
const sum = numbers.sum();     // 15
const mean = numbers.mean();   // undefined - iterator exhausted!
```

**Correct:**
```javascript
const data = [1, 2, 3, 4, 5];
const sum = iter(data).sum();   // 15
const mean = iter(data).mean(); // 3
```

### 3. Map vs Object from groupBy

**Wrong:**
```javascript
const groups = iter(items).groupBy(item => item.category);
console.log(groups.electronics); // undefined - it's a Map!
```

**Correct:**
```javascript
const groups = iter(items).groupBy(item => item.category);
console.log(groups.get('electronics')); // Correct

// Or convert to object if needed
const groupsObj = Object.fromEntries(groups);
console.log(groupsObj.electronics); // Works
```

### 4. Statistical Methods on Non-Numbers

**Wrong:**
```javascript
iter(['a', 'b', 'c']).sum(); // TypeScript error
```

**Correct:**
```javascript
iter([1, 2, 3]).sum(); // 6

// Convert first if needed
iter(['1', '2', '3'])
  .map(Number)
  .sum(); // 6
```

## Summary

### Quick Migration Checklist

- [ ] Install iterflow: `npm install iterflow`
- [ ] Identify array-heavy operations in your codebase
- [ ] Replace lodash chains with iterflow pipelines
- [ ] Add `.toArray()` to convert results
- [ ] Use `distinct()` instead of `_.uniq()`
- [ ] Use `groupBy()` but remember it returns Map
- [ ] Leverage new statistical operations
- [ ] Test performance improvements
- [ ] Keep lodash for object/string utilities
- [ ] Update TypeScript types if needed

### Key Takeaways

✅ **Lazy evaluation** - Major performance benefit for large datasets
✅ **Advanced statistics** - Rich set of statistical operations
✅ **Memory efficiency** - Process data without intermediate arrays
✅ **ES2025 ready** - Future-proof code
✅ **Type safety** - Excellent TypeScript support

⚠️ **Remember to call** `.toArray()` for terminal array results
⚠️ **Don't reuse** exhausted iterators
⚠️ **Keep lodash** for object/string utilities

For more information, see:
- [API Documentation](../api.md)
- [Comparison with Lodash](../comparisons/lodash.md)
- [Getting Started Guide](./getting-started.md)
