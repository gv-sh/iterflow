# Comparison with Ramda

This guide compares iterflow with Ramda, highlighting the differences in philosophy, functional programming approach, and use cases.

## Philosophy Differences

### Ramda
- **Pure functional**: Immutable, side-effect-free functions
- **Curried by default**: All functions are automatically curried
- **Function-first, data-last**: Optimized for composition and point-free style
- **Composable**: Strong emphasis on function composition
- **General-purpose FP**: Comprehensive functional programming library

### iterflow
- **Iterator-focused**: Specialized for iterable data transformations
- **Lazy evaluation**: Deferred computation until needed
- **Fluent API**: Method chaining (also has functional API)
- **ES2025 aligned**: Designed to complement native iterator helpers
- **Statistical operations**: Built-in advanced statistical analysis

## Functional Programming Comparison

### Ramda's Currying vs iterflow's Fluent API

**Ramda Style:**
```javascript
import * as R from 'ramda';

const result = R.pipe(
  R.filter(x => x % 2 === 0),
  R.map(x => x * 2),
  R.take(3)
)([1, 2, 3, 4, 5, 6]);
// [4, 8, 12]
```

**iterflow Style (Wrapper API):**
```javascript
import { iter } from 'iterflow';

const result = iter([1, 2, 3, 4, 5, 6])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(3)
  .toArray();
// [4, 8, 12]
```

**iterflow Style (Functional API with Composition):**
```javascript
import { pipe } from 'iterflow/fn';
import { filter, map, take, toArray } from 'iterflow/fn';

const pipeline = pipe(
  filter(x => x % 2 === 0),
  map(x => x * 2),
  take(3),
  toArray
);

const result = pipeline([1, 2, 3, 4, 5, 6]);
// [4, 8, 12]
```

## Function Comparison

### Basic Transformations

#### map

**Ramda:**
```javascript
R.map(x => x * 2, [1, 2, 3]);
// [3, 6, 9]

// Curried version
const double = R.map(x => x * 2);
double([1, 2, 3]); // [2, 4, 6]
```

**iterflow:**
```javascript
// Wrapper API
iter([1, 2, 3]).map(x => x * 2).toArray();
// [2, 4, 6]

// Functional API
import { map } from 'iterflow/fn';
map(x => x * 2)([1, 2, 3]); // returns iterator
```

#### filter

**Ramda:**
```javascript
R.filter(x => x % 2 === 0, [1, 2, 3, 4]);
// [2, 4]

// Point-free style
const evens = R.filter(x => x % 2 === 0);
evens([1, 2, 3, 4]); // [2, 4]
```

**iterflow:**
```javascript
// Wrapper API
iter([1, 2, 3, 4])
  .filter(x => x % 2 === 0)
  .toArray();
// [2, 4]

// Functional API
import { filter } from 'iterflow/fn';
const evens = filter(x => x % 2 === 0);
evens([1, 2, 3, 4]); // returns iterator
```

#### reduce

**Ramda:**
```javascript
R.reduce((acc, x) => acc + x, 0, [1, 2, 3, 4]);
// 10

// Curried
const sum = R.reduce((acc, x) => acc + x, 0);
sum([1, 2, 3, 4]); // 10
```

**iterflow:**
```javascript
// Wrapper API
iter([1, 2, 3, 4])
  .reduce((acc, x) => acc + x, 0);
// 10

// Or use built-in sum
iter([1, 2, 3, 4]).sum();
// 10
```

### Composition

#### pipe

**Ramda:**
```javascript
const pipeline = R.pipe(
  R.filter(x => x > 0),
  R.map(x => x * 2),
  R.sum
);

pipeline([1, -2, 3, -4, 5]);
// 18
```

**iterflow:**
```javascript
// Wrapper API (no pipe needed)
iter([1, -2, 3, -4, 5])
  .filter(x => x > 0)
  .map(x => x * 2)
  .sum();
// 18

// Functional API with pipe
import { pipe } from 'iterflow/fn';
import { filter, map, sum } from 'iterflow/fn';

const pipeline = pipe(
  filter(x => x > 0),
  map(x => x * 2),
  sum
);

pipeline([1, -2, 3, -4, 5]);
// 18
```

#### compose

