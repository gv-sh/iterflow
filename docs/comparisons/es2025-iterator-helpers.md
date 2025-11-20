# Comparison with ES2025 Iterator Helpers

This guide compares iterflow with the proposed ES2025 Iterator Helpers, showing how iterflow extends and complements the native functionality.

## Overview

### ES2025 Iterator Helpers

The [Iterator Helpers proposal](https://github.com/tc39/proposal-iterator-helpers) (Stage 3) adds native methods to JavaScript iterators:

- **Native integration**: Built into the JavaScript engine
- **Standard API**: Will be available in all compliant JavaScript environments
- **Core operations**: Fundamental transformation and terminal operations
- **Performance**: Optimized native implementations

### iterflow

- **Superset of functionality**: Includes ES2025 operations plus extensions
- **Available today**: Works in current JavaScript environments (ES2022+)
- **Forward compatible**: Designed to work alongside ES2025 helpers
- **Extended features**: Statistical operations, windowing, advanced operations

## Philosophy

**iterflow is designed to complement, not replace, ES2025 Iterator Helpers.**

When ES2025 Iterator Helpers become widely available:
- iterflow will delegate basic operations to native implementations
- iterflow will continue to provide extended operations not in the standard
- Your iterflow code will work seamlessly with native iterators

## API Comparison

### Core Methods (Available in Both)

#### map

**ES2025:**
```javascript
[1, 2, 3].values()
  .map(x => x * 2)
  .toArray();
// [2, 4, 6]
```

**iterflow:**
```javascript
import { iter } from 'iterflow';

iter([1, 2, 3])
  .map(x => x * 2)
  .toArray();
// [2, 4, 6]
```

**Compatibility:** ✅ Identical API

#### filter

**ES2025:**
```javascript
[1, 2, 3, 4].values()
  .filter(x => x % 2 === 0)
  .toArray();
// [2, 4]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4])
  .filter(x => x % 2 === 0)
  .toArray();
// [2, 4]
```

**Compatibility:** ✅ Identical API

#### take

**ES2025:**
```javascript
[1, 2, 3, 4, 5].values()
  .take(3)
  .toArray();
// [1, 2, 3]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .take(3)
  .toArray();
// [1, 2, 3]
```

**Compatibility:** ✅ Identical API

#### drop

**ES2025:**
```javascript
[1, 2, 3, 4, 5].values()
  .drop(2)
  .toArray();
// [3, 4, 5]
```

**iterflow:**
```javascript
iter([1, 2, 3, 4, 5])
  .drop(2)
  .toArray();
// [3, 4, 5]
```

**Compatibility:** ✅ Identical API

#### flatMap

**ES2025:**
```javascript
[1, 2, 3].values()
  .flatMap(x => [x, x * 2])
  .toArray();
// [1, 2, 2, 4, 3, 6]
```

**iterflow:**
```javascript
iter([1, 2, 3])
  .flatMap(x => [x, x * 2])
  .toArray();
// [1, 2, 2, 4, 3, 6]
```

**Compatibility:** ✅ Identical API

#### reduce

**ES2025:**
```javascript
[1, 2, 3, 4].values()
  .reduce((acc, x) => acc + x, 0);
// 10
```

**iterflow:**
```javascript
iter([1, 2, 3, 4])
  .reduce((acc, x) => acc + x, 0);
// 10
```

**Compatibility:** ✅ Identical API

#### toArray

**ES2025:**
```javascript
[1, 2, 3].values()
  .map(x => x * 2)
  .toArray();
// [2, 4, 6]
```

**iterflow:**
```javascript
iter([1, 2, 3])
  .map(x => x * 2)
  .toArray();
// [2, 4, 6]
```

**Compatibility:** ✅ Identical API

#### forEach

**ES2025:**
```javascript
[1, 2, 3].values()
  .forEach(x => console.log(x));
```

**iterflow:**
```javascript
// Use for...of or tap
for (const x of iter([1, 2, 3])) {
  console.log(x);
}

// Or use tap for side effects in pipeline
iter([1, 2, 3])
  .tap(x => console.log(x))
  .toArray();
```

**Compatibility:** ⚠️ Use tap() or for...of loop instead

#### some

**ES2025:**
```javascript
[1, 2, 3, 4].values()
  .some(x => x > 3);
// true
```

**iterflow:**
```javascript
iter([1, 2, 3, 4])
  .some(x => x > 3);
// true
```

**Compatibility:** ✅ Identical API

#### every

**ES2025:**
```javascript
[2, 4, 6].values()
  .every(x => x % 2 === 0);
// true
```

**iterflow:**
```javascript
iter([2, 4, 6])
  .every(x => x % 2 === 0);
// true
```

**Compatibility:** ✅ Identical API

#### find

**ES2025:**
```javascript
[1, 2, 3, 4].values()
  .find(x => x > 2);
// 3
```

**iterflow:**
```javascript
iter([1, 2, 3, 4])
  .find(x => x > 2);
// 3
```

**Compatibility:** ✅ Identical API

### Static Helper Methods

#### Iterator.from

**ES2025:**
```javascript
// Convert any iterable to an iterator
const iter = Iterator.from([1, 2, 3]);
```

**iterflow:**
```javascript
// iter() function serves the same purpose
import { iter } from 'iterflow';
const flow = iter([1, 2, 3]);
```

**Compatibility:** ✅ Similar functionality, different name

#### Iterator.range

**ES2025:**
```javascript
// Not yet in the proposal
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

**Compatibility:** ➕ iterflow extension

### Extended Operations (iterflow Only)

These operations extend beyond the ES2025 proposal:

#### Statistical Operations

```javascript
// Not in ES2025 - iterflow provides comprehensive statistics
iter([1, 2, 3, 4, 5]).sum();        // 15
iter([1, 2, 3, 4, 5]).mean();       // 3
iter([1, 2, 3, 4, 5]).median();     // 3
iter([1, 2, 3, 4, 5]).variance();   // 2
iter([1, 2, 3, 4, 5]).stdDev();     // ~1.41
iter([1, 2, 3, 4, 5]).min();        // 1
iter([1, 2, 3, 4, 5]).max();        // 5
iter([1, 2, 3, 4, 5]).percentile(75); // 4

// Advanced statistics
iter([1, 2, 2, 3, 3, 3]).mode();    // [3]
iter([1, 2, 3, 4, 5, 6, 7, 8, 9]).quartiles();
// { Q1: 3, Q2: 5, Q3: 7 }

iter([1, 2, 3, 4, 5]).correlation([2, 4, 6, 8, 10]);
// 1 (perfect positive correlation)

iter([1, 2, 3, 4, 5]).covariance([2, 4, 6, 8, 10]);
// 4
```

#### Windowing Operations

```javascript
// Sliding window - not in ES2025
iter([1, 2, 3, 4, 5])
  .window(3)
  .toArray();
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]

