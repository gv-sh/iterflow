# IterFlow

Extended iterator utilities for ES2022+ with statistical, windowing, and functional operations. Designed to complement native ES2025 iterator helpers when available.

[![npm version](https://badge.fury.io/js/iterflow.svg)](https://www.npmjs.com/package/iterflow)
[![CI](https://github.com/gv-sh/iterflow/workflows/CI/badge.svg)](https://github.com/gv-sh/iterflow/actions)
[![codecov](https://codecov.io/gh/gv-sh/iterflow/branch/main/graph/badge.svg)](https://codecov.io/gh/gv-sh/iterflow)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tree Shakeable](https://img.shields.io/badge/Tree%20Shakeable-Yes-green.svg)](https://webpack.js.org/guides/tree-shaking/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Lazy evaluation** - Process infinite sequences efficiently
- **Statistical operations** - sum, mean, median, variance, percentile, and more
- **Windowing** - chunk, window, pairwise operations
- **TypeScript-first** - Perfect type inference throughout method chains
- **Tree-shakeable** - Import only what you need
- **Zero dependencies** - Pure JavaScript/TypeScript
- **Dual API** - Wrapper style + functional style
- **Forward compatible** - Works today, ready for ES2025 iterator helpers

## Installation

```bash
npm install iterflow
```

## Quick Start

```typescript
import { iter } from 'iterflow';

// Statistical operations
const numbers = [1, 2, 3, 4, 5];
iter(numbers).sum();     // 15
iter(numbers).mean();    // 3
iter(numbers).median();  // 3

// Windowing operations
iter([1, 2, 3, 4, 5])
  .window(2)
  .toArray();
// [[1,2], [2,3], [3,4], [4,5]]

// Method chaining
iter([1, 2, 3, 4, 5, 6])
  .filter(x => x % 2 === 0)  // [2, 4, 6]
  .map(x => x * 2)           // [4, 8, 12]
  .chunk(2)                  // [[4, 8], [12]]
  .toArray();
```

## API Overview

### Wrapper API (Recommended)

```typescript
import { iter } from 'iterflow';

const result = iter([1, 2, 3, 4, 5])
  .filter(x => x > 2)    // Native iterator method
  .map(x => x * 2)       // Native iterator method
  .sum();                // IterFlow extension

console.log(result); // 18
```

### Functional API

```typescript
import { sum, filter, map, toArray } from 'iterflow/fn';

const data = [1, 2, 3, 4, 5];
const result = sum(map(x => x * 2)(filter(x => x > 2)(data)));

console.log(result); // 18
```

## Statistical Operations

All statistical operations work exclusively with numbers and include proper TypeScript constraints:

```typescript
const numbers = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Basic aggregates
numbers.sum();        // 55
numbers.mean();       // 5.5
numbers.min();        // 1
numbers.max();        // 10
numbers.count();      // 10

// Advanced statistics
numbers.median();     // 5.5
numbers.variance();   // 8.25
numbers.stdDev();     // ~2.87
numbers.percentile(75); // 7.75
```

### Empty Iterator Handling

```typescript
iter([]).sum();        // 0
iter([]).mean();       // undefined
iter([]).min();        // undefined
iter([]).max();        // undefined
```

## Windowing Operations

### Window (Sliding Window)

Creates overlapping windows of a specified size:

```typescript
iter([1, 2, 3, 4, 5])
  .window(3)
  .toArray();
// [[1,2,3], [2,3,4], [3,4,5]]
```

### Chunk (Non-overlapping)

Groups elements into non-overlapping chunks:

```typescript
iter([1, 2, 3, 4, 5])
  .chunk(2)
  .toArray();
// [[1,2], [3,4], [5]]
```

### Pairwise

Creates pairs of consecutive elements (convenience for `window(2)`):

```typescript
iter([1, 2, 3, 4])
  .pairwise()
  .toArray();
// [[1,2], [2,3], [3,4]]
```

## Grouping and Partitioning

### Partition

Splits an iterator into two arrays based on a predicate:

```typescript
const [evens, odds] = iter([1, 2, 3, 4, 5, 6])
  .partition(x => x % 2 === 0);

console.log(evens); // [2, 4, 6]
console.log(odds);  // [1, 3, 5]
```

### GroupBy

Groups elements by a key function:

```typescript
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'vegetable', name: 'carrot' },
  { category: 'fruit', name: 'banana' }
];

const groups = iter(items).groupBy(item => item.category);
// Map {
//   'fruit' => [{ category: 'fruit', name: 'apple' }, { category: 'fruit', name: 'banana' }],
//   'vegetable' => [{ category: 'vegetable', name: 'carrot' }]
// }
```

## Set Operations

### Distinct

Removes duplicates while preserving order:

```typescript
iter([1, 2, 2, 3, 3, 3, 4])
  .distinct()
  .toArray();
// [1, 2, 3, 4]
```

### DistinctBy

Removes duplicates based on a key function:

```typescript
const people = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice Jr' }  // Different name, same id
];

iter(people)
  .distinctBy(person => person.id)
  .toArray();
// [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

## Combining Iterators

### Zip

Combines two iterators element by element:

```typescript
iter.zip([1, 2, 3], ['a', 'b', 'c'])
  .toArray();
// [[1,'a'], [2,'b'], [3,'c']]
```

### ZipWith

Combines two iterators using a custom function:

```typescript
iter.zipWith([1, 2, 3], [4, 5, 6], (a, b) => a + b)
  .toArray();
// [5, 7, 9]
```

## Utility Operations

### Tap (Side Effects)

Executes a function for each element without modifying the stream:

```typescript
iter([1, 2, 3])
  .tap(x => console.log(`Processing: ${x}`))
  .map(x => x * 2)
  .toArray();
// Logs: Processing: 1, Processing: 2, Processing: 3
// Returns: [2, 4, 6]
```

### TakeWhile / DropWhile

```typescript
iter([1, 2, 3, 4, 3, 2, 1])
  .takeWhile(x => x < 4)
  .toArray();
// [1, 2, 3]

iter([1, 2, 3, 4, 5])
  .dropWhile(x => x < 3)
  .toArray();
// [3, 4, 5]
```

## Generator Functions

### Range

Creates numeric sequences:

```typescript
iter.range(5).toArray();           // [0, 1, 2, 3, 4]
iter.range(2, 8).toArray();        // [2, 3, 4, 5, 6, 7]
iter.range(0, 10, 2).toArray();    // [0, 2, 4, 6, 8]
```

### Repeat

Repeats a value:

```typescript
iter.repeat('hello', 3).toArray();  // ['hello', 'hello', 'hello']
iter.repeat(0).take(5).toArray();   // [0, 0, 0, 0, 0] (infinite)
```

## Advanced Examples

### Data Processing Pipeline

```typescript
interface Sale {
  product: string;
  amount: number;
  category: string;
  date: string;
}

const sales: Sale[] = [
  { product: 'Laptop', amount: 1200, category: 'Electronics', date: '2024-01' },
  { product: 'Mouse', amount: 25, category: 'Electronics', date: '2024-01' },
  { product: 'Book', amount: 15, category: 'Books', date: '2024-01' },
  // ... more data
];

// Calculate average electronics sale amount
const electronicsAverage = iter(sales)
  .filter(sale => sale.category === 'Electronics')
  .map(sale => sale.amount)
  .mean();

// Group by category and get top product in each
const topByCategory = iter(sales)
  .groupBy(sale => sale.category)
  .entries()
  .map(([category, sales]) => ({
    category,
    topProduct: iter(sales)
      .max() // Will need custom comparison
  }));
```

### Working with Infinite Sequences

```typescript
// Fibonacci sequence
function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// First 10 even fibonacci numbers
const evenFibs = iter(fibonacci())
  .filter(x => x % 2 === 0)
  .take(10)
  .toArray();

console.log(evenFibs); // [0, 2, 8, 34, 144, 610, 2584, 10946, 46368, 196418]
```

### Time Series Analysis

```typescript
const temperatures = [20, 22, 25, 23, 21, 19, 18, 20, 22, 24, 26, 25];

// Calculate 3-day moving averages
const movingAverages = iter(temperatures)
  .window(3)
  .map(window => iter(window).mean())
  .toArray();

// Find periods of increasing temperature
const increasingPeriods = iter(temperatures)
  .pairwise()
  .map(([prev, curr], index) => ({ index: index + 1, increase: curr > prev }))
  .filter(({ increase }) => increase)
  .toArray();
```

## TypeScript Support

IterFlow is built with TypeScript-first design and provides excellent type inference:

```typescript
// Type is automatically inferred as IterFlow<string>
const strings = iter(['hello', 'world'])
  .map(s => s.toUpperCase())
  .filter(s => s.length > 4);

// Statistical operations are constrained to numbers
const numbers = iter([1, 2, 3]);
numbers.sum();    // ✓ Works
strings.sum();    // ✗ TypeScript error

// Complex type transformations are preserved
interface Person {
  name: string;
  age: number;
}

const adults = iter([
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 17 },
  { name: 'Charlie', age: 30 }
])
  .filter(person => person.age >= 18)  // Still IterFlow<Person>
  .distinctBy(person => person.name);   // Still IterFlow<Person>
```

## Performance

IterFlow uses lazy evaluation, meaning operations are only computed when needed:

```typescript
const expensiveOperation = iter(largeArray)
  .map(heavyComputation)      // Not computed yet
  .filter(complexPredicate)   // Not computed yet
  .take(5);                   // Still not computed

const results = expensiveOperation.toArray(); // Now computed, only for first 5 matches
```

This makes it efficient for processing large datasets or infinite sequences.

## Browser Support

IterFlow requires ES2022+ features including iterators, generators, Map, and Set. For older browser support, use a transpiler like TypeScript or Babel.

When ES2025 iterator helpers become available natively, IterFlow will work alongside them seamlessly as it's designed to extend rather than replace the native functionality.

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details.

- [Report bugs](https://github.com/gv-sh/iterflow/issues/new?template=bug_report.md)
- [Request features](https://github.com/gv-sh/iterflow/issues/new?template=feature_request.md)
- [Submit pull requests](https://github.com/gv-sh/iterflow/pulls)

## Support

- [Documentation](./docs/api.md)
- [Discussions](https://github.com/gv-sh/iterflow/discussions)
- [Issues](https://github.com/gv-sh/iterflow/issues)

## License

MIT

## Changelog

### 0.1.0

- Initial release
- Complete statistical operations suite
- Windowing and grouping operations
- TypeScript type constraints
- Dual API support (wrapper + functional)
- Comprehensive test coverage
