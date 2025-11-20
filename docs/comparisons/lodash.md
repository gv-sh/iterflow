# Comparison with Lodash

This guide compares iterflow with lodash, highlighting the differences in approach, performance, and use cases.

## Philosophy Differences

### Lodash
- **Array-first**: Operates primarily on arrays
- **Eager evaluation**: Most operations execute immediately and return arrays
- **Utility library**: Comprehensive collection of utility functions
- **Mutable/immutable**: Mix of methods, some mutate, some don't
- **Chain API**: Optional chaining with `_.chain()` and `.value()`

### iterflow
- **Iterator-first**: Operates on any iterable (arrays, generators, custom iterators)
- **Lazy evaluation**: Operations are deferred until a terminal operation is called
- **Data pipeline focused**: Optimized for data transformations and analysis
- **Immutable**: All operations return new iterators
- **Native integration**: Designed to work with ES2025 iterator helpers

## Performance Characteristics

| Operation Type | Lodash | iterflow |
|----------------|--------|----------|
| Small arrays (< 100) | ✅ Fast | ⚠️ Slight overhead |
| Large arrays (> 10,000) | ⚠️ Memory intensive | ✅ Memory efficient |
| Early termination | ⚠️ May process all | ✅ Stops immediately |
| Multiple operations | ⚠️ Multiple passes | ✅ Single pass |
| Infinite sequences | ❌ Not supported | ✅ Supported |
| Statistical operations | ⚠️ Limited | ✅ Comprehensive |

## Function Comparison

### Transformation Operations

#### map

**Lodash:**
```javascript
import _ from 'lodash';

const result = _.map([1, 2, 3], x => x * 2);
// [2, 4, 6]
```

**iterflow:**
```javascript
import { iter } from 'iterflow';

const result = iter([1, 2, 3])
  .map(x => x * 2)
  .toArray();
// [2, 4, 6]
```

**Key Differences:**
- Lodash returns an array immediately
- iterflow is lazy; `.toArray()` triggers evaluation
- iterflow works with any iterable, not just arrays

#### filter

**Lodash:**
```javascript
_.filter([1, 2, 3, 4], x => x % 2 === 0);
// [2, 4]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4])
  .filter(x => x % 2 === 0)
  .toArray();
// [2, 4]
```

#### flatMap

**Lodash:**
```javascript
_.flatMap([1, 2, 3], x => [x, x * 2]);
// [1, 2, 2, 4, 3, 6]
```

**iterflow:**
```javascript
iter([1, 2, 3])
  .flatMap(x => [x, x * 2])
  .toArray();
// [1, 2, 2, 4, 3, 6]
```

#### take

**Lodash:**
```javascript
_.take([1, 2, 3, 4, 5], 3);
// [1, 2, 3]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .take(3)
  .toArray();
// [1, 2, 3]
```

**Advantage (iterflow):** Works efficiently with infinite sequences:
```javascript
// Lodash - can't do this
// _.take(infiniteGenerator(), 3) // Won't work

// iterflow - works perfectly
function* infiniteNumbers() {
  let n = 0;
  while (true) yield n++;
}

iter(infiniteNumbers())
  .take(3)
  .toArray();
// [0, 1, 2]
```

#### drop / skip

**Lodash:**
```javascript
_.drop([1, 2, 3, 4, 5], 2);
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

**Lodash:**
```javascript
_.takeWhile([1, 2, 3, 4, 1], x => x < 4);
// [1, 2, 3]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 1])
  .takeWhile(x => x < 4)
  .toArray();
// [1, 2, 3]
```

#### dropWhile

**Lodash:**
```javascript
_.dropWhile([1, 2, 3, 4, 5], x => x < 3);
// [3, 4, 5]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .dropWhile(x => x < 3)
  .toArray();
// [3, 4, 5]
```

### Terminal Operations

#### reduce

**Lodash:**
```javascript
_.reduce([1, 2, 3, 4], (acc, x) => acc + x, 0);
// 10
```

**iterflow:**
```javascript
iter([1, 2, 3, 4])
  .reduce((acc, x) => acc + x, 0);
// 10
```

#### find

**Lodash:**
```javascript
_.find([1, 2, 3, 4], x => x > 2);
// 3
```

**iterflow:**
```javascript
iter([1, 2, 3, 4])
  .find(x => x > 2);