// Chunking - not in ES2025
iter([1, 2, 3, 4, 5])
  .chunk(2)
  .toArray();
// [[1, 2], [3, 4], [5]]

// Pairwise - not in ES2025
iter([1, 2, 3, 4])
  .pairwise()
  .toArray();
// [[1, 2], [2, 3], [3, 4]]
```

#### Set Operations

```javascript
// Distinct - not in ES2025
iter([1, 2, 2, 3, 3, 3, 4])
  .distinct()
  .toArray();
// [1, 2, 3, 4]

// Distinct by key - not in ES2025
iter([{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}, {id: 1, name: 'Charlie'}])
  .distinctBy(x => x.id)
  .toArray();
// [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}]
```

#### Grouping Operations

```javascript
// Partition - not in ES2025
iter([1, 2, 3, 4, 5])
  .partition(x => x % 2 === 0);
// [[2, 4], [1, 3, 5]]

// GroupBy - not in ES2025
iter(['alice', 'bob', 'charlie'])
  .groupBy(name => name.length);
// Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'] }
```

#### Utility Operations

```javascript
// Tap - not in ES2025
iter([1, 2, 3])
  .tap(x => console.log('Processing:', x))
  .map(x => x * 2)
  .toArray();

// TakeWhile - not in ES2025
iter([1, 2, 3, 4, 1, 2])
  .takeWhile(x => x < 4)
  .toArray();
// [1, 2, 3]

// DropWhile - not in ES2025
iter([1, 2, 3, 4, 5])
  .dropWhile(x => x < 3)
  .toArray();
// [3, 4, 5]
```

#### Transformation Operations

```javascript
// Scan - not in ES2025
iter([1, 2, 3, 4])
  .scan((acc, x) => acc + x, 0)
  .toArray();
