# Working with Infinite Sequences

This guide explores how to work with infinite sequences using IterFlow, enabling powerful patterns like lazy number generation, stream processing, and reactive data flows.

## Table of Contents

- [Introduction to Infinite Sequences](#introduction-to-infinite-sequences)
- [Creating Infinite Sequences](#creating-infinite-sequences)
- [Consuming Infinite Sequences Safely](#consuming-infinite-sequences-safely)
- [Common Patterns](#common-patterns)
- [Practical Examples](#practical-examples)
- [Performance Considerations](#performance-considerations)
- [Pitfalls and How to Avoid Them](#pitfalls-and-how-to-avoid-them)

## Introduction to Infinite Sequences

Infinite sequences are iterables that can produce values indefinitely. IterFlow's lazy evaluation makes it perfect for working with such sequences safely and efficiently.

### Why Infinite Sequences?

```typescript
// Generate an infinite sequence of natural numbers
function* naturalNumbers() {
  let n = 0;
  while (true) {
    yield n++;
  }
}

// This is safe and efficient - only computes what's needed
const firstTen = iter(naturalNumbers())
  .take(10)
  .toArray();
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

**Key benefits:**
- **Memory efficient** - Generate values on demand
- **Composable** - Build complex sequences from simple ones
- **Lazy** - Only compute what you need
- **Elegant** - Express mathematical concepts naturally

## Creating Infinite Sequences

### Using Generators

The most common way to create infinite sequences:

```typescript
import { iter } from 'iterflow';

// Infinite sequence of even numbers
function* evens() {
  let n = 0;
  while (true) {
    yield n;
    n += 2;
  }
}

const firstFiveEvens = iter(evens())
  .take(5)
  .toArray();
// [0, 2, 4, 6, 8]
```

### Using iter.repeat()

Create an infinite sequence of a single value:

```typescript
// Infinite sequence of zeros
const tenZeros = iter.repeat(0)
  .take(10)
  .toArray();
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

// Infinite sequence of objects
const tenDefaults = iter.repeat({ count: 0 })
  .take(10)
  .toArray();
```

⚠️ **Warning:** Each iteration returns the same object reference:

```typescript
const objects = iter.repeat({ value: 0 })
  .take(3)
  .toArray();

objects[0].value = 10;
console.log(objects[1].value); // 10 (same object!)

// Solution: Use map to create new objects
const uniqueObjects = iter.repeat(0)
  .take(3)
  .map(() => ({ value: 0 }))
  .toArray();
```

### Using iter.range()

While `range()` is typically finite, you can create large sequences:

```typescript
// Finite but very large
const billion = iter.range(0, 1_000_000_000)
  .filter(x => x % 1_000_000 === 0)
  .take(10)
  .toArray();
// [0, 1000000, 2000000, ...]
```

### Custom Generator Functions

Build your own infinite sequences:

```typescript
// Fibonacci sequence
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const firstTenFibs = iter(fibonacci())
  .take(10)
  .toArray();
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// Powers of 2
function* powersOf2() {
  let n = 1;
  while (true) {
    yield n;
    n *= 2;
  }
}

const firstEightPowers = iter(powersOf2())
  .take(8)
  .toArray();
// [1, 2, 4, 8, 16, 32, 64, 128]

// Random number generator
function* random() {
  while (true) {
    yield Math.random();
  }
}

const tenRandoms = iter(random())
  .take(10)
  .toArray();
```

### Recursive Sequences

Define sequences in terms of previous values:

```typescript
// Collatz sequence (3n + 1 problem)
function* collatz(start: number) {
  let n = start;
  while (true) {
    yield n;
    if (n === 1) break; // Actually finite for all known starting values
    n = n % 2 === 0 ? n / 2 : 3 * n + 1;
  }
}

const collatz7 = iter(collatz(7))
  .toArray();
// [7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1]
```

## Consuming Infinite Sequences Safely

### Terminal Operations (⚠️ Dangerous!)

**Never** use unbounded terminal operations on infinite sequences:

```typescript
// ❌ DANGER: Will run forever!
iter(naturalNumbers()).toArray();
iter(naturalNumbers()).sum();
iter(naturalNumbers()).count();
iter(naturalNumbers()).reduce((a, b) => a + b, 0);
```

### Safe Terminal Operations

Use terminal operations that can short-circuit:

```typescript
// ✅ Safe: stops at first match
iter(naturalNumbers())
  .find(x => x > 1000);
// 1001

// ✅ Safe: stops when predicate fails
iter(naturalNumbers())
  .some(x => x > 1000);
// true

// ✅ Safe: stops when predicate fails
iter(naturalNumbers())
  .every(x => x < 10);
// false (stops at 10)
```

### Using take()

The most common way to safely consume infinite sequences:

```typescript
// Take first N elements
iter(naturalNumbers())
  .take(5)
  .toArray();
// [0, 1, 2, 3, 4]

// Take with filtering
iter(naturalNumbers())
  .filter(x => x % 2 === 0)
  .take(5)
  .toArray();
// [0, 2, 4, 6, 8]
```

### Using takeWhile()

Take elements while a condition is true:

```typescript
// Take while less than 10
iter(naturalNumbers())
  .takeWhile(x => x < 10)
  .toArray();
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// Take while condition holds
iter(fibonacci())
  .takeWhile(x => x < 100)
  .toArray();
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
```

### Using drop() and dropWhile()

Skip elements from infinite sequences:

```typescript
// Skip first 10, then take 5
iter(naturalNumbers())
  .drop(10)
  .take(5)
  .toArray();
// [10, 11, 12, 13, 14]

// Skip while less than 10, then take 5
iter(naturalNumbers())
  .dropWhile(x => x < 10)
  .take(5)
  .toArray();
// [10, 11, 12, 13, 14]
```

## Common Patterns

### Pattern 1: Infinite Data Generation

Generate test data on demand:

```typescript
// Infinite stream of user objects
function* generateUsers() {
  let id = 1;
  const names = ['Alice', 'Bob', 'Charlie', 'David'];
  while (true) {
    yield {
      id: id++,
      name: names[Math.floor(Math.random() * names.length)],
      score: Math.floor(Math.random() * 100),
    };
  }
}

// Generate users until we find 10 with score > 80
const highScorers = iter(generateUsers())
  .filter(u => u.score > 80)
  .take(10)
  .toArray();
```

### Pattern 2: Paginated Results

Model paginated API responses as infinite sequences:

```typescript
async function* fetchAllPages(endpoint: string) {
  let page = 1;
  while (true) {
    const response = await fetch(`${endpoint}?page=${page}`);
    const data = await response.json();
    if (data.items.length === 0) break;
    yield* data.items;
    page++;
  }
}

// Process until we have enough results
const results = iter(fetchAllPages('/api/products'))
  .filter(product => product.inStock)
  .take(50)
  .toArray();
```

### Pattern 3: Event Streams

Model event streams as infinite sequences:

```typescript
function* clickStream() {
  const clicks: MouseEvent[] = [];
  document.addEventListener('click', (e) => clicks.push(e));

  while (true) {
    if (clicks.length > 0) {
      yield clicks.shift()!;
    }
  }
}

// Process first 10 clicks
const firstClicks = iter(clickStream())
  .take(10)
  .map(e => ({ x: e.clientX, y: e.clientY }))
  .toArray();
```

### Pattern 4: Cycle Through Values

Infinitely cycle through a finite sequence:

```typescript
function* cycle<T>(items: T[]) {
  if (items.length === 0) return;
  while (true) {
    yield* items;
  }
}

const colors = ['red', 'green', 'blue'];
const tenColors = iter(cycle(colors))
  .take(10)
  .toArray();
// ['red', 'green', 'blue', 'red', 'green', 'blue', 'red', 'green', 'blue', 'red']
```

### Pattern 5: Counter and Timer

Infinite counters for timing or indexing:

```typescript
function* counter(start = 0, step = 1) {
  let n = start;
  while (true) {
    yield n;
    n += step;
  }
}

// Enumerate items with custom starting index
const indexed = iter.zip(
  counter(1),
  ['apple', 'banana', 'cherry']
).toArray();
// [[1, 'apple'], [2, 'banana'], [3, 'cherry']]
```

### Pattern 6: Filtering Infinite Streams

Find matches in infinite data:

```typescript
// Prime number sieve
function* primes() {
  yield 2;
  const sieve = new Set<number>();
  let n = 3;

  while (true) {
    let isPrime = true;
    for (const p of sieve) {
      if (p * p > n) break;
      if (n % p === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      yield n;
      sieve.add(n);
    }
    n += 2;
  }
}

const firstTenPrimes = iter(primes())
  .take(10)
  .toArray();
// [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

## Practical Examples

### Example 1: Fibonacci Analysis

```typescript
// Find first Fibonacci number over 1 million
const largeFib = iter(fibonacci())
  .find(x => x > 1_000_000);
// 1346269

// Get Fibonacci numbers at specific indices
const fibIndices = [0, 1, 5, 10, 15];
const fibValues = fibIndices.map(i =>
  iter(fibonacci()).nth(i)
);
// [0, 1, 5, 55, 610]

// Sum of first 10 Fibonacci numbers
const sum = iter(fibonacci())
  .take(10)
  .sum();
// 88
```

### Example 2: Prime Number Operations

```typescript
// Find 100th prime number
const prime100 = iter(primes()).nth(99); // 0-indexed
// 541

// First prime after 1000
const nextPrime = iter(primes())
  .find(p => p > 1000);
// 1009

// All primes between 100 and 200
const rangeOfPrimes = iter(primes())
  .dropWhile(p => p < 100)
  .takeWhile(p => p <= 200)
  .toArray();
// [101, 103, 107, 109, 113, ...]
```

### Example 3: Random Sampling

```typescript
// Generate random numbers until we get 10 in range
const inRange = iter(random())
  .map(x => x * 100)
  .filter(x => x >= 40 && x <= 60)
  .take(10)
  .toArray();

// Monte Carlo simulation
function* randomPoints() {
  while (true) {
    yield {
      x: Math.random(),
      y: Math.random(),
    };
  }
}

// Estimate π using Monte Carlo
const samples = 1_000_000;
const insideCircle = iter(randomPoints())
  .take(samples)
  .filter(p => p.x * p.x + p.y * p.y <= 1)
  .count();

const piEstimate = 4 * insideCircle / samples;
// ~3.14159...
```

### Example 4: Time-Based Sequences

```typescript
// Infinite sequence of timestamps
function* timestamps(intervalMs: number) {
  const start = Date.now();
  let count = 0;
  while (true) {
    yield start + count * intervalMs;
    count++;
  }
}

// Next 5 timestamps at 1-second intervals
const nextFive = iter(timestamps(1000))
  .take(5)
  .toArray();

// Schedule with delays
function* schedule<T>(items: T[], delayMs: number) {
  for (const item of items) {
    yield { item, executeAt: Date.now() + delayMs };
    delayMs += 1000; // Increment delay
  }
}
```

### Example 5: State Machines

```typescript
// Traffic light sequence
function* trafficLight() {
  const states = ['green', 'yellow', 'red'];
  while (true) {
    yield* states;
  }
}

// Next 10 state changes
const states = iter(trafficLight())
  .take(10)
  .toArray();
// ['green', 'yellow', 'red', 'green', 'yellow', 'red', ...]

// Find when green occurs after index 5
const nextGreen = iter(trafficLight())
  .enumerate()
  .find(([i, state]) => i > 5 && state === 'green');
```

## Performance Considerations

### Memory Usage

Infinite sequences use constant memory (O(1)) as long as you don't materialize them:

```typescript
// ✅ Constant memory - processes one element at a time
iter(naturalNumbers())
  .filter(x => x % 2 === 0)
  .map(x => x * 2)
  .take(100)
  .toArray(); // Only 100 elements in memory

// ❌ High memory - buffers all elements
iter(naturalNumbers())
  .take(1_000_000)
  .toArray()
  .filter(x => x % 2 === 0); // 1M elements in memory
```

### Avoid Buffering Operations

Some operations require buffering and can't work with truly infinite sequences:

```typescript
// ❌ Never terminates - tries to sort infinity
iter(naturalNumbers())
  .sort()
  .take(10);

// ❌ Never terminates - tries to reverse infinity
iter(naturalNumbers())
  .reverse()
  .take(10);

// ✅ Works - limits first, then sorts
iter(naturalNumbers())
  .take(100)
  .reverse()
  .toArray();
```

### Early Termination is Key

Always use operations that can terminate early:

```typescript
// ✅ Good patterns
iter(infinite).take(n)
iter(infinite).takeWhile(predicate)
iter(infinite).find(predicate)
iter(infinite).some(predicate)
iter(infinite).every(predicate)
iter(infinite).nth(index)

// ❌ Dangerous patterns
iter(infinite).toArray()
iter(infinite).sum()
iter(infinite).reduce(fn, initial)
iter(infinite).groupBy(fn)
```

## Pitfalls and How to Avoid Them

### Pitfall 1: Calling toArray() on Infinite Sequences

```typescript
// ❌ NEVER do this - will hang forever
iter(naturalNumbers()).toArray();

// ✅ Always bound infinite sequences first
iter(naturalNumbers())
  .take(100)
  .toArray();
```

### Pitfall 2: Forgetting take() After Filters

```typescript
// ❌ Dangerous if no matches exist
iter(naturalNumbers())
  .filter(x => x < 0) // Never true!
  .toArray();

// ✅ Safe with explicit limit
iter(naturalNumbers())
  .filter(x => x < 0)
  .take(10)
  .toArray();
// [] (empty, but terminates)
```

### Pitfall 3: Using Buffering Operations

```typescript
// ❌ Never terminates
iter(naturalNumbers())
  .sort()
  .take(10);

// ✅ Limit first, then sort
iter(naturalNumbers())
  .take(10)
  .sortBy((a, b) => b - a)
  .toArray();
```

### Pitfall 4: Shared State in Generators

```typescript
// ❌ Bad - shared mutable state
let counter = 0;
function* badCounter() {
  while (true) {
    yield counter++;
  }
}

const iter1 = badCounter();
const iter2 = badCounter();
// Both share the same counter!

// ✅ Good - encapsulated state
function* goodCounter(start = 0) {
  let n = start;
  while (true) {
    yield n++;
  }
}
```

### Pitfall 5: Side Effects in Generator Functions

```typescript
// ❌ Bad - side effects on every iteration
function* logging() {
  let n = 0;
  while (true) {
    console.log(`Generating ${n}`);
    yield n++;
  }
}

// Logs happen even if you don't consume all values
iter(logging()).take(3).toArray();

// ✅ Good - use tap() for controlled side effects
iter(goodCounter())
  .take(3)
  .tap(x => console.log(`Processing ${x}`))
  .toArray();
```

## Best Practices Summary

### ✅ Do

- Always use `take()` or `takeWhile()` to bound infinite sequences
- Use `find()`, `some()`, `every()` for safe early termination
- Keep generators simple and stateless
- Use lazy operations for transformations
- Test with small limits before scaling up

### ❌ Don't

- Call `toArray()`, `sum()`, `count()` on unbounded sequences
- Use `sort()`, `reverse()`, or other buffering operations on infinite sequences
- Forget to limit sequences before materializing
- Share mutable state between generator invocations
- Assume filters will always find matches

## Next Steps

- Explore [Common Patterns and Recipes](common-patterns.md)
- Read about [Performance Optimization](performance-optimization.md)
- Check out [TypeScript Integration Best Practices](typescript-best-practices.md)

## Summary

Infinite sequences are a powerful tool for:
- Lazy data generation
- Stream processing
- Mathematical sequences
- Event handling
- Test data generation

Key takeaways:
- Always bound infinite sequences with `take()` or `takeWhile()`
- Use early-terminating operations like `find()`, `some()`, `every()`
- Avoid buffering operations like `sort()`, `reverse()`, `toArray()`
- Keep generators pure and stateless
- Test with small limits first

With IterFlow's lazy evaluation, infinite sequences become practical and efficient! 🚀
