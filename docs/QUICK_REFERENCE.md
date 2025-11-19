# IterFlow Quick Reference

A quick reference guide for the most commonly used IterFlow operations.

## Installation

```bash
npm install iterflow
```

## Import Styles

```typescript
// Wrapper API (fluent/chainable)
import { iter } from 'iterflow';

// Functional API (curried)
import { sum, map, filter } from 'iterflow/fn';
```

---

## Creating Iterators

| Operation | Wrapper API | Functional API | Description |
|-----------|-------------|----------------|-------------|
| **Wrap iterable** | `iter([1,2,3])` | N/A | Create IterFlow from iterable |
| **Range** | `iter.range(5)` | `range(5)` | Numbers 0-4 |
| **Range with start** | `iter.range(2, 5)` | `range(2, 5)` | Numbers 2-4 |
| **Range with step** | `iter.range(0, 10, 2)` | `range(0, 10, 2)` | Even numbers 0-8 |
| **Repeat** | `iter.repeat('x', 3)` | `repeat('x', 3)` | Repeat value n times |

---

## Transformations

| Operation | Wrapper API | Functional API | Example |
|-----------|-------------|----------------|---------|
| **map** | `.map(x => x * 2)` | `map(x => x * 2)` | Transform each element |
| **filter** | `.filter(x => x > 0)` | `filter(x => x > 0)` | Keep matching elements |
| **flatMap** | `.flatMap(x => [x, x])` | `flatMap(x => [x, x])` | Map and flatten |
| **take** | `.take(5)` | `take(5)` | First 5 elements |
| **drop** | `.drop(2)` | `drop(2)` | Skip first 2 elements |
| **takeWhile** | `.takeWhile(x => x < 5)` | `takeWhile(x => x < 5)` | Take until condition fails |
| **dropWhile** | `.dropWhile(x => x < 5)` | `dropWhile(x => x < 5)` | Drop until condition fails |
| **distinct** | `.distinct()` | `distinct(iter)` | Remove duplicates |
| **distinctBy** | `.distinctBy(x => x.id)` | `distinctBy(x => x.id)` | Remove duplicates by key |
| **reverse** | `.reverse()` | `reverse()` | Reverse order ⚠️ buffers |
| **sort** | `.sort()` | `sort(iter)` | Sort ascending ⚠️ buffers |
| **sortBy** | `.sortBy((a,b) => a-b)` | `sortBy((a,b) => a-b)` | Custom sort ⚠️ buffers |

---

## Combining Iterators

| Operation | Wrapper API | Functional API | Description |
|-----------|-------------|----------------|-------------|
| **concat** | `.concat([4,5,6])` | `concat()([1,2],[3,4])` | Chain iterables |
| **zip** | `iter.zip([1,2], ['a','b'])` | `zip([1,2], ['a','b'])` | Pair elements: `[[1,'a'], [2,'b']]` |
| **zipWith** | `iter.zipWith(a, b, (x,y) => x+y)` | `zipWith(a, b, (x,y) => x+y)` | Zip with function |
| **chain** | `iter.chain([1,2], [3,4])` | `chain([1,2], [3,4])` | Sequential concatenation |
| **interleave** | `iter.interleave([1,2], [3,4])` | `interleave([1,2], [3,4])` | Round-robin: `[1,3,2,4]` |
| **merge** | `iter.merge([1,3], [2,4])` | `merge([1,3], [2,4])` | Merge sorted: `[1,2,3,4]` |

---

## Windowing

| Operation | Wrapper API | Functional API | Example |
|-----------|-------------|----------------|---------|
| **window** | `.window(3)` | `window(3)` | Sliding window: `[[1,2,3], [2,3,4], ...]` |
| **chunk** | `.chunk(2)` | `chunk(2)` | Non-overlapping: `[[1,2], [3,4], ...]` |
| **pairwise** | `.pairwise()` | `pairwise(iter)` | Consecutive pairs: `[[1,2], [2,3], ...]` |
| **intersperse** | `.intersperse(',')` | `intersperse(',')` | Insert separator: `['a',',','b',',','c']` |

---

## Statistics (Terminal)

All statistical operations consume the iterator and return a value.

| Operation | Wrapper API | Functional API | Returns |
|-----------|-------------|----------------|---------|
| **sum** | `.sum()` | `sum(iter)` | Total of all numbers |
| **mean** | `.mean()` | `mean(iter)` | Average (or `undefined`) |
| **median** | `.median()` | `median(iter)` | Middle value (or `undefined`) |
| **min** | `.min()` | `min(iter)` | Minimum (or `undefined`) |
| **max** | `.max()` | `max(iter)` | Maximum (or `undefined`) |
| **count** | `.count()` | `count(iter)` | Number of elements |
| **variance** | `.variance()` | `variance(iter)` | Variance (or `undefined`) |
| **stdDev** | `.stdDev()` | `stdDev(iter)` | Standard deviation (or `undefined`) |
| **percentile** | `.percentile(75)` | `percentile(iter, 75)` | Nth percentile (or `undefined`) |
| **quartiles** | `.quartiles()` | `quartiles(iter)` | `{Q1, Q2, Q3}` (or `undefined`) |
| **mode** | `.mode()` | `mode(iter)` | Most frequent values (or `undefined`) |
| **span** | `.span()` | `span(iter)` | Range (max - min) (or `undefined`) |
| **product** | `.product()` | `product(iter)` | Product of all numbers |
| **covariance** | `.covariance(other)` | `covariance(iter1, iter2)` | Covariance (or `undefined`) |
| **correlation** | `.correlation(other)` | `correlation(iter1, iter2)` | Pearson correlation (or `undefined`) |

