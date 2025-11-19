# Getting Started with IterFlow

Welcome to IterFlow! This guide will help you get started with powerful iterator utilities for JavaScript and TypeScript.

## Table of Contents

- [What is IterFlow?](#what-is-iterflow)
- [Installation](#installation)
- [Your First IterFlow Program](#your-first-iterflow-program)
- [Core Concepts](#core-concepts)
- [Basic Operations](#basic-operations)
- [Method Chaining](#method-chaining)
- [Terminal vs Lazy Operations](#terminal-vs-lazy-operations)
- [Next Steps](#next-steps)

## What is IterFlow?

IterFlow is a powerful library that extends JavaScript's native iterators with operations missing from the standard library. It provides:

- **Statistical operations** - Calculate mean, median, variance, and more
- **Windowing operations** - Process data in chunks or sliding windows
- **Lazy evaluation** - Process large datasets efficiently
- **Type safety** - Full TypeScript support with intelligent type inference
- **Composable API** - Chain operations naturally

Think of IterFlow as "lodash for iterators" - it gives you powerful data transformation tools that work efficiently with any iterable data source.

## Installation

Install IterFlow using npm:

```bash
npm install iterflow
```

Or using yarn:

```bash
yarn add iterflow
```

Or using pnpm:

```bash
pnpm add iterflow
```

## Your First IterFlow Program

Let's start with a simple example that demonstrates the power of IterFlow:

```typescript
import { iter } from 'iterflow';

// Calculate the average of even numbers
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const averageOfEvens = iter(numbers)
  .filter(x => x % 2 === 0)  // Keep only even numbers
  .mean();                    // Calculate the mean

console.log(averageOfEvens); // 6
```

That's it! You've just used IterFlow to filter data and calculate a statistical measure in a clean, readable way.

## Core Concepts

### Iterables

IterFlow works with any iterable object in JavaScript:

```typescript
import { iter } from 'iterflow';

// Arrays
iter([1, 2, 3]);

// Strings (iterable over characters)
iter('hello');

// Sets
iter(new Set([1, 2, 3]));

// Maps
iter(new Map([['a', 1], ['b', 2]]));

// Generators
function* numbers() {
  yield 1;
  yield 2;
  yield 3;
}
iter(numbers());
```

### The Wrapper API

The wrapper API is the recommended way to use IterFlow. It provides a fluent, chainable interface:

```typescript
import { iter } from 'iterflow';

const result = iter([1, 2, 3, 4, 5])
  .map(x => x * 2)
  .filter(x => x > 5)
  .toArray();

console.log(result); // [6, 8, 10]
```

### Lazy Evaluation

IterFlow uses lazy evaluation, meaning operations are only computed when needed:

```typescript
import { iter } from 'iterflow';

const pipeline = iter([1, 2, 3, 4, 5])
  .map(x => {
    console.log(`Mapping ${x}`);
    return x * 2;
  })
  .filter(x => {
    console.log(`Filtering ${x}`);
    return x > 5;
  });

// Nothing is logged yet!

const result = pipeline.toArray(); // Now the operations execute
// Logs: Mapping 1, Filtering 2, Mapping 2, Filtering 4, ...
```

## Basic Operations

### Transformation Operations

Transform each element using `map()`:

```typescript
iter([1, 2, 3])
  .map(x => x * 2)
  .toArray();
// [2, 4, 6]
```

Filter elements using `filter()`:

```typescript
iter([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .toArray();
// [2, 4]
```

Take the first N elements:

```typescript
iter([1, 2, 3, 4, 5])
  .take(3)
  .toArray();
// [1, 2, 3]
```

### Statistical Operations

Calculate the sum:

```typescript
iter([1, 2, 3, 4, 5]).sum(); // 15
```

Calculate the mean (average):

```typescript
iter([1, 2, 3, 4, 5]).mean(); // 3
```

Find minimum and maximum:

```typescript
iter([3, 1, 4, 1, 5]).min(); // 1
iter([3, 1, 4, 1, 5]).max(); // 5
```

Calculate the median:

```typescript
iter([1, 2, 3, 4, 5]).median(); // 3
```

### Windowing Operations

Create overlapping windows:

```typescript
iter([1, 2, 3, 4, 5])
  .window(3)
  .toArray();
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

Create non-overlapping chunks:

```typescript
iter([1, 2, 3, 4, 5])
  .chunk(2)
  .toArray();
// [[1, 2], [3, 4], [5]]
```

Create pairs of consecutive elements:

```typescript
iter([1, 2, 3, 4])
  .pairwise()
  .toArray();
// [[1, 2], [2, 3], [3, 4]]
```

## Method Chaining

One of IterFlow's most powerful features is the ability to chain operations:

```typescript
import { iter } from 'iterflow';

const data = [
  { name: 'Alice', age: 25, score: 85 },
  { name: 'Bob', age: 30, score: 92 },
  { name: 'Charlie', age: 25, score: 78 },
  { name: 'David', age: 30, score: 88 },
];

// Find average score of people aged 25
const avgScore = iter(data)
  .filter(person => person.age === 25)
  .map(person => person.score)
  .mean();

console.log(avgScore); // 81.5
```

Complex transformations become readable:

```typescript
const result = iter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .filter(x => x % 2 === 0)      // [2, 4, 6, 8, 10]
  .map(x => x * 2)               // [4, 8, 12, 16, 20]
  .take(3)                       // [4, 8, 12]
  .toArray();

console.log(result); // [4, 8, 12]
```

## Terminal vs Lazy Operations

Understanding the difference between terminal and lazy operations is crucial:

### Lazy Operations

Lazy operations return a new iterator without consuming the source. They're only executed when needed:

```typescript
const lazy = iter([1, 2, 3, 4, 5])
  .map(x => x * 2)     // Lazy
  .filter(x => x > 5); // Lazy

// Nothing has been computed yet!
```

Common lazy operations:
- `map()`, `filter()`, `flatMap()`
- `take()`, `drop()`, `takeWhile()`, `dropWhile()`
- `window()`, `chunk()`, `pairwise()`
- `distinct()`, `distinctBy()`
- `tap()`

### Terminal Operations

Terminal operations consume the iterator and return a final value:

```typescript
const result = iter([1, 2, 3, 4, 5])
  .map(x => x * 2)
  .sum(); // Terminal - executes the entire pipeline

console.log(result); // 30
```

Common terminal operations:
- `toArray()`, `reduce()`
- `sum()`, `mean()`, `median()`, `min()`, `max()`
- `count()`, `isEmpty()`
- `find()`, `some()`, `every()`
- `first()`, `last()`, `nth()`
- `partition()`, `groupBy()`

## Real-World Examples

### Example 1: Processing Sales Data

```typescript
interface Sale {
  product: string;
  amount: number;
  category: string;
}

const sales: Sale[] = [
  { product: 'Laptop', amount: 1200, category: 'Electronics' },
  { product: 'Mouse', amount: 25, category: 'Electronics' },
  { product: 'Book', amount: 15, category: 'Books' },
  { product: 'Keyboard', amount: 75, category: 'Electronics' },
];

// Calculate total electronics sales
const totalElectronics = iter(sales)
  .filter(sale => sale.category === 'Electronics')
  .map(sale => sale.amount)
  .sum();

console.log(totalElectronics); // 1300
```

### Example 2: Temperature Analysis

```typescript
const temperatures = [20, 22, 25, 23, 21, 19, 18, 20, 22, 24, 26, 25];

// Calculate 3-day moving average
const movingAverages = iter(temperatures)
  .window(3)
  .map(window => iter(window).mean())
  .toArray();

console.log(movingAverages);
// [22.33, 23.33, 23, 21, 19.33, 19, 20, 22, 24, 25]
```

### Example 3: Removing Duplicates

```typescript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice' }, // duplicate
  { id: 3, name: 'Charlie' },
];

// Remove duplicates based on id
const uniqueUsers = iter(users)
  .distinctBy(user => user.id)
  .toArray();

console.log(uniqueUsers);
// [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }]
```

## Next Steps

Now that you've learned the basics of IterFlow, you can:

1. **Explore the API** - Check out the [API Reference](../api.md) for all available operations
2. **Learn Best Practices** - Read the [TypeScript Integration Best Practices](typescript-best-practices.md) guide
3. **Optimize Performance** - See the [Performance Optimization Guide](performance-optimization.md)
4. **Migrate Existing Code** - Follow the [Migration Guide](migration-from-arrays.md)
5. **Advanced Patterns** - Explore [Common Patterns and Recipes](common-patterns.md)

## Common Questions

### When should I use IterFlow instead of array methods?

Use IterFlow when:
- You need statistical operations (mean, median, variance, etc.)
- You're working with large datasets or streams
- You want to avoid creating intermediate arrays
- You need windowing operations (chunk, window, pairwise)
- You're working with infinite sequences

### Can I mix IterFlow with native array methods?

Yes! IterFlow works seamlessly with native methods:

```typescript
const result = iter([1, 2, 3, 4, 5])
  .filter(x => x > 2)
  .toArray()  // Convert to array
  .slice(0, 2); // Use native array method

console.log(result); // [3, 4]
```

### Does IterFlow work in the browser?

Yes! IterFlow requires ES2022+ features (iterators, generators, Map, Set). For older browsers, use a transpiler like TypeScript or Babel.

### Is IterFlow compatible with TypeScript?

Absolutely! IterFlow is built with TypeScript and provides excellent type inference throughout method chains.

## Summary

You've learned:

- How to install and import IterFlow
- Core concepts like lazy evaluation and iterables
- Basic transformation, statistical, and windowing operations
- How to chain operations for complex transformations
- The difference between terminal and lazy operations
- Real-world examples and use cases

Happy iterating! 🚀