**Ramda:**
```javascript
// Right-to-left composition
const pipeline = R.compose(
  R.sum,
  R.map(x => x * 2),
  R.filter(x => x > 0)
);

pipeline([1, -2, 3, -4, 5]);
// 18
```

**iterflow:**
```javascript
import { compose } from 'iterflow/fn';
import { filter, map, sum } from 'iterflow/fn';

const pipeline = compose(
  sum,
  map(x => x * 2),
  filter(x => x > 0)
);

pipeline([1, -2, 3, -4, 5]);
// 18
```

### List Operations

#### take

**Ramda:**
```javascript
R.take(3, [1, 2, 3, 4, 5]);
// [1, 2, 3]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .take(3)
  .toArray();
// [1, 2, 3]
```

**Advantage (iterflow):** Efficient with infinite sequences:
```javascript
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Ramda can't handle infinite generators
// R.take(10, fibonacci()) // Won't work

// iterflow handles it naturally
iter(fibonacci()).take(10).toArray();
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

#### drop

**Ramda:**
```javascript
R.drop(2, [1, 2, 3, 4, 5]);
// [3, 4, 5]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .drop(2)
  .toArray();
// [3, 4, 5]
```

#### takeWhile

**Ramda:**
```javascript
R.takeWhile(x => x < 4, [1, 2, 3, 4, 1, 2]);
// [1, 2, 3]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 1, 2])
  .takeWhile(x => x < 4)
  .toArray();
// [1, 2, 3]
```

#### dropWhile

**Ramda:**
```javascript
R.dropWhile(x => x < 3, [1, 2, 3, 4, 5]);
// [3, 4, 5]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .dropWhile(x => x < 3)
  .toArray();
// [3, 4, 5]
```

#### flatten / flatMap

**Ramda:**
```javascript
R.flatten([1, [2, 3], [4, [5, 6]]]);
// [1, 2, 3, 4, [5, 6]]

R.chain(x => [x, x * 2], [1, 2, 3]);
// [1, 2, 2, 4, 3, 6]
```

**iterflow:**
```javascript
// Single-level flatten with flatMap
iter([1, [2, 3], [4, [5, 6]]])
  .flatMap(x => Array.isArray(x) ? x : [x])
  .toArray();
// [1, 2, 3, 4, [5, 6]]

// flatMap (equivalent to R.chain)
iter([1, 2, 3])
  .flatMap(x => [x, x * 2])
  .toArray();
// [1, 2, 2, 4, 3, 6]
```

### Grouping & Partitioning

#### groupBy

**Ramda:**
```javascript
R.groupBy(name => name.length, ['alice', 'bob', 'charlie']);
// { '3': ['bob'], '5': ['alice'], '7': ['charlie'] }
```

**iterflow:**
```javascript
iter(['alice', 'bob', 'charlie'])
  .groupBy(name => name.length);
// Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'] }
```

**Key Difference:** Ramda returns plain object, iterflow returns Map

#### partition

**Ramda:**
```javascript
R.partition(x => x % 2 === 0, [1, 2, 3, 4, 5]);
// [[2, 4], [1, 3, 5]]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .partition(x => x % 2 === 0);
// [[2, 4], [1, 3, 5]]
```

### Set Operations

#### uniq / distinct

**Ramda:**
```javascript
R.uniq([1, 2, 2, 3, 3, 3, 4]);
// [1, 2, 3, 4]
```

**iterflow:**
```javascript
iter([1, 2, 2, 3, 3, 3, 4])
  .distinct()
  .toArray();
// [1, 2, 3, 4]
```

#### uniqBy / distinctBy

**Ramda:**
```javascript
R.uniqBy(Math.abs, [-1, -2, 1, 2, 3]);
// [-1, -2, 3]
```

**iterflow:**
```javascript
iter([-1, -2, 1, 2, 3])
  .distinctBy(Math.abs)
  .toArray();
// [-1, -2, 3]
```

### Combining Operations

#### zip

**Ramda:**
```javascript
R.zip([1, 2, 3], ['a', 'b', 'c']);
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

**iterflow:**
```javascript
iter.zip([1, 2, 3], ['a', 'b', 'c'])
  .toArray();
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

#### zipWith

**Ramda:**
```javascript
R.zipWith((a, b) => a + b, [1, 2, 3], [10, 20, 30]);
// [11, 22, 33]
```

**iterflow:**
```javascript
iter.zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b)
  .toArray();