// 3
```

**Advantage (iterflow):** Early termination with lazy evaluation:
```javascript
// With iterflow, only 3 elements are processed
iter(hugeArray)
  .map(expensiveOperation)
  .find(x => x > threshold);
// Stops as soon as condition is met
```

#### some

**Lodash:**
```javascript
_.some([1, 2, 3, 4], x => x > 3);
// true
```

**iterflow:**
```javascript
iter([1, 2, 3, 4])
  .some(x => x > 3);
// true
```

#### every

**Lodash:**
```javascript
_.every([2, 4, 6], x => x % 2 === 0);
// true
```

**iterflow:**
```javascript
iter([2, 4, 6])
  .every(x => x % 2 === 0);
// true
```

#### includes

**Lodash:**
```javascript
_.includes([1, 2, 3], 2);
// true
```

**iterflow:**
```javascript
iter([1, 2, 3])
  .includes(2);
// true
```

### Statistical Operations

#### sum

**Lodash:**
```javascript
_.sum([1, 2, 3, 4, 5]);
// 15
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .sum();
// 15
```

#### mean

**Lodash:**
```javascript
_.mean([1, 2, 3, 4, 5]);
// 3
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .mean();
// 3
```

#### min

**Lodash:**
```javascript
_.min([3, 1, 4, 1, 5]);
// 1
```

**iterflow:**
```javascript
iter([3, 1, 4, 1, 5])
  .min();
// 1
```

#### max

**Lodash:**
```javascript
_.max([3, 1, 4, 1, 5]);
// 5
```

**iterflow:**
```javascript
iter([3, 1, 4, 1, 5])
  .max();