---

## Grouping (Terminal)

| Operation | Wrapper API | Functional API | Returns |
|-----------|-------------|----------------|---------|
| **partition** | `.partition(x => x > 0)` | `partition(x => x > 0)` | `[passing[], failing[]]` |
| **groupBy** | `.groupBy(x => x.type)` | `groupBy(x => x.type)` | `Map<key, values[]>` |

---

## Terminal Operations

| Operation | Wrapper API | Functional API | Description |
|-----------|-------------|----------------|-------------|
| **toArray** | `.toArray()` | `toArray(iter)` | Collect to array |
| **reduce** | `.reduce((a,x) => a+x, 0)` | `reduce((a,x) => a+x, 0)` | Fold with accumulator |
| **find** | `.find(x => x > 5)` | `find(x => x > 5)` | First matching element |
| **findIndex** | `.findIndex(x => x > 5)` | `findIndex(x => x > 5)` | Index of first match |
| **some** | `.some(x => x > 5)` | `some(x => x > 5)` | Any element matches? |
| **every** | `.every(x => x > 0)` | `every(x => x > 0)` | All elements match? |
| **first** | `.first()` | `first(iter)` | First element (or `undefined`) |
| **first (default)** | `.first(0)` | `first(iter, 0)` | First element (or default) |
| **last** | `.last()` | `last(iter)` | Last element (or `undefined`) |
| **last (default)** | `.last(0)` | `last(iter, 0)` | Last element (or default) |
| **nth** | `.nth(2)` | `nth(2)(iter)` | Element at index (or `undefined`) |
| **isEmpty** | `.isEmpty()` | `isEmpty(iter)` | Is empty? |
| **includes** | `.includes(5)` | `includes(5)(iter)` | Contains value? |

---

## Utility

| Operation | Wrapper API | Functional API | Description |
|-----------|-------------|----------------|-------------|
| **tap** | `.tap(x => console.log(x))` | `tap(x => console.log(x))` | Side effect, no change |
| **scan** | `.scan((a,x) => a+x, 0)` | `scan((a,x) => a+x, 0)` | Running reduce |
| **enumerate** | `.enumerate()` | `enumerate()` | Add index: `[[0,val], [1,val], ...]` |

---

## Common Patterns

### Chain Operations (Wrapper API)
```typescript
iter([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .sum(); // 12
```

### Compose Functions (Functional API)
```typescript
import { sum, map, filter } from 'iterflow/fn';

const evens = filter((x: number) => x % 2 === 0);
const double = map((x: number) => x * 2);

// Manually compose (right to left)
const result = sum(double(evens([1, 2, 3, 4, 5]))); // 12
```

### Data Processing Pipeline
```typescript
iter(dataStream)
  .filter(x => x.isValid)
  .map(x => x.value)
  .distinct()
  .chunk(100)
  .map(batch => processBatch(batch))
  .toArray();
```

### Statistical Analysis
```typescript
const data = iter([1, 2, 3, 4, 5, 6, 7, 8, 9]);

// Get descriptive statistics
const stats = {
  mean: data.mean(),
  median: data.median(),
  stdDev: data.stdDev(),
  quartiles: data.quartiles(),
};
```

### Sliding Window Analysis
```typescript
iter([1, 2, 3, 4, 5])
  .window(3)
  .map(window => window.reduce((a, b) => a + b, 0))
  .toArray(); // [6, 9, 12] - sums of each 3-element window
```

### Group and Aggregate
```typescript
const users = [
  { name: 'Alice', age: 30, dept: 'eng' },
  { name: 'Bob', age: 25, dept: 'eng' },
  { name: 'Charlie', age: 35, dept: 'sales' },
];

const byDept = iter(users)
  .groupBy(u => u.dept);

// Map { 'eng' => [...], 'sales' => [...] }
```

---

## Performance Notes

### Lazy vs. Eager
- **Lazy** (don't consume): `map`, `filter`, `take`, `drop`, `flatMap`, `window`, `chunk`
- **Eager** (consume iterator): all terminal operations, `reverse`, `sort`, `sortBy`

### Memory-Intensive Operations
These buffer all elements in memory:
- `reverse()` - stores all elements
- `sort()` / `sortBy()` - stores all elements
- `median()` / `percentile()` / `quartiles()` - stores all elements
- `toArray()` - stores all elements
- `groupBy()` / `partition()` - stores all elements

### Efficient Alternatives
- Instead of `.toArray().length`, use `.count()`
- Instead of `.toArray()[0]`, use `.first()`
- Instead of chaining multiple sorts, use a single `sortBy()`
- Combine filters: `.filter(x => a && b)` instead of `.filter(a).filter(b)`

---

## Type Safety

IterFlow is fully typed for TypeScript:

```typescript
// Type inference works automatically
const numbers: number[] = iter([1, 2, 3])
  .map(x => x * 2)  // x is inferred as number
  .filter(x => x > 2)
  .toArray();  // Type: number[]

// Statistical operations require number type
iter([1, 2, 3]).sum();  // ✓ OK
iter(['a', 'b']).sum(); // ✗ Type error

// Generic constraints
iter([1, 2, 3]).sort();     // ✓ OK (number)
iter(['a', 'b']).sort();    // ✓ OK (string)
iter([{a: 1}]).sort();      // ✗ Type error
```

---

## Links

- [Full API Documentation](./api.md)
- [GitHub Repository](https://github.com/gv-sh/iterflow)
- [NPM Package](https://www.npmjs.com/package/iterflow)
