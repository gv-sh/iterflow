# IterFlow API Reference

Complete API documentation for iterflow - a powerful iterator utility library for JavaScript/TypeScript.

## Table of Contents

- [API Styles](#api-styles)
  - [Wrapper API](#wrapper-api)
  - [Functional API](#functional-api)
- [Creating Iterators](#creating-iterators)
  - [iter()](#iter)
  - [iter.range()](#iterrange)
  - [iter.repeat()](#iterrepeat)
- [Combining Iterators](#combining-iterators)
  - [iter.zip()](#iterzip)
  - [iter.zipWith()](#iterzipwith)
  - [iter.chain()](#iterchain)
  - [iter.interleave()](#iterinterleave)
  - [iter.merge()](#itermerge)
- [Transformation Methods](#transformation-methods)
  - [map()](#map)
  - [filter()](#filter)
  - [flatMap()](#flatmap)
  - [take()](#take)
  - [drop()](#drop)
  - [concat()](#concat)
  - [intersperse()](#intersperse)
  - [scan()](#scan)
  - [enumerate()](#enumerate)
  - [reverse()](#reverse)
  - [sort()](#sort)
  - [sortBy()](#sortby)
- [Windowing Operations](#windowing-operations)
  - [window()](#window)
  - [chunk()](#chunk)
  - [pairwise()](#pairwise)
- [Statistical Operations](#statistical-operations)
  - [sum()](#sum)
  - [mean()](#mean)
  - [min()](#min)
  - [max()](#max)
  - [count()](#count)
  - [median()](#median)
  - [variance()](#variance)
  - [stdDev()](#stddev)
  - [percentile()](#percentile)
  - [mode()](#mode)
  - [quartiles()](#quartiles)
  - [span()](#span)
  - [product()](#product)
  - [covariance()](#covariance)
  - [correlation()](#correlation)
- [Set Operations](#set-operations)
  - [distinct()](#distinct)
  - [distinctBy()](#distinctby)
- [Grouping Operations](#grouping-operations)
  - [partition()](#partition)
  - [groupBy()](#groupby)
- [Utility Operations](#utility-operations)
  - [tap()](#tap)
  - [takeWhile()](#takewhile)
  - [dropWhile()](#dropwhile)
- [Terminal Operations](#terminal-operations)
  - [toArray()](#toarray)
  - [reduce()](#reduce)
  - [find()](#find)
  - [findIndex()](#findindex)
  - [some()](#some)
  - [every()](#every)
  - [first()](#first)
  - [last()](#last)
  - [nth()](#nth)
  - [isEmpty()](#isempty)
  - [includes()](#includes)

---

## API Styles

IterFlow provides two complementary API styles: a fluent wrapper API and a functional API.

### Wrapper API

The wrapper API provides a fluent, chainable interface:

```typescript
import { iter } from 'iterflow';

const result = iter([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .sum();

console.log(result); // 12
```

### Functional API

The functional API provides curried functions for composition:

```typescript
import { sum, map, filter, toArray } from 'iterflow/fn';

const data = [1, 2, 3, 4, 5];
const result = sum(map(x => x * 2)(filter(x => x % 2 === 0)(data)));

console.log(result); // 12
```

---

## Creating Iterators

### iter()

Creates an IterFlow instance from an iterable.

**Signature:**
```typescript
function iter<T>(source: Iterable<T>): IterFlow<T>
```

**Parameters:**
- `source: Iterable<T>` - The iterable to wrap

**Returns:** `IterFlow<T>` - A new IterFlow instance

**Example:**
```typescript
iter([1, 2, 3, 4, 5])
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .toArray(); // [4, 8]
```

---

### iter.range()

Generates a sequence of numbers.

**Signatures:**
```typescript
function range(stop: number): IterFlow<number>
function range(start: number, stop: number): IterFlow<number>
function range(start: number, stop: number, step: number): IterFlow<number>
```

**Parameters:**
- `stop: number` - The end value (exclusive) when called with one argument
- `start: number` - The starting value (inclusive)
- `step: number` - The increment between values (default: 1)

**Returns:** `IterFlow<number>` - A new IterFlow of numbers

**Throws:** `Error` if step is zero

**Examples:**
```typescript
iter.range(5).toArray();
// [0, 1, 2, 3, 4]

iter.range(2, 5).toArray();
// [2, 3, 4]

iter.range(0, 10, 2).toArray();
// [0, 2, 4, 6, 8]

iter.range(5, 0, -1).toArray();
// [5, 4, 3, 2, 1]
```

**Functional API:**
```typescript
import { range, toArray } from 'iterflow/fn';

Array.from(range(5)); // [0, 1, 2, 3, 4]
Array.from(range(2, 8)); // [2, 3, 4, 5, 6, 7]
```

---

### iter.repeat()

Repeats a value a specified number of times, or infinitely.

**Signature:**
```typescript
function repeat<T>(value: T, times?: number): IterFlow<T>
```

**Parameters:**
- `value: T` - The value to repeat
- `times?: number` - Optional number of times to repeat (infinite if omitted)

**Returns:** `IterFlow<T>` - A new IterFlow repeating the value

**Examples:**
```typescript
iter.repeat('x', 3).toArray();
// ['x', 'x', 'x']

iter.repeat(0, 5).toArray();
// [0, 0, 0, 0, 0]

iter.repeat(1).take(3).toArray();
// [1, 1, 1] (infinite, limited by take)
```

**Functional API:**
```typescript
import { repeat } from 'iterflow/fn';

Array.from(repeat('hello', 3)); // ['hello', 'hello', 'hello']
```

---

## Combining Iterators

### iter.zip()

Combines two iterables into an iterator of tuples. Stops when the shorter iterable is exhausted.

**Signature:**
```typescript
function zip<T, U>(
  iter1: Iterable<T>,
  iter2: Iterable<U>
): IterFlow<[T, U]>
```

**Parameters:**
- `iter1: Iterable<T>` - The first iterable
- `iter2: Iterable<U>` - The second iterable

**Returns:** `IterFlow<[T, U]>` - A new IterFlow of tuples

**Example:**
```typescript
iter.zip([1, 2, 3], ['a', 'b', 'c']).toArray();
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

**Functional API:**
```typescript
import { zip } from 'iterflow/fn';

Array.from(zip([1, 2, 3], ['a', 'b', 'c']));
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

---

### iter.zipWith()

Combines two iterables using a combining function.

**Signature:**
```typescript
function zipWith<T, U, R>(
  iter1: Iterable<T>,
  iter2: Iterable<U>,
  fn: (a: T, b: U) => R
): IterFlow<R>
```

**Parameters:**
- `iter1: Iterable<T>` - The first iterable
- `iter2: Iterable<U>` - The second iterable
- `fn: (a: T, b: U) => R` - Function to combine elements

**Returns:** `IterFlow<R>` - A new IterFlow with combined results

**Example:**
```typescript
iter.zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b).toArray();
// [11, 22, 33]
```

**Functional API:**
```typescript
import { zipWith } from 'iterflow/fn';

Array.from(zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b));
// [11, 22, 33]
```

---

### iter.chain()

Chains multiple iterables sequentially, one after another.

**Signature:**
```typescript
function chain<T>(...iterables: Iterable<T>[]): IterFlow<T>
```

**Parameters:**
- `iterables: Iterable<T>[]` - Variable number of iterables to chain

**Returns:** `IterFlow<T>` - A new IterFlow with all elements chained

**Examples:**
```typescript
iter.chain([1, 2], [3, 4], [5, 6]).toArray();
// [1, 2, 3, 4, 5, 6]

iter.chain([1], [2, 3], [], [4, 5, 6]).toArray();
// [1, 2, 3, 4, 5, 6]
```

**Functional API:**
```typescript
import { chain } from 'iterflow/fn';

Array.from(chain([1, 2], [3, 4], [5, 6]));
// [1, 2, 3, 4, 5, 6]
```

---

### iter.interleave()

Alternates elements from multiple iterables in a round-robin fashion. Continues until all iterables are exhausted.

**Signature:**
```typescript
function interleave<T>(...iterables: Iterable<T>[]): IterFlow<T>
```

**Parameters:**
- `iterables: Iterable<T>[]` - Variable number of iterables to interleave

**Returns:** `IterFlow<T>` - A new IterFlow with elements interleaved

**Examples:**
```typescript
iter.interleave([1, 2, 3], [4, 5, 6]).toArray();
// [1, 4, 2, 5, 3, 6]

iter.interleave([1, 2], [3, 4, 5], [6]).toArray();
// [1, 3, 6, 2, 4, 5]
```

**Functional API:**
```typescript
import { interleave } from 'iterflow/fn';

Array.from(interleave([1, 2, 3], [4, 5, 6]));
// [1, 4, 2, 5, 3, 6]
```

---

### iter.merge()

Merges multiple sorted iterables into a single sorted iterator. Assumes input iterables are already sorted.

**Signatures:**
```typescript
function merge<T>(...iterables: Iterable<T>[]): IterFlow<T>
function merge<T>(
  compareFn: (a: T, b: T) => number,
  ...iterables: Iterable<T>[]
): IterFlow<T>
```

**Parameters:**
- `compareFn?: (a: T, b: T) => number` - Optional comparison function
- `iterables: Iterable<T>[]` - Variable number of sorted iterables to merge

**Returns:** `IterFlow<T>` - A new IterFlow with all elements merged in sorted order

**Examples:**
```typescript
iter.merge([1, 3, 5], [2, 4, 6]).toArray();
// [1, 2, 3, 4, 5, 6]

iter.merge([1, 5, 9], [2, 6, 10], [3, 7, 11]).toArray();
// [1, 2, 3, 5, 6, 7, 9, 10, 11]

// With custom comparator for descending order
iter.merge((a, b) => b - a, [9, 5, 1], [10, 6, 2]).toArray();
// [10, 9, 6, 5, 2, 1]
```

**Functional API:**
```typescript
import { merge } from 'iterflow/fn';

Array.from(merge([1, 3, 5], [2, 4, 6]));
// [1, 2, 3, 4, 5, 6]
```

---

## Transformation Methods

### map()

Transforms each element using the provided function.

**Signature:**
```typescript
map<U>(fn: (value: T) => U): IterFlow<U>
```

**Parameters:**
- `fn: (value: T) => U` - Function to transform each element

**Returns:** `IterFlow<U>` - A new IterFlow with transformed elements

**Example:**
```typescript
iter([1, 2, 3]).map(x => x * 2).toArray();
// [2, 4, 6]
```

**Functional API:**
```typescript
import { map } from 'iterflow/fn';

const double = map((x: number) => x * 2);
Array.from(double([1, 2, 3])); // [2, 4, 6]
```

---

### filter()

Filters elements based on a predicate function.

**Signature:**
```typescript
filter(predicate: (value: T) => boolean): IterFlow<T>
```

**Parameters:**
- `predicate: (value: T) => boolean` - Function to test each element

**Returns:** `IterFlow<T>` - A new IterFlow with only passing elements

**Example:**
```typescript
iter([1, 2, 3, 4]).filter(x => x % 2 === 0).toArray();
// [2, 4]
```

**Functional API:**
```typescript
import { filter } from 'iterflow/fn';

const evens = filter((x: number) => x % 2 === 0);
Array.from(evens([1, 2, 3, 4])); // [2, 4]
```

---

### flatMap()

Maps each element to an iterable and flattens the results.

**Signature:**
```typescript
flatMap<U>(fn: (value: T) => Iterable<U>): IterFlow<U>
```

**Parameters:**
- `fn: (value: T) => Iterable<U>` - Function that maps each element to an iterable

**Returns:** `IterFlow<U>` - A new IterFlow with all mapped iterables flattened

**Example:**
```typescript
iter([1, 2, 3]).flatMap(x => [x, x * 2]).toArray();
// [1, 2, 2, 4, 3, 6]
```

**Functional API:**
```typescript
import { flatMap } from 'iterflow/fn';

const duplicateEach = flatMap((x: number) => [x, x * 2]);
Array.from(duplicateEach([1, 2, 3])); // [1, 2, 2, 4, 3, 6]
```

---

### take()

Takes only the first `limit` elements from the iterator.

**Signature:**
```typescript
take(limit: number): IterFlow<T>
```

**Parameters:**
- `limit: number` - Maximum number of elements to take

**Returns:** `IterFlow<T>` - A new IterFlow with at most `limit` elements

**Example:**
```typescript
iter([1, 2, 3, 4, 5]).take(3).toArray();
// [1, 2, 3]
```

**Functional API:**
```typescript
import { take } from 'iterflow/fn';

const takeThree = take(3);
Array.from(takeThree([1, 2, 3, 4, 5])); // [1, 2, 3]
```

---

### drop()

Skips the first `count` elements from the iterator.

**Signature:**
```typescript
drop(count: number): IterFlow<T>
```

**Parameters:**
- `count: number` - Number of elements to skip

**Returns:** `IterFlow<T>` - A new IterFlow without the first `count` elements

**Example:**
```typescript
iter([1, 2, 3, 4, 5]).drop(2).toArray();
// [3, 4, 5]
```

**Functional API:**
```typescript
import { drop } from 'iterflow/fn';

const dropTwo = drop(2);
Array.from(dropTwo([1, 2, 3, 4, 5])); // [3, 4, 5]
```

---

### concat()

Concatenates multiple iterators sequentially.

**Signature:**
```typescript
concat(...iterables: Iterable<T>[]): IterFlow<T>
```

**Parameters:**
- `iterables: Iterable<T>[]` - Additional iterables to concatenate

**Returns:** `IterFlow<T>` - A new IterFlow with all elements

**Example:**
```typescript
iter([1, 2]).concat([3, 4], [5, 6]).toArray();
// [1, 2, 3, 4, 5, 6]
```

**Functional API:**
```typescript
import { concat } from 'iterflow/fn';

const concatAll = concat<number>();
Array.from(concatAll([1, 2], [3, 4], [5, 6]));
// [1, 2, 3, 4, 5, 6]
```

---

### intersperse()

Inserts a separator element between each item.

**Signature:**
```typescript
intersperse(separator: T): IterFlow<T>
```

**Parameters:**
- `separator: T` - The element to insert between items

**Returns:** `IterFlow<T>` - A new IterFlow with separators interspersed

**Examples:**
```typescript
iter([1, 2, 3]).intersperse(0).toArray();
// [1, 0, 2, 0, 3]

iter(['a', 'b', 'c']).intersperse('-').toArray();
// ['a', '-', 'b', '-', 'c']
```

**Functional API:**
```typescript
import { intersperse } from 'iterflow/fn';

const addCommas = intersperse(',');
Array.from(addCommas(['a', 'b', 'c']));
// ['a', ',', 'b', ',', 'c']
```

---

### scan()

Like reduce, but emits all intermediate accumulator values.

**Signature:**
```typescript
scan<U>(fn: (accumulator: U, value: T) => U, initial: U): IterFlow<U>
```

**Parameters:**
- `fn: (accumulator: U, value: T) => U` - Function to combine accumulator with each element
- `initial: U` - The initial value for the accumulator

**Returns:** `IterFlow<U>` - A new IterFlow of intermediate accumulator values

**Examples:**
```typescript
iter([1, 2, 3, 4]).scan((acc, x) => acc + x, 0).toArray();
// [0, 1, 3, 6, 10]

iter([1, 2, 3]).scan((acc, x) => acc * x, 1).toArray();
// [1, 1, 2, 6]
```

**Functional API:**
```typescript
import { scan } from 'iterflow/fn';

const runningSum = scan((acc: number, x: number) => acc + x, 0);
Array.from(runningSum([1, 2, 3, 4]));
// [0, 1, 3, 6, 10]
```

---

### enumerate()

Adds index as tuple with each element [index, value].

**Signature:**
```typescript
enumerate(): IterFlow<[number, T]>
```

**Returns:** `IterFlow<[number, T]>` - A new IterFlow of tuples containing [index, value]

**Example:**
```typescript
iter(['a', 'b', 'c']).enumerate().toArray();
// [[0, 'a'], [1, 'b'], [2, 'c']]
```

**Functional API:**
```typescript
import { enumerate } from 'iterflow/fn';

const enumerateItems = enumerate<string>();
Array.from(enumerateItems(['a', 'b', 'c']));
// [[0, 'a'], [1, 'b'], [2, 'c']]
```

---

### reverse()

Reverses the iterator order.

**Signature:**
```typescript
reverse(): IterFlow<T>
```

**Returns:** `IterFlow<T>` - A new IterFlow with elements in reverse order

**Warning:** This operation buffers all elements in memory and may cause performance issues with large iterables.

**Example:**
```typescript
iter([1, 2, 3, 4, 5]).reverse().toArray();
// [5, 4, 3, 2, 1]
```

**Functional API:**
```typescript
import { reverse } from 'iterflow/fn';

const reverseItems = reverse<number>();
Array.from(reverseItems([1, 2, 3, 4, 5]));
// [5, 4, 3, 2, 1]
```

---

### sort()

Sorts elements using default comparison. Numbers are sorted numerically, strings lexicographically.

**Signature:**
```typescript
sort(this: IterFlow<number | string>): IterFlow<number | string>
```

**Returns:** `IterFlow<number | string>` - A new IterFlow with elements sorted

**Warning:** This operation buffers all elements in memory. Avoid chaining with other buffering operations.

**Examples:**
```typescript
iter([3, 1, 4, 1, 5]).sort().toArray();
// [1, 1, 3, 4, 5]

iter(['c', 'a', 'b']).sort().toArray();
// ['a', 'b', 'c']
```

**Functional API:**
```typescript
import { sort } from 'iterflow/fn';

Array.from(sort([3, 1, 4, 1, 5]));
// [1, 1, 3, 4, 5]
```

---

### sortBy()

Sorts elements using a custom comparison function.

**Signature:**
```typescript
sortBy(compareFn: (a: T, b: T) => number): IterFlow<T>
```

**Parameters:**
- `compareFn: (a: T, b: T) => number` - Function that compares two elements

**Returns:** `IterFlow<T>` - A new IterFlow with elements sorted

**Warning:** This operation buffers all elements in memory.

**Examples:**
```typescript
iter([3, 1, 4, 1, 5]).sortBy((a, b) => a - b).toArray();
// [1, 1, 3, 4, 5]

iter([3, 1, 4, 1, 5]).sortBy((a, b) => b - a).toArray();
// [5, 4, 3, 1, 1]

iter(['alice', 'bob', 'charlie']).sortBy((a, b) => a.length - b.length).toArray();
// ['bob', 'alice', 'charlie']
```

**Functional API:**
```typescript
import { sortBy } from 'iterflow/fn';

const sortAsc = sortBy((a: number, b: number) => a - b);
Array.from(sortAsc([3, 1, 4, 1, 5]));
// [1, 1, 3, 4, 5]
```

---

## Windowing Operations

### window()

Creates a sliding window of the specified size over the elements.

**Signature:**
```typescript
window(size: number): IterFlow<T[]>
```

**Parameters:**
- `size: number` - The size of each window (must be at least 1)

**Returns:** `IterFlow<T[]>` - A new IterFlow of arrays, each containing `size` consecutive elements

**Throws:** `Error` if size is less than 1

**Example:**
```typescript
iter([1, 2, 3, 4, 5]).window(3).toArray();
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

**Functional API:**
```typescript
import { window } from 'iterflow/fn';

const windowThree = window(3);
Array.from(windowThree([1, 2, 3, 4, 5]));
// [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
```

---

### chunk()

Splits elements into chunks of the specified size. Unlike window, chunks don't overlap.

**Signature:**
```typescript
chunk(size: number): IterFlow<T[]>
```

**Parameters:**
- `size: number` - The size of each chunk (must be at least 1)

**Returns:** `IterFlow<T[]>` - A new IterFlow of arrays, each containing up to `size` elements

**Throws:** `Error` if size is less than 1

**Example:**
```typescript
iter([1, 2, 3, 4, 5]).chunk(2).toArray();
// [[1, 2], [3, 4], [5]]
```

**Functional API:**
```typescript
import { chunk } from 'iterflow/fn';

const chunkTwo = chunk(2);
Array.from(chunkTwo([1, 2, 3, 4, 5]));
// [[1, 2], [3, 4], [5]]
```

---

### pairwise()

Creates pairs of consecutive elements. Equivalent to window(2).

**Signature:**
```typescript
pairwise(): IterFlow<[T, T]>
```

**Returns:** `IterFlow<[T, T]>` - A new IterFlow of tuples containing consecutive elements

**Example:**
```typescript
iter([1, 2, 3, 4]).pairwise().toArray();
// [[1, 2], [2, 3], [3, 4]]
```

**Functional API:**
```typescript
import { pairwise } from 'iterflow/fn';

Array.from(pairwise([1, 2, 3, 4]));
// [[1, 2], [2, 3], [3, 4]]
```

---

## Statistical Operations

All statistical operations work exclusively with numbers and include proper TypeScript constraints.

### sum()

Calculates the sum of all numeric elements. This is a terminal operation.

**Signature:**
```typescript
sum(this: IterFlow<number>): number
```

**Returns:** `number` - The sum of all elements

**Example:**
```typescript
iter([1, 2, 3, 4, 5]).sum(); // 15
```

**Functional API:**
```typescript
import { sum } from 'iterflow/fn';

sum([1, 2, 3, 4, 5]); // 15
```

---

### mean()

Calculates the arithmetic mean (average) of all numeric elements. This is a terminal operation.

**Signature:**
```typescript
mean(this: IterFlow<number>): number | undefined
```

**Returns:** `number | undefined` - The mean value, or undefined if empty

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).mean(); // 3
iter([]).mean(); // undefined
```

**Functional API:**
```typescript
import { mean } from 'iterflow/fn';

mean([1, 2, 3, 4, 5]); // 3
mean([]); // undefined
```

---

### min()

Finds the minimum value among all numeric elements. This is a terminal operation.

**Signature:**
```typescript
min(this: IterFlow<number>): number | undefined
```

**Returns:** `number | undefined` - The minimum value, or undefined if empty

**Examples:**
```typescript
iter([3, 1, 4, 1, 5]).min(); // 1
iter([]).min(); // undefined
```

**Functional API:**
```typescript
import { min } from 'iterflow/fn';

min([3, 1, 4, 1, 5]); // 1
```

---

### max()

Finds the maximum value among all numeric elements. This is a terminal operation.

**Signature:**
```typescript
max(this: IterFlow<number>): number | undefined
```

**Returns:** `number | undefined` - The maximum value, or undefined if empty

**Examples:**
```typescript
iter([3, 1, 4, 1, 5]).max(); // 5
iter([]).max(); // undefined
```

**Functional API:**
```typescript
import { max } from 'iterflow/fn';

max([3, 1, 4, 1, 5]); // 5
```

---

### count()

Counts the total number of elements. This is a terminal operation.

**Signature:**
```typescript
count(): number
```

**Returns:** `number` - The total count of elements

**Example:**
```typescript
iter([1, 2, 3, 4, 5]).count(); // 5
```

**Functional API:**
```typescript
import { count } from 'iterflow/fn';

count([1, 2, 3, 4, 5]); // 5
```

---

### median()

Calculates the median value of all numeric elements. This is a terminal operation.

**Signature:**
```typescript
median(this: IterFlow<number>): number | undefined
```

**Returns:** `number | undefined` - The median value, or undefined if empty

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).median(); // 3
iter([1, 2, 3, 4]).median(); // 2.5
iter([]).median(); // undefined
```

**Functional API:**
```typescript
import { median } from 'iterflow/fn';

median([1, 2, 3, 4, 5]); // 3
median([1, 2, 3, 4]); // 2.5
```

---

### variance()

Calculates the variance of all numeric elements. This is a terminal operation.

**Signature:**
```typescript
variance(this: IterFlow<number>): number | undefined
```

**Returns:** `number | undefined` - The variance, or undefined if empty

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).variance(); // 2
iter([]).variance(); // undefined
```

**Functional API:**
```typescript
import { variance } from 'iterflow/fn';

variance([1, 2, 3, 4, 5]); // 2
```

---

### stdDev()

Calculates the standard deviation of all numeric elements. This is a terminal operation.

**Signature:**
```typescript
stdDev(this: IterFlow<number>): number | undefined
```

**Returns:** `number | undefined` - The standard deviation, or undefined if empty

**Examples:**
```typescript
iter([2, 4, 4, 4, 5, 5, 7, 9]).stdDev(); // ~2
iter([]).stdDev(); // undefined
```

**Functional API:**
```typescript
import { stdDev } from 'iterflow/fn';

stdDev([2, 4, 4, 4, 5, 5, 7, 9]); // ~2
```

---

### percentile()

Calculates the specified percentile of all numeric elements. Uses linear interpolation. This is a terminal operation.

**Signature:**
```typescript
percentile(this: IterFlow<number>, p: number): number | undefined
```

**Parameters:**
- `p: number` - The percentile to calculate (0-100)

**Returns:** `number | undefined` - The percentile value, or undefined if empty

**Throws:** `Error` if p is not between 0 and 100

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).percentile(50); // 3 (median)
iter([1, 2, 3, 4, 5]).percentile(75); // 4
iter([]).percentile(50); // undefined
```

**Functional API:**
```typescript
import { percentile } from 'iterflow/fn';

percentile([1, 2, 3, 4, 5], 50); // 3
percentile([1, 2, 3, 4, 5], 75); // 4
```

---

### mode()

Finds the most frequent value(s) in the dataset. This is a terminal operation.

**Signature:**
```typescript
mode(this: IterFlow<number>): number[] | undefined
```

**Returns:** `number[] | undefined` - Array of most frequent values, or undefined if empty

**Examples:**
```typescript
iter([1, 2, 2, 3, 3, 3]).mode(); // [3]
iter([1, 1, 2, 2, 3]).mode(); // [1, 2] (bimodal)
iter([]).mode(); // undefined
```

**Functional API:**
```typescript
import { mode } from 'iterflow/fn';

mode([1, 2, 2, 3, 3, 3]); // [3]
mode([1, 1, 2, 2, 3]); // [1, 2]
```

---

### quartiles()

Calculates the quartiles (Q1, Q2, Q3) of all numeric elements. This is a terminal operation.

**Signature:**
```typescript
quartiles(this: IterFlow<number>): { Q1: number; Q2: number; Q3: number } | undefined
```

**Returns:** `{ Q1: number; Q2: number; Q3: number } | undefined` - Object with quartile values, or undefined if empty

**Examples:**
```typescript
iter([1, 2, 3, 4, 5, 6, 7, 8, 9]).quartiles();
// { Q1: 3, Q2: 5, Q3: 7 }

iter([]).quartiles(); // undefined
```

**Functional API:**
```typescript
import { quartiles } from 'iterflow/fn';

quartiles([1, 2, 3, 4, 5, 6, 7, 8, 9]);
// { Q1: 3, Q2: 5, Q3: 7 }
```

---

### span()

Calculates the span (range from minimum to maximum value). This is a terminal operation.

**Signature:**
```typescript
span(this: IterFlow<number>): number | undefined
```

**Returns:** `number | undefined` - The span (max - min), or undefined if empty

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).span(); // 4
iter([10]).span(); // 0
iter([]).span(); // undefined
```

**Functional API:**
```typescript
import { span } from 'iterflow/fn';

span([1, 2, 3, 4, 5]); // 4
span([10]); // 0
```

---

### product()

Calculates the product of all numeric elements. This is a terminal operation.

**Signature:**
```typescript
product(this: IterFlow<number>): number
```

**Returns:** `number` - The product of all elements, or 1 if empty

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).product(); // 120
iter([2, 3, 4]).product(); // 24
iter([]).product(); // 1
```

**Functional API:**
```typescript
import { product } from 'iterflow/fn';

product([1, 2, 3, 4, 5]); // 120
product([2, 3, 4]); // 24
```

---

### covariance()

Calculates the covariance between two numeric sequences. This is a terminal operation.

**Signature:**
```typescript
covariance(this: IterFlow<number>, other: Iterable<number>): number | undefined
```

**Parameters:**
- `other: Iterable<number>` - An iterable of numbers to compare with

**Returns:** `number | undefined` - The covariance, or undefined if either sequence is empty or lengths differ

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).covariance([2, 4, 6, 8, 10]); // 4
iter([]).covariance([1, 2, 3]); // undefined
```

**Functional API:**
```typescript
import { covariance } from 'iterflow/fn';

covariance([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]); // 4
```

---

### correlation()

Calculates the Pearson correlation coefficient between two numeric sequences. Values range from -1 (perfect negative correlation) to 1 (perfect positive correlation). This is a terminal operation.

**Signature:**
```typescript
correlation(this: IterFlow<number>, other: Iterable<number>): number | undefined
```

**Parameters:**
- `other: Iterable<number>` - An iterable of numbers to compare with

**Returns:** `number | undefined` - The correlation coefficient, or undefined if either sequence is empty or lengths differ

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).correlation([2, 4, 6, 8, 10]); // 1 (perfect positive)
iter([1, 2, 3]).correlation([3, 2, 1]); // -1 (perfect negative)
iter([]).correlation([1, 2, 3]); // undefined
```

**Functional API:**
```typescript
import { correlation } from 'iterflow/fn';

correlation([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]); // 1
correlation([1, 2, 3], [3, 2, 1]); // -1
```

---

## Set Operations

### distinct()

Removes duplicate elements, keeping only the first occurrence of each.

**Signature:**
```typescript
distinct(): IterFlow<T>
```

**Returns:** `IterFlow<T>` - A new IterFlow with duplicates removed

**Example:**
```typescript
iter([1, 2, 2, 3, 1, 4]).distinct().toArray();
// [1, 2, 3, 4]
```

**Functional API:**
```typescript
import { distinct } from 'iterflow/fn';

Array.from(distinct([1, 2, 2, 3, 1, 4]));
// [1, 2, 3, 4]
```

---

### distinctBy()

Removes duplicate elements based on a key function.

**Signature:**
```typescript
distinctBy<K>(keyFn: (value: T) => K): IterFlow<T>
```

**Parameters:**
- `keyFn: (value: T) => K` - Function to extract the comparison key

**Returns:** `IterFlow<T>` - A new IterFlow with duplicates (by key) removed

**Example:**
```typescript
const users = [
  {id: 1, name: 'Alice'},
  {id: 2, name: 'Bob'},
  {id: 1, name: 'Charlie'}
];

iter(users).distinctBy(u => u.id).toArray();
// [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}]
```

**Functional API:**
```typescript
import { distinctBy } from 'iterflow/fn';

const distinctById = distinctBy((u: typeof users[0]) => u.id);
Array.from(distinctById(users));
// [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}]
```

---

## Grouping Operations

### partition()

Splits elements into two arrays based on a predicate. This is a terminal operation.

**Signature:**
```typescript
partition(predicate: (value: T) => boolean): [T[], T[]]
```

**Parameters:**
- `predicate: (value: T) => boolean` - Function to test each element

**Returns:** `[T[], T[]]` - A tuple of [passing elements, failing elements]

**Example:**
```typescript
iter([1, 2, 3, 4, 5]).partition(x => x % 2 === 0);
// [[2, 4], [1, 3, 5]]
```

**Functional API:**
```typescript
import { partition } from 'iterflow/fn';

const partitionEvens = partition((x: number) => x % 2 === 0);
partitionEvens([1, 2, 3, 4, 5]);
// [[2, 4], [1, 3, 5]]
```

---

### groupBy()

Groups elements by a key function into a Map. This is a terminal operation.

**Signature:**
```typescript
groupBy<K>(keyFn: (value: T) => K): Map<K, T[]>
```

**Parameters:**
- `keyFn: (value: T) => K` - Function to extract the grouping key

**Returns:** `Map<K, T[]>` - A Map where keys are the result of keyFn and values are arrays of elements

**Example:**
```typescript
iter(['alice', 'bob', 'charlie', 'dave'])
  .groupBy(name => name.length);
// Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'], 4 => ['dave'] }
```

**Functional API:**
```typescript
import { groupBy } from 'iterflow/fn';

const groupByLength = groupBy((s: string) => s.length);
groupByLength(['alice', 'bob', 'charlie', 'dave']);
// Map { 3 => ['bob'], 5 => ['alice'], 7 => ['charlie'], 4 => ['dave'] }
```

---

## Utility Operations

### tap()

Executes a side-effect function on each element without modifying the stream.

**Signature:**
```typescript
tap(fn: (value: T) => void): IterFlow<T>
```

**Parameters:**
- `fn: (value: T) => void` - Function to execute for each element

**Returns:** `IterFlow<T>` - A new IterFlow with the same elements

**Example:**
```typescript
iter([1, 2, 3])
  .tap(x => console.log('Processing:', x))
  .map(x => x * 2)
  .toArray();
// Logs: Processing: 1, Processing: 2, Processing: 3
// Returns: [2, 4, 6]
```

**Functional API:**
```typescript
import { tap } from 'iterflow/fn';

const log = tap((x: number) => console.log('Processing:', x));
Array.from(log([1, 2, 3]));
// Logs each value, returns [1, 2, 3]
```

---

### takeWhile()

Takes elements while the predicate returns true, then stops.

**Signature:**
```typescript
takeWhile(predicate: (value: T) => boolean): IterFlow<T>
```

**Parameters:**
- `predicate: (value: T) => boolean` - Function to test each element

**Returns:** `IterFlow<T>` - A new IterFlow with elements up to the first failing predicate

**Example:**
```typescript
iter([1, 2, 3, 4, 1, 2]).takeWhile(x => x < 4).toArray();
// [1, 2, 3]
```

**Functional API:**
```typescript
import { takeWhile } from 'iterflow/fn';

const takeLessThanFour = takeWhile((x: number) => x < 4);
Array.from(takeLessThanFour([1, 2, 3, 4, 1, 2]));
// [1, 2, 3]
```

---

### dropWhile()

Skips elements while the predicate returns true, then yields all remaining elements.

**Signature:**
```typescript
dropWhile(predicate: (value: T) => boolean): IterFlow<T>
```

**Parameters:**
- `predicate: (value: T) => boolean` - Function to test each element

**Returns:** `IterFlow<T>` - A new IterFlow starting from the first failing predicate

**Example:**
```typescript
iter([1, 2, 3, 4, 1, 2]).dropWhile(x => x < 3).toArray();
// [3, 4, 1, 2]
```

**Functional API:**
```typescript
import { dropWhile } from 'iterflow/fn';

const dropLessThanThree = dropWhile((x: number) => x < 3);
Array.from(dropLessThanThree([1, 2, 3, 4, 1, 2]));
// [3, 4, 1, 2]
```

---

## Terminal Operations

Terminal operations consume the iterator and return a final result.

### toArray()

Collects all elements into an array.

**Signature:**
```typescript
toArray(): T[]
```

**Returns:** `T[]` - An array containing all elements

**Example:**
```typescript
iter([1, 2, 3]).map(x => x * 2).toArray();
// [2, 4, 6]
```

**Functional API:**
```typescript
import { toArray } from 'iterflow/fn';

toArray([1, 2, 3]); // [1, 2, 3]
```

---

### reduce()

Reduces the iterator to a single value using an accumulator function.

**Signature:**
```typescript
reduce<U>(fn: (accumulator: U, value: T) => U, initial: U): U
```

**Parameters:**
- `fn: (accumulator: U, value: T) => U` - Function to combine accumulator with each element
- `initial: U` - The initial value for the accumulator

**Returns:** `U` - The final accumulated value

**Examples:**
```typescript
iter([1, 2, 3, 4]).reduce((acc, x) => acc + x, 0); // 10
iter(['a', 'b', 'c']).reduce((acc, x) => acc + x, ''); // 'abc'
```

**Functional API:**
```typescript
import { reduce } from 'iterflow/fn';

const sumAll = reduce((acc: number, x: number) => acc + x, 0);
sumAll([1, 2, 3, 4]); // 10
```

---

### find()

Finds the first element that matches the predicate.

**Signature:**
```typescript
find(predicate: (value: T) => boolean): T | undefined
```

**Parameters:**
- `predicate: (value: T) => boolean` - Function to test each element

**Returns:** `T | undefined` - The first matching element, or undefined

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).find(x => x > 3); // 4
iter([1, 2, 3]).find(x => x > 10); // undefined
```

**Functional API:**
```typescript
import { find } from 'iterflow/fn';

const findGreaterThanThree = find((x: number) => x > 3);
findGreaterThanThree([1, 2, 3, 4, 5]); // 4
```

---

### findIndex()

Finds the index of the first element that matches the predicate.

**Signature:**
```typescript
findIndex(predicate: (value: T) => boolean): number
```

**Parameters:**
- `predicate: (value: T) => boolean` - Function to test each element

**Returns:** `number` - The index of the first matching element, or -1

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).findIndex(x => x > 3); // 3
iter([1, 2, 3]).findIndex(x => x > 10); // -1
```

**Functional API:**
```typescript
import { findIndex } from 'iterflow/fn';

const findIndexGreaterThanThree = findIndex((x: number) => x > 3);
findIndexGreaterThanThree([1, 2, 3, 4, 5]); // 3
```

---

### some()

Tests whether at least one element matches the predicate.

**Signature:**
```typescript
some(predicate: (value: T) => boolean): boolean
```

**Parameters:**
- `predicate: (value: T) => boolean` - Function to test each element

**Returns:** `boolean` - true if any element matches

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).some(x => x > 3); // true
iter([1, 2, 3]).some(x => x > 10); // false
```

**Functional API:**
```typescript
import { some } from 'iterflow/fn';

const hasGreaterThanThree = some((x: number) => x > 3);
hasGreaterThanThree([1, 2, 3, 4, 5]); // true
```

---

### every()

Tests whether all elements match the predicate.

**Signature:**
```typescript
every(predicate: (value: T) => boolean): boolean
```

**Parameters:**
- `predicate: (value: T) => boolean` - Function to test each element

**Returns:** `boolean` - true if all elements match

**Examples:**
```typescript
iter([2, 4, 6]).every(x => x % 2 === 0); // true
iter([1, 2, 3]).every(x => x % 2 === 0); // false
```

**Functional API:**
```typescript
import { every } from 'iterflow/fn';

const allEven = every((x: number) => x % 2 === 0);
allEven([2, 4, 6]); // true
```

---

### first()

Gets the first element from the iterator.

**Signature:**
```typescript
first(defaultValue?: T): T | undefined
```

**Parameters:**
- `defaultValue?: T` - Optional default value to return if empty

**Returns:** `T | undefined` - The first element, default value, or undefined

**Examples:**
```typescript
iter([1, 2, 3]).first(); // 1
iter([]).first(); // undefined
iter([]).first(0); // 0
```

**Functional API:**
```typescript
import { first } from 'iterflow/fn';

first([1, 2, 3]); // 1
first([], 0); // 0
```

---

### last()

Gets the last element from the iterator.

**Signature:**
```typescript
last(defaultValue?: T): T | undefined
```

**Parameters:**
- `defaultValue?: T` - Optional default value to return if empty

**Returns:** `T | undefined` - The last element, default value, or undefined

**Examples:**
```typescript
iter([1, 2, 3]).last(); // 3
iter([]).last(); // undefined
iter([]).last(0); // 0
```

**Functional API:**
```typescript
import { last } from 'iterflow/fn';

last([1, 2, 3]); // 3
last([], 0); // 0
```

---

### nth()

Gets the element at the specified index.

**Signature:**
```typescript
nth(index: number): T | undefined
```

**Parameters:**
- `index: number` - Zero-based index of the element to retrieve

**Returns:** `T | undefined` - The element at the index, or undefined

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).nth(2); // 3
iter([1, 2, 3]).nth(10); // undefined
iter([1, 2, 3]).nth(-1); // undefined
```

**Functional API:**
```typescript
import { nth } from 'iterflow/fn';

const getSecond = nth(2);
getSecond([1, 2, 3, 4, 5]); // 3
```

---

### isEmpty()

Checks if the iterator is empty.

**Signature:**
```typescript
isEmpty(): boolean
```

**Returns:** `boolean` - true if the iterator has no elements

**Examples:**
```typescript
iter([]).isEmpty(); // true
iter([1, 2, 3]).isEmpty(); // false
```

**Functional API:**
```typescript
import { isEmpty } from 'iterflow/fn';

isEmpty([]); // true
isEmpty([1, 2, 3]); // false
```

---

### includes()

Checks if the iterator includes a specific value. Uses strict equality (===).

**Signature:**
```typescript
includes(searchValue: T): boolean
```

**Parameters:**
- `searchValue: T` - The value to search for

**Returns:** `boolean` - true if the value is found

**Examples:**
```typescript
iter([1, 2, 3, 4, 5]).includes(3); // true
iter([1, 2, 3]).includes(10); // false
iter(['a', 'b', 'c']).includes('b'); // true
```

**Functional API:**
```typescript
import { includes } from 'iterflow/fn';

const includesThree = includes(3);
includesThree([1, 2, 3, 4, 5]); // true
```

---

## Method Categorization

### Lazy Methods
These methods return a new iterator without consuming the source:
- map, filter, flatMap, take, drop, concat, intersperse, scan, enumerate
- reverse, sort, sortBy, window, chunk, pairwise
- distinct, distinctBy, tap, takeWhile, dropWhile

### Terminal Methods
These methods consume the iterator and return a final value:
- toArray, reduce, find, findIndex, some, every
- first, last, nth, isEmpty, includes, count
- sum, mean, min, max, median, variance, stdDev
- percentile, mode, quartiles, span, product
- covariance, correlation, partition, groupBy

### Memory-Intensive Methods
These methods buffer elements in memory:
- reverse, sort, sortBy, toArray
- median, variance, stdDev, percentile, mode, quartiles
- partition, groupBy

---

## License

MIT