// 5
```

### Advanced Statistics (iterflow advantages)

iterflow provides statistical operations not available in lodash:

**Median:**
```javascript
// Lodash - not available, need to implement manually
function median(arr) {
  const sorted = _.sortBy(arr);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// iterflow - built-in
iter([1, 2, 3, 4, 5])
  .median();
// 3
```

**Standard Deviation:**
```javascript
// Lodash - not available
// iterflow - built-in
iter([2, 4, 4, 4, 5, 5, 7, 9])
  .stdDev();
// ~2
```

**Percentiles:**
```javascript
// Lodash - not available
// iterflow - built-in
iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .percentile(75);
// 7.75
```

**Variance:**
```javascript
// Lodash - not available
// iterflow - built-in
iter([1, 2, 3, 4, 5])
  .variance();
// 2
```

**Mode:**
```javascript
// Lodash - not available
// iterflow - built-in
iter([1, 2, 2, 3, 3, 3])
  .mode();
// [3]
```

**Quartiles:**
```javascript
// Lodash - not available
// iterflow - built-in
iter([1, 2, 3, 4, 5, 6, 7, 8, 9])
  .quartiles();
// { Q1: 3, Q2: 5, Q3: 7 }
```

**Correlation & Covariance:**
```javascript
// Lodash - not available
// iterflow - built-in
iter([1, 2, 3, 4, 5])
  .correlation([2, 4, 6, 8, 10]);
// 1 (perfect positive correlation)

iter([1, 2, 3, 4, 5])
  .covariance([2, 4, 6, 8, 10]);
// 4
```

### Windowing Operations

#### chunk

**Lodash:**
```javascript
_.chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .chunk(2)
  .toArray();
// [[1, 2], [3, 4], [5]]
```

#### Sliding Window

**Lodash:**
```javascript
// Not available - need to implement manually
function window(arr, size) {
  return arr.map((_, i) => arr.slice(i, i + size))
    .slice(0, arr.length - size + 1);
}
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .window(3)
  .toArray();
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

#### pairwise

**Lodash:**
```javascript
// Not available - use window or custom implementation
_.zip([1, 2, 3, 4].slice(0, -1), [1, 2, 3, 4].slice(1));
// [[1, 2], [2, 3], [3, 4]]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4])
  .pairwise()
  .toArray();
// [[1, 2], [2, 3], [3, 4]]
```

### Grouping & Partitioning

#### groupBy

**Lodash:**
```javascript
_.groupBy(['alice', 'bob', 'charlie'], name => name.length);
// { '3': ['bob'], '5': ['alice'], '7': ['charlie'] }
```

**iterflow:**
```javascript
iter(['alice', 'bob', 'charlie'])
  .groupBy(name => name.length);
// Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'] }
```

**Key Difference:** lodash returns an object, iterflow returns a Map

#### partition

**Lodash:**
```javascript
_.partition([1, 2, 3, 4, 5], x => x % 2 === 0);
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

**Lodash:**
```javascript
_.uniq([1, 2, 2, 3, 3, 3, 4]);
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

**Lodash:**
```javascript
_.uniqBy([{id: 1}, {id: 2}, {id: 1}], 'id');
// [{id: 1}, {id: 2}]
```

**iterflow:**
```javascript
iter([{id: 1}, {id: 2}, {id: 1}])
  .distinctBy(obj => obj.id)
  .toArray();
// [{id: 1}, {id: 2}]
```

### Combining Operations

#### zip

**Lodash:**
```javascript
_.zip([1, 2, 3], ['a', 'b', 'c']);
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

**iterflow:**
```javascript
iter.zip([1, 2, 3], ['a', 'b', 'c'])
  .toArray();
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

#### zipWith

**Lodash:**
```javascript
_.zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b);
// [11, 22, 33]
```

**iterflow:**
```javascript
iter.zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b)
  .toArray();
// [11, 22, 33]
```

#### flatten

**Lodash:**
```javascript
_.flatten([1, [2, 3], [4, [5]]]);
// [1, 2, 3, 4, [5]]
```

**iterflow:**
```javascript
// Use flatMap for single-level flattening
iter([1, [2, 3], [4, [5]]])
  .flatMap(x => Array.isArray(x) ? x : [x])
  .toArray();
// [1, 2, 3, 4, [5]]
```

#### concat

**Lodash:**
```javascript
_.concat([1, 2], [3, 4], [5, 6]);
// [1, 2, 3, 4, 5, 6]
```

**iterflow:**
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

### Sorting Operations

#### sortBy

**Lodash:**
```javascript
_.sortBy([3, 1, 4, 1, 5]);
// [1, 1, 3, 4, 5]

_.sortBy([{age: 30}, {age: 20}, {age: 25}], 'age');
// [{age: 20}, {age: 25}, {age: 30}]
```

**iterflow:**
```javascript
iter([3, 1, 4, 1, 5])
  .sort()
  .toArray();
// [1, 1, 3, 4, 5]

iter([{age: 30}, {age: 20}, {age: 25}])
  .sortBy((a, b) => a.age - b.age)
  .toArray();
// [{age: 20}, {age: 25}, {age: 30}]
```

#### reverse

**Lodash:**
```javascript
_.reverse([1, 2, 3, 4, 5]);
// [5, 4, 3, 2, 1]
// ⚠️ Mutates the original array
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .reverse()
  .toArray();
// [5, 4, 3, 2, 1]
// ✓ Original array unchanged
```

### Generator Functions

#### range

**Lodash:**
```javascript
_.range(5);
// [0, 1, 2, 3, 4]

_.range(2, 5);
// [2, 3, 4]

_.range(0, 10, 2);
// [0, 2, 4, 6, 8]
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

**Lodash:**
```javascript
_.times(3, () => 'x');
// ['x', 'x', 'x']
```

**iterflow:**
```javascript
iter.repeat('x', 3).toArray();
// ['x', 'x', 'x']

// Infinite repeat (not possible with lodash)
iter.repeat(0).take(5).toArray();
// [0, 0, 0, 0, 0]
```

### Additional Operations in iterflow

These operations are not available in lodash:

#### scan

```javascript
iter([1, 2, 3, 4])
  .scan((acc, x) => acc + x, 0)
  .toArray();
// [0, 1, 3, 6, 10]
```

#### enumerate

```javascript
iter(['a', 'b', 'c'])
  .enumerate()
  .toArray();
// [[0, 'a'], [1, 'b'], [2, 'c']]
```

#### intersperse

```javascript
iter([1, 2, 3])
  .intersperse(0)
  .toArray();
// [1, 0, 2, 0, 3]
```

#### tap

```javascript
iter([1, 2, 3])
  .tap(x => console.log('Processing:', x))
  .map(x => x * 2)
  .toArray();
// Logs each value, returns [2, 4, 6]
```

#### interleave

```javascript
iter.interleave([1, 2, 3], [4, 5, 6])
  .toArray();
// [1, 4, 2, 5, 3, 6]
```

#### merge

```javascript
iter.merge([1, 3, 5], [2, 4, 6])
  .toArray();
// [1, 2, 3, 4, 5, 6]
```

## Chaining Comparison

### Lodash Chaining

```javascript
_.chain([1, 2, 3, 4, 5, 6])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(2)
  .value();
// [4, 8]
```

**Note:** Lodash chaining with `_.chain()` still evaluates eagerly at each step.

### iterflow Chaining

```javascript
iter([1, 2, 3, 4, 5, 6])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(2)
  .toArray();
// [4, 8]
```

**Key Difference:** iterflow chaining is truly lazy - no computation happens until `.toArray()`.

## Performance Comparison

### Early Termination Example

**Lodash:**
```javascript
// Processes all 1 million items through map, then finds first
_.find(
  _.map(millionItems, expensiveOperation),
  condition
);
```

**iterflow:**
```javascript
// Only processes items until condition is met
iter(millionItems)
  .map(expensiveOperation)
  .find(condition);
```

### Memory Efficiency

**Lodash:**
```javascript
// Creates intermediate arrays at each step
const result = _.take(
  _.map(
    _.filter(hugeArray, condition1),
    transform
  ),
  10
);
// Memory: O(n) at each step
```

**iterflow:**
```javascript
// No intermediate arrays, streams through
const result = iter(hugeArray)
  .filter(condition1)
  .map(transform)
  .take(10)
  .toArray();
// Memory: O(1) during iteration, O(10) final result
```

### Statistical Pipeline

**Lodash:**
```javascript
const data = _.filter(salesData, sale => sale.amount > 100);
const amounts = _.map(data, sale => sale.amount);
const avg = _.mean(amounts);
const sorted = _.sortBy(amounts);
const median = sorted[Math.floor(sorted.length / 2)];
// Multiple passes through data
```

**iterflow:**
```javascript
const amounts = iter(salesData)
  .filter(sale => sale.amount > 100)
  .map(sale => sale.amount);

const avg = amounts.mean();
const median = amounts.median();
// Single pass for each terminal operation
```

## When to Use Each

### Use Lodash When:

- Working with small to medium arrays (< 10,000 items)
- Need utilities beyond iteration (deep cloning, object manipulation, etc.)
- Already using lodash in your project
- Don't need lazy evaluation
- Prefer object returns over Map/Set
- Need browser compatibility without transpilation

### Use iterflow When:

- Working with large datasets
- Need memory efficiency
- Processing infinite or very large sequences
- Building data transformation pipelines
- Need early termination benefits
- Require advanced statistical operations
- Want lazy evaluation by default
- Working with generators or custom iterables
- Need ES2025 iterator helpers compatibility

## Migration Strategy

For teams currently using lodash and considering iterflow:

### 1. Start with Statistical Operations
```javascript
// Before
const avg = _.mean(numbers);
const min = _.min(numbers);
const max = _.max(numbers);

// After - add advanced stats
import { iter } from 'iterflow';
const stats = {
  avg: iter(numbers).mean(),
  median: iter(numbers).median(),
  stdDev: iter(numbers).stdDev(),
  quartiles: iter(numbers).quartiles()
};
```

### 2. Replace Large Array Operations
```javascript
// Before
const result = _.take(
  _.map(
    _.filter(largeArray, condition),
    transform
  ),
  100
);

// After - memory efficient
const result = iter(largeArray)
  .filter(condition)
  .map(transform)
  .take(100)
  .toArray();
```

### 3. Incremental Adoption
```javascript
// Mix both as needed
import _ from 'lodash';
import { iter } from 'iterflow';

const data = _.cloneDeep(sourceData); // lodash for cloning
const processed = iter(data)          // iterflow for pipeline
  .filter(condition)
  .map(transform)
  .toArray();
```

## Conclusion

Both libraries have their strengths:

- **Lodash** excels as a comprehensive utility library for array and object manipulation with immediate results
- **iterflow** excels at lazy, memory-efficient data transformation pipelines with advanced statistical operations

They can coexist in the same project, each handling what it does best. For many modern applications dealing with data streams, pipelines, and statistical analysis, iterflow provides significant benefits in terms of performance and memory usage.