// [0, 1, 3, 6, 10]

// Enumerate - not in ES2025
iter(['a', 'b', 'c'])
  .enumerate()
  .toArray();
// [[0, 'a'], [1, 'b'], [2, 'c']]

// Intersperse - not in ES2025
iter([1, 2, 3])
  .intersperse(0)
  .toArray();
// [1, 0, 2, 0, 3]

// Reverse - not in ES2025
iter([1, 2, 3, 4, 5])
  .reverse()
  .toArray();
// [5, 4, 3, 2, 1]

// Sort - not in ES2025
iter([3, 1, 4, 1, 5])
  .sort()
  .toArray();
// [1, 1, 3, 4, 5]

// SortBy - not in ES2025
iter([3, 1, 4, 1, 5])
  .sortBy((a, b) => b - a)
  .toArray();
// [5, 4, 3, 1, 1]
```

#### Combining Iterators

```javascript
// Zip - not in ES2025
iter.zip([1, 2, 3], ['a', 'b', 'c'])
  .toArray();
// [[1, 'a'], [2, 'b'], [3, 'c']]

// ZipWith - not in ES2025
iter.zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b)
  .toArray();
// [11, 22, 33]

// Interleave - not in ES2025
iter.interleave([1, 2, 3], [4, 5, 6])
  .toArray();
// [1, 4, 2, 5, 3, 6]

// Merge - not in ES2025
iter.merge([1, 3, 5], [2, 4, 6])
  .toArray();
// [1, 2, 3, 4, 5, 6]

// Chain - not in ES2025
iter.chain([1, 2], [3, 4], [5, 6])
  .toArray();
// [1, 2, 3, 4, 5, 6]
```

#### Generator Functions

```javascript
// Repeat - not in ES2025
iter.repeat('x', 3).toArray();
// ['x', 'x', 'x']

// Infinite repeat
iter.repeat(0).take(5).toArray();
// [0, 0, 0, 0, 0]
```

#### Terminal Operations

```javascript
// Count - not in ES2025
iter([1, 2, 3, 4, 5]).count();
// 5

// First - not in ES2025
iter([1, 2, 3]).first();
// 1

// Last - not in ES2025
iter([1, 2, 3]).last();
// 3

// Nth - not in ES2025
iter([1, 2, 3, 4, 5]).nth(2);
// 3

// IsEmpty - not in ES2025
iter([]).isEmpty();
// true

// Includes - not in ES2025
iter([1, 2, 3]).includes(2);
// true

// FindIndex - not in ES2025
iter([1, 2, 3, 4]).findIndex(x => x > 2);
// 2
```

## Working with Both

When ES2025 Iterator Helpers are available, you can seamlessly mix native and iterflow operations:

```javascript
// Native ES2025 iterator
const nativeIter = [1, 2, 3, 4, 5].values()
  .filter(x => x > 2)
  .map(x => x * 2);

// Wrap with iterflow for extended operations
import { iter } from 'iterflow';

const result = iter(nativeIter)
  .window(2)         // iterflow extension
  .map(([a, b]) => a + b)
  .mean();           // iterflow extension
```

## Migration Path

iterflow is designed for forward compatibility with ES2025:

### Today (Pre-ES2025)

```javascript
import { iter } from 'iterflow';

const result = iter([1, 2, 3, 4, 5])
  .filter(x => x > 2)
  .map(x => x * 2)
  .toArray();
```

### Future (Post-ES2025)

```javascript
// Option 1: Continue using iterflow (recommended)
import { iter } from 'iterflow';

const result = iter([1, 2, 3, 4, 5])
  .filter(x => x > 2)    // Delegated to native
  .map(x => x * 2)       // Delegated to native
  .mean();               // iterflow extension
```

```javascript
// Option 2: Mix native and iterflow
const result = [1, 2, 3, 4, 5].values()
  .filter(x => x > 2)    // Native
  .map(x => x * 2);      // Native