// [11, 22, 33]
```

#### concat

**Ramda:**
```javascript
R.concat([1, 2], [3, 4]);
// [1, 2, 3, 4]
```

**iterflow:**
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

### Finding & Searching

#### find

**Ramda:**
```javascript
R.find(x => x > 3, [1, 2, 3, 4, 5]);
// 4
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .find(x => x > 3);
// 4
```

#### findIndex

**Ramda:**
```javascript
R.findIndex(x => x > 3, [1, 2, 3, 4, 5]);
// 3
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .findIndex(x => x > 3);
// 3
```

#### any / some

**Ramda:**
```javascript
R.any(x => x > 3, [1, 2, 3, 4, 5]);
// true
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .some(x => x > 3);
// true
```

#### all / every

**Ramda:**
```javascript
R.all(x => x > 0, [1, 2, 3, 4, 5]);
// true
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .every(x => x > 0);
// true
```

#### includes / contains

**Ramda:**
```javascript
R.includes(3, [1, 2, 3, 4, 5]);
// true
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .includes(3);
// true
```

### Sorting

#### sort

**Ramda:**
```javascript
R.sort((a, b) => a - b, [3, 1, 4, 1, 5]);
// [1, 1, 3, 4, 5]
```

**iterflow:**
```javascript
// Default sort
iter([3, 1, 4, 1, 5])
  .sort()
  .toArray();
// [1, 1, 3, 4, 5]

// Custom comparator
iter([3, 1, 4, 1, 5])
  .sortBy((a, b) => a - b)
  .toArray();
// [1, 1, 3, 4, 5]
```

#### reverse

**Ramda:**
```javascript
R.reverse([1, 2, 3, 4, 5]);
// [5, 4, 3, 2, 1]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .reverse()
  .toArray();
// [5, 4, 3, 2, 1]
```

### Statistical Operations

Ramda has limited built-in statistical operations. iterflow provides comprehensive statistics.

#### sum

**Ramda:**
```javascript
R.sum([1, 2, 3, 4, 5]);
// 15
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .sum();
// 15
```

#### mean

**Ramda:**
```javascript
R.mean([1, 2, 3, 4, 5]);
// 3
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .mean();
// 3
```

#### median

**Ramda:**
```javascript
R.median([1, 2, 3, 4, 5]);
// 3
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .median();
// 3
```

### Advanced Statistics (iterflow advantages)

**Standard Deviation:**
```javascript
// Ramda - not available
// iterflow
iter([2, 4, 4, 4, 5, 5, 7, 9])
  .stdDev();
// ~2
```

**Variance:**
```javascript
// Ramda - not available
// iterflow
iter([1, 2, 3, 4, 5])
  .variance();
// 2
```

**Percentiles:**
```javascript
// Ramda - not available
// iterflow
iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .percentile(75);
// 7.75
```

**Mode:**
```javascript
// Ramda - not available
// iterflow
iter([1, 2, 2, 3, 3, 3])
  .mode();
// [3]
```

**Quartiles:**
```javascript
// Ramda - not available
// iterflow
iter([1, 2, 3, 4, 5, 6, 7, 8, 9])
  .quartiles();
// { Q1: 3, Q2: 5, Q3: 7 }
```

**Correlation & Covariance:**
```javascript
// Ramda - not available
// iterflow
iter([1, 2, 3, 4, 5])
  .correlation([2, 4, 6, 8, 10]);
// 1

iter([1, 2, 3, 4, 5])
  .covariance([2, 4, 6, 8, 10]);
// 4
```

### Windowing Operations

#### Sliding Windows

**Ramda:**
```javascript
// Not built-in, need custom implementation
const window = (n, list) =>
  R.aperture(n, list);

R.aperture(3, [1, 2, 3, 4, 5]);
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .window(3)
  .toArray();
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

#### chunk / splitEvery

**Ramda:**
```javascript
R.splitEvery(2, [1, 2, 3, 4, 5]);
// [[1, 2], [3, 4], [5]]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .chunk(2)
  .toArray();
// [[1, 2], [3, 4], [5]]
```

#### pairwise

