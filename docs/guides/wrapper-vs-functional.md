# Wrapper vs Functional API Decision Guide

IterFlow provides two complementary APIs for working with iterators: a fluent wrapper API and a functional (curried) API. This guide helps you choose the right one for your use case.

## Table of Contents

- [API Overview](#api-overview)
- [Quick Comparison](#quick-comparison)
- [When to Use Wrapper API](#when-to-use-wrapper-api)
- [When to Use Functional API](#when-to-use-functional-api)
- [Mixing Both APIs](#mixing-both-apis)
- [Composition Patterns](#composition-patterns)
- [Performance Considerations](#performance-considerations)
- [Migration Between APIs](#migration-between-apis)

## API Overview

### Wrapper API

The wrapper API uses a fluent, chainable interface where operations are methods:

```typescript
import { iter } from 'iterflow';

const result = iter([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .sum();

console.log(result); // 12
```

**Key characteristics:**
- Chainable methods
- Object-oriented style
- Easy to read and write
- Familiar to JavaScript developers

### Functional API

The functional API uses curried functions that can be composed:

```typescript
import { pipe, filter, map, sum } from 'iterflow/fn';

const result = pipe(
  filter((x: number) => x % 2 === 0),
  map((x: number) => x * 2),
  sum
)([1, 2, 3, 4, 5]);

console.log(result); // 12
```

**Key characteristics:**
- Pure functions
- Curried for partial application
- Composable with `pipe()` and `compose()`
- Functional programming style

## Quick Comparison

| Aspect | Wrapper API | Functional API |
|--------|-------------|----------------|
| **Style** | Object-oriented | Functional |
| **Chainability** | Built-in with `.` | Via `pipe()` or `compose()` |
| **Reusability** | Less direct | Highly reusable |
| **Learning Curve** | Gentle | Steeper |
| **TypeScript** | Excellent inference | Good inference |
| **Composition** | Method chaining | Function composition |
| **Performance** | Identical | Identical |
| **Best For** | Ad-hoc processing | Reusable pipelines |

## When to Use Wrapper API

### ✅ Use Wrapper API For:

#### 1. One-Off Transformations

When you're processing data once and won't reuse the logic:

```typescript
import { iter } from 'iterflow';

// Quick data transformation
function processUserData(users: User[]) {
  return iter(users)
    .filter(u => u.active)
    .map(u => u.email)
    .distinct()
    .toArray();
}
```

#### 2. Exploratory Data Analysis

When you're exploring data and trying different operations:

```typescript
const data = iter(salesData)
  .filter(s => s.amount > 100)
  .map(s => s.category)
  .groupBy(c => c);

// Easy to add/remove operations while exploring
```

#### 3. Readability-First Scenarios

When code readability is the primary concern:

```typescript
// Very clear what's happening step by step
const result = iter(temperatures)
  .window(7)
  .map(week => iter(week).mean())
  .filter(avg => avg !== undefined)
  .map(avg => avg!)
  .toArray();
```

#### 4. Familiar JavaScript Patterns

When working with teams familiar with array methods:

```typescript
// Similar to array methods, easy for JavaScript developers
const doubled = iter(numbers)
  .map(x => x * 2)
  .toArray();

// vs array method
const doubled = numbers.map(x => x * 2);
```

#### 5. Complex Nested Operations

When you need to nest operations within transformations:

```typescript
const result = iter(departments)
  .map(dept => ({
    name: dept.name,
    avgSalary: iter(dept.employees)
      .map(e => e.salary)
      .mean(),
    topPerformer: iter(dept.employees)
      .sortBy((a, b) => b.performance - a.performance)
      .first(),
  }))
  .toArray();
```

## When to Use Functional API

### ✅ Use Functional API For:

#### 1. Reusable Processing Pipelines

When you need to reuse the same logic in multiple places:

```typescript
import { pipe, filter, map, toArray } from 'iterflow/fn';

// Define once, use many times
const processActiveUsers = pipe(
  filter((u: User) => u.active),
  map((u: User) => u.email),
  toArray
);

// Reuse across codebase
const emails1 = processActiveUsers(users1);
const emails2 = processActiveUsers(users2);
const emails3 = processActiveUsers(users3);
```

#### 2. Composable Utilities

When building a library of composable operations:

```typescript
import { pipe, filter, map, take } from 'iterflow/fn';

// Build reusable pieces
const onlyPositive = filter((x: number) => x > 0);
const double = map((x: number) => x * 2);
const firstTen = take(10);

// Compose as needed
const pipeline1 = pipe(onlyPositive, double, firstTen);
const pipeline2 = pipe(onlyPositive, firstTen);
const pipeline3 = pipe(double, firstTen);
```

#### 3. Point-Free Style

When you prefer point-free (tacit) programming:

```typescript
import { pipe, map, filter, sum } from 'iterflow/fn';

// Point-free style - no intermediate variables
const sumOfEvenDoubles = pipe(
  map((x: number) => x * 2),
  filter((x: number) => x % 2 === 0),
  sum
);

const result = sumOfEvenDoubles([1, 2, 3, 4, 5]);
```

#### 4. Dependency Injection

When you need to inject behavior:

```typescript
import { pipe, filter, map } from 'iterflow/fn';

function createProcessor<T, U>(
  predicate: (item: T) => boolean,
  transform: (item: T) => U
) {
  return pipe(
    filter(predicate),
    map(transform),
    toArray
  );
}

// Inject different behaviors
const numberProcessor = createProcessor(
  (x: number) => x > 0,
  (x: number) => x * 2
);

const stringProcessor = createProcessor(
  (s: string) => s.length > 0,
  (s: string) => s.toUpperCase()
);
```

#### 5. Functional Programming Paradigm

When your codebase follows functional programming principles:

```typescript
import { pipe, filter, map, reduce } from 'iterflow/fn';

// Pure functional style
const calculateMetrics = pipe(
  filter((sale: Sale) => sale.completed),
  map((sale: Sale) => sale.amount),
  reduce((acc: Metrics, amount: number) => ({
    total: acc.total + amount,
    count: acc.count + 1,
    average: (acc.total + amount) / (acc.count + 1),
  }), { total: 0, count: 0, average: 0 })
);
```

## Mixing Both APIs

You can combine both APIs in the same codebase:

### Pattern 1: Functional Building Blocks, Wrapper for Application

```typescript
import { pipe, filter, map } from 'iterflow/fn';
import { iter } from 'iterflow';

// Define reusable functional pipelines
const activeUsers = filter((u: User) => u.active);
const userEmails = map((u: User) => u.email);

// Use with wrapper API for specific cases
function processUsers(users: User[]) {
  return iter(users)
    .filter(u => u.active)      // Inline for one-off logic
    .map(u => u.email)
    .distinct()                  // Use wrapper for operations not in pipeline
    .toArray();
}
```

### Pattern 2: Convert Between APIs

```typescript
import { iter } from 'iterflow';
import { pipe, filter, map, toArray } from 'iterflow/fn';

// Start with wrapper
const pipeline = iter(data)
  .filter(x => x > 0)
  .map(x => x * 2);

// Convert to iterable for functional API
const functionalResult = pipe(
  filter((x: number) => x < 100),
  toArray
)(pipeline);

// Or convert functional result back to wrapper
const wrapperResult = iter(functionalResult)
  .take(10)
  .toArray();
```

### Pattern 3: Use Each Where Strongest

```typescript
import { iter } from 'iterflow';
import { pipe, filter, map } from 'iterflow/fn';

// Functional for reusable logic
const processNumbers = pipe(
  filter((x: number) => x > 0),
  map((x: number) => x * 2)
);

// Wrapper for complex one-off operations
function analyze(data: number[]) {
  const processed = Array.from(processNumbers(data));

  return {
    sum: iter(processed).sum(),
    mean: iter(processed).mean(),
    median: iter(processed).median(),
    distribution: iter(processed)
      .groupBy(x => Math.floor(x / 10) * 10),
  };
}
```

## Composition Patterns

### Wrapper API Composition

```typescript
// Extend with custom methods (advanced)
class CustomIterFlow<T> extends IterFlow<T> {
  onlyPositive(this: CustomIterFlow<number>) {
    return this.filter(x => x > 0);
  }

  doubled(this: CustomIterFlow<number>) {
    return this.map(x => x * 2);
  }
}

// Usage
const result = new CustomIterFlow([1, -2, 3, -4, 5])
  .onlyPositive()
  .doubled()
  .toArray();
```

### Functional API Composition

```typescript
import { pipe, compose, filter, map, take } from 'iterflow/fn';

// Left-to-right with pipe
const pipeline1 = pipe(
  filter((x: number) => x > 0),
  map((x: number) => x * 2),
  take(10)
);

// Right-to-left with compose
const pipeline2 = compose(
  take(10),
  map((x: number) => x * 2),
  filter((x: number) => x > 0)
);

// Both produce the same result
const result1 = pipeline1([1, 2, 3]);
const result2 = pipeline2([1, 2, 3]);
```

### Building Complex Pipelines

```typescript
import { pipe, filter, map, flatMap, distinct, take } from 'iterflow/fn';

// Build from smaller pieces
const validItems = filter((x: Item) => x.valid);
const extractTags = flatMap((x: Item) => x.tags);
const uniqueTags = distinct<string>();
const limitResults = take(10);

// Compose into complex pipeline
const getTopTags = pipe(
  validItems,
  extractTags,
  uniqueTags,
  limitResults,
  toArray
);

// Reuse and extend
const getTopTagsUppercase = pipe(
  getTopTags,
  map((tag: string) => tag.toUpperCase())
);
```

## Performance Considerations

Both APIs have **identical performance** - they use the same underlying implementation.

```typescript
import { iter } from 'iterflow';
import { pipe, filter, map, toArray } from 'iterflow/fn';

const data = Array.from({ length: 10000 }, (_, i) => i);

// Wrapper API
const result1 = iter(data)
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .toArray();

// Functional API
const result2 = pipe(
  filter((x: number) => x % 2 === 0),
  map((x: number) => x * 2),
  toArray
)(data);

// Performance is identical - choose based on style preference
```

### Potential Overhead

Minor overhead considerations:

```typescript
// Wrapper: Minimal object creation overhead
iter(data).map(fn).filter(pred).toArray();

// Functional: Minimal function call overhead
pipe(map(fn), filter(pred), toArray)(data);

// Difference is negligible for all practical purposes
```

## Migration Between APIs

### Wrapper to Functional

```typescript
// Before (Wrapper)
function processData(data: number[]) {
  return iter(data)
    .filter(x => x > 0)
    .map(x => x * 2)
    .take(10)
    .toArray();
}

// After (Functional)
import { pipe, filter, map, take, toArray } from 'iterflow/fn';

const processData = pipe(
  filter((x: number) => x > 0),
  map((x: number) => x * 2),
  take(10),
  toArray
);
```

### Functional to Wrapper

```typescript
// Before (Functional)
import { pipe, filter, map } from 'iterflow/fn';

const pipeline = pipe(
  filter((x: number) => x > 0),
  map((x: number) => x * 2)
);

// After (Wrapper)
import { iter } from 'iterflow';

function pipeline(data: Iterable<number>) {
  return iter(data)
    .filter(x => x > 0)
    .map(x => x * 2);
}
```

## Decision Framework

Use this flowchart to decide which API to use:

```
Will this logic be reused in multiple places?
├─ YES
│  └─ Do you prefer functional programming style?
│     ├─ YES → Use Functional API ✅
│     └─ NO → Extract to function with Wrapper API
└─ NO
   └─ Is readability the primary concern?
      ├─ YES → Use Wrapper API ✅
      └─ NO
         └─ Does your team prefer FP?
            ├─ YES → Use Functional API ✅
            └─ NO → Use Wrapper API ✅
```

## Best Practices

### For Wrapper API

```typescript
// ✅ Keep chains readable
const result = iter(data)
  .filter(isValid)
  .map(transform)
  .distinct()
  .toArray();

// ❌ Avoid overly long chains
const result = iter(data)
  .filter(x => x.valid)
  .map(x => x.value)
  .filter(x => x > 0)
  .map(x => x * 2)
  .filter(x => x < 100)
  .map(x => ({ value: x }))
  .distinct()
  .take(10)
  .map(x => x.value);
// Consider breaking this up
```

### For Functional API

```typescript
// ✅ Name your pipelines meaningfully
const activeUserEmails = pipe(
  filter((u: User) => u.active),
  map((u: User) => u.email),
  toArray
);

// ✅ Build from small, reusable pieces
const onlyActive = filter((u: User) => u.active);
const getEmail = map((u: User) => u.email);
const activeUserEmails = pipe(onlyActive, getEmail, toArray);

// ❌ Avoid anonymous complex pipelines
const result = pipe(
  filter((x: any) => /* complex logic */),
  map((x: any) => /* complex logic */),
  // ... many more operations
)(data);
```

## Summary

### Wrapper API - Choose When:
- ✅ Performing one-off transformations
- ✅ Readability is paramount
- ✅ Team prefers OOP style
- ✅ Exploring data interactively
- ✅ Nesting operations within transformations

### Functional API - Choose When:
- ✅ Building reusable pipelines
- ✅ Following functional programming paradigm
- ✅ Composing operations
- ✅ Injecting behavior
- ✅ Prefer point-free style

### Both APIs:
- Have identical performance
- Support full TypeScript inference
- Can be mixed in the same codebase
- Provide the same functionality

**Recommendation:** Start with the **Wrapper API** for its familiarity and readability, then adopt the **Functional API** as you identify reusable patterns.

## Next Steps

- Explore [Common Patterns and Recipes](common-patterns.md) to see both APIs in action
- Read [TypeScript Integration Best Practices](typescript-best-practices.md) for type-safe usage
- Check the [API Reference](../api.md) for complete documentation

Choose the API that fits your style and project needs - there's no wrong choice! 🎯