// Wrap for iterflow extensions
import { iter } from 'iterflow';
const stats = iter(result).mean();
```

## Performance Comparison

### Native ES2025 (Future)

- **Pros:**
  - Native implementation optimizations
  - No library overhead
  - Standardized behavior

- **Cons:**
  - Limited to basic operations
  - No statistical functions
  - No windowing operations

### iterflow (Today)

- **Pros:**
  - Available now in all ES2022+ environments
  - Comprehensive feature set
  - Statistical and advanced operations
  - Will delegate to native when available

- **Cons:**
  - Small library overhead (~15KB)
  - Additional dependency

## Feature Matrix

| Feature | ES2025 | iterflow |
|---------|--------|----------|
| map | ✅ | ✅ |
| filter | ✅ | ✅ |
| take | ✅ | ✅ |
| drop | ✅ | ✅ |
| flatMap | ✅ | ✅ |
| reduce | ✅ | ✅ |
| toArray | ✅ | ✅ |
| forEach | ✅ | ⚠️ (use tap) |
| some | ✅ | ✅ |
| every | ✅ | ✅ |
| find | ✅ | ✅ |
| **Extended Operations** |
| sum | ❌ | ✅ |
| mean | ❌ | ✅ |
| median | ❌ | ✅ |
| variance | ❌ | ✅ |
| stdDev | ❌ | ✅ |
| percentile | ❌ | ✅ |
| min | ❌ | ✅ |
| max | ❌ | ✅ |
| mode | ❌ | ✅ |
| quartiles | ❌ | ✅ |
| correlation | ❌ | ✅ |
| covariance | ❌ | ✅ |
| window | ❌ | ✅ |
| chunk | ❌ | ✅ |
| pairwise | ❌ | ✅ |
| distinct | ❌ | ✅ |
| distinctBy | ❌ | ✅ |
| partition | ❌ | ✅ |
| groupBy | ❌ | ✅ |
| tap | ❌ | ✅ |
| takeWhile | ❌ | ✅ |
| dropWhile | ❌ | ✅ |
| scan | ❌ | ✅ |
| enumerate | ❌ | ✅ |
| intersperse | ❌ | ✅ |
| reverse | ❌ | ✅ |
| sort | ❌ | ✅ |
| sortBy | ❌ | ✅ |
| zip | ❌ | ✅ |
| zipWith | ❌ | ✅ |
| interleave | ❌ | ✅ |
| merge | ❌ | ✅ |
| chain | ❌ | ✅ |
| range | ❌ | ✅ |
| repeat | ❌ | ✅ |
| count | ❌ | ✅ |
| first | ❌ | ✅ |
| last | ❌ | ✅ |
| nth | ❌ | ✅ |
| isEmpty | ❌ | ✅ |
| includes | ❌ | ✅ |
| findIndex | ❌ | ✅ |

## Use Case Recommendations

### Use ES2025 Iterator Helpers (when available) for:

- Basic transformations (map, filter)
- Standard iterator operations
- When you don't need additional features
- Maximum compatibility with native APIs
- Zero dependencies

### Use iterflow for:

- Statistical analysis and data science
- Advanced data transformations
- Windowing and chunking operations
- Complex data pipelines
- Memory-efficient processing of large datasets
- Working with infinite sequences
- Today, before ES2025 is widely available

### Use Both Together:

```javascript
// Best of both worlds
import { iter } from 'iterflow';

// Start with native iterator
const data = [1, 2, 3, 4, 5].values()
  .filter(x => x > 2)     // Native
  .map(x => x * 2);       // Native

// Wrap for advanced operations
const stats = {
  mean: iter(data).mean(),
  median: iter(data).median(),
  stdDev: iter(data).stdDev()
};

// Or use in pipeline
const result = iter(nativeIterator)
  .window(3)           // iterflow
  .map(window =>
    iter(window).sum() // iterflow
  )
  .toArray();
```

## Conclusion

iterflow and ES2025 Iterator Helpers are complementary:

- **ES2025 Iterator Helpers** provide the foundational iterator operations that will be built into JavaScript
- **iterflow** extends these operations with statistical analysis, windowing, and advanced transformations

iterflow is designed to:
1. Work seamlessly **today** in ES2022+ environments
2. **Complement** ES2025 Iterator Helpers when they become available
3. Provide **extended functionality** not planned for the standard
4. Maintain **API compatibility** with the ES2025 proposal

For applications that need more than basic iteration, especially those involving data analysis, statistics, or complex transformations, iterflow provides essential functionality that will remain valuable even after ES2025 Iterator Helpers are widely adopted.