**Ramda:**
```javascript
R.aperture(2, [1, 2, 3, 4]);
// [[1, 2], [2, 3], [3, 4]]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4])
  .pairwise()
  .toArray();
// [[1, 2], [2, 3], [3, 4]]
```

### Generator Functions

#### range

**Ramda:**
```javascript
R.range(0, 5);
// [0, 1, 2, 3, 4]

R.range(2, 5);
// [2, 3, 4]
```

**iterflow:**
```javascript
iter.range(5).toArray();
// [0, 1, 2, 3, 4]

iter.range(2, 5).toArray();
// [2, 3, 4]

iter.range(0, 10, 2).toArray();
// [0, 2, 4, 6, 8]
```

#### repeat

**Ramda:**
```javascript
R.repeat('x', 3);
// ['x', 'x', 'x']
```

**iterflow:**
```javascript
iter.repeat('x', 3).toArray();
// ['x', 'x', 'x']

// Infinite repeat
iter.repeat(0).take(5).toArray();
// [0, 0, 0, 0, 0]
```

### Additional Operations in iterflow

#### scan

```javascript
// Ramda has R.scan
R.scan((acc, x) => acc + x, 0, [1, 2, 3, 4]);
// [0, 1, 3, 6, 10]

// iterflow
iter([1, 2, 3, 4])
  .scan((acc, x) => acc + x, 0)
  .toArray();
// [0, 1, 3, 6, 10]
```

#### enumerate / addIndex

**Ramda:**
```javascript
const mapIndexed = R.addIndex(R.map);
mapIndexed((val, idx) => [idx, val], ['a', 'b', 'c']);
// [[0, 'a'], [1, 'b'], [2, 'c']]
```

**iterflow:**
```javascript
iter(['a', 'b', 'c'])
  .enumerate()
  .toArray();
// [[0, 'a'], [1, 'b'], [2, 'c']]
```

#### intersperse

**Ramda:**
```javascript
R.intersperse(0, [1, 2, 3]);
// [1, 0, 2, 0, 3]
```

**iterflow:**
```javascript
iter([1, 2, 3])
  .intersperse(0)
  .toArray();
// [1, 0, 2, 0, 3]
```

#### tap

**Ramda:**
```javascript
R.tap(console.log, [1, 2, 3]);
// Logs [1, 2, 3] and returns [1, 2, 3]
```

**iterflow:**
```javascript
// Element-by-element tap
iter([1, 2, 3])
  .tap(x => console.log('Processing:', x))
  .map(x => x * 2)
  .toArray();
// Logs each element
```

#### interleave

**Ramda:**
```javascript
// Not built-in, but can use custom implementation
const interleave = (a, b) => R.chain(R.identity, R.zip(a, b));
```

**iterflow:**
```javascript
iter.interleave([1, 2, 3], [4, 5, 6])
  .toArray();
// [1, 4, 2, 5, 3, 6]
```

#### merge

**Ramda:**
```javascript
// Not built-in for arrays, need custom implementation
```

**iterflow:**
```javascript
iter.merge([1, 3, 5], [2, 4, 6])
  .toArray();
// [1, 2, 3, 4, 5, 6]
```

## Currying Comparison

### Ramda's Auto-Currying

**Ramda:**
```javascript
// All Ramda functions are curried
const add = R.add;
const add5 = add(5);
add5(3); // 8

const filterEvens = R.filter(x => x % 2 === 0);
filterEvens([1, 2, 3, 4]); // [2, 4]

// Compose with partial application
const pipeline = R.pipe(
  R.filter(x => x > 0),
  R.map(R.multiply(2)),
  R.sum
);
```

**iterflow:**
```javascript
// Functional API returns functions that take iterables
import { filter, map } from 'iterflow/fn';

const filterEvens = filter(x => x % 2 === 0);
const double = map(x => x * 2);

// Compose operations
import { pipe } from 'iterflow/fn';
const pipeline = pipe(
  filterEvens,
  double
);

pipeline([1, 2, 3, 4]); // returns iterator
```

## Performance Comparison

### Lazy Evaluation

**Ramda:**
```javascript
// Ramda is mostly eager
const result = R.pipe(
  R.filter(x => x > 0),
  R.map(expensiveOperation),
  R.take(5)
)(largeArray);
// Processes all positive numbers through map, then takes 5
```

**iterflow:**
```javascript
// Truly lazy
const result = iter(largeArray)
  .filter(x => x > 0)
  .map(expensiveOperation)
  .take(5)
  .toArray();
// Only processes first 5 positive numbers through map
```

### Memory Efficiency

**Ramda:**
```javascript
// Creates intermediate arrays
const result = R.pipe(
  R.filter(condition),
  R.map(transform),
  R.take(10)
)(millionItems);
// O(n) memory for filtered array
```

**iterflow:**
```javascript
// Streams without intermediate arrays
const result = iter(millionItems)
  .filter(condition)
  .map(transform)
  .take(10)
  .toArray();
// O(1) memory during iteration
```

## When to Use Each

### Use Ramda When:

- Building functional programming applications
- Need comprehensive FP utilities (lenses, transducers, etc.)
- Prefer currying by default
- Want point-free style programming
- Need strong composition patterns
- Working with objects and nested data structures
- Prefer function-first, data-last API
- Don't need lazy evaluation
- Want immutability guarantees throughout

### Use iterflow When:

- Processing large datasets or streams
- Need lazy evaluation for performance
- Working with iterators and generators
- Require advanced statistical operations
- Building data transformation pipelines
- Need memory efficiency
- Working with infinite sequences
- Want ES2025 iterator helpers compatibility
- Prefer method chaining over composition
- Focus on numerical/statistical analysis

## Combining Ramda with iterflow

Both libraries can work together:

```javascript
import * as R from 'ramda';
import { iter } from 'iterflow';

// Use Ramda for object manipulation
const processRecord = R.pipe(
  R.pick(['id', 'value', 'timestamp']),
  R.evolve({
    value: x => x * 2,
    timestamp: Date.parse
  })
);

// Use iterflow for data pipeline
const results = iter(records)
  .map(processRecord)          // Ramda object processing
  .filter(x => x.value > 100)  // iterflow filtering
  .window(5)                   // iterflow windowing
  .map(window =>
    iter(window)
      .map(R.prop('value'))    // Ramda property extraction
      .mean()                  // iterflow statistics
  )
  .toArray();
```

## Migration from Ramda to iterflow

### 1. Pipeline Operations
```javascript
// Before (Ramda)
const pipeline = R.pipe(
  R.filter(x => x > 0),
  R.map(x => x * 2),
  R.take(10)
);
const result = pipeline(data);

// After (iterflow wrapper API)
const result = iter(data)
  .filter(x => x > 0)
  .map(x => x * 2)
  .take(10)
  .toArray();

// Or (iterflow functional API)
import { pipe } from 'iterflow/fn';
import { filter, map, take, toArray } from 'iterflow/fn';

const pipeline = pipe(
  filter(x => x > 0),
  map(x => x * 2),
  take(10),
  toArray
);
const result = pipeline(data);
```

### 2. Statistical Analysis
```javascript
// Before (Ramda)
const avg = R.mean(numbers);
const total = R.sum(numbers);

// After (iterflow)
const stats = {
  avg: iter(numbers).mean(),
  total: iter(numbers).sum(),
  median: iter(numbers).median(),
  stdDev: iter(numbers).stdDev()
};
```

### 3. Large Data Processing
```javascript
// Before (Ramda - eager)
const result = R.pipe(
  R.filter(condition),
  R.map(transform),
  R.take(100)
)(largeDataset);

// After (iterflow - lazy)
const result = iter(largeDataset)
  .filter(condition)
  .map(transform)
  .take(100)
  .toArray();
```

## Conclusion

Both Ramda and iterflow are excellent libraries with different strengths:

- **Ramda** excels as a comprehensive functional programming library with currying, composition, and utilities for complex data transformations
- **iterflow** excels at lazy, memory-efficient iteration with advanced statistical operations and ES2025 alignment

Choose based on your needs:
- Use **Ramda** for FP paradigm, object manipulation, and composition-heavy code
- Use **iterflow** for data pipelines, statistical analysis, and memory-efficient streaming
- Use **both** together when you need FP utilities and efficient data processing

For teams adopting functional programming with a focus on data analysis and streaming, iterflow provides the performance and features that complement Ramda's FP approach.
