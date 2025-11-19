# TypeScript Integration Best Practices

This guide covers best practices for using IterFlow with TypeScript to achieve maximum type safety and developer productivity.

## Table of Contents

- [Type Inference](#type-inference)
- [Type Constraints](#type-constraints)
- [Generic Type Patterns](#generic-type-patterns)
- [Working with Complex Types](#working-with-complex-types)
- [Type Guards and Narrowing](#type-guards-and-narrowing)
- [Functional API Typing](#functional-api-typing)
- [Common Type Issues](#common-type-issues)
- [Advanced Patterns](#advanced-patterns)

## Type Inference

IterFlow is designed with TypeScript-first principles and provides excellent type inference throughout method chains.

### Basic Type Inference

```typescript
import { iter } from 'iterflow';

// Type is automatically inferred as IterFlow<number>
const numbers = iter([1, 2, 3, 4, 5]);

// Type flows through transformations
const doubled = numbers.map(x => x * 2); // IterFlow<number>

// TypeScript knows the result type
const result: number[] = doubled.toArray(); // number[]
```

### Inference Through Transformations

```typescript
// Start with numbers
const numbers = iter([1, 2, 3, 4, 5]);

// Transform to strings - type automatically inferred
const strings = numbers.map(x => x.toString()); // IterFlow<string>

// Transform to objects - type automatically inferred
const objects = numbers.map(x => ({ value: x })); // IterFlow<{ value: number }>

// Complex transformation chain
const result = iter([1, 2, 3])
  .map(x => x * 2)                    // IterFlow<number>
  .filter(x => x > 2)                 // IterFlow<number>
  .map(x => ({ value: x }))           // IterFlow<{ value: number }>
  .map(obj => obj.value.toString())   // IterFlow<string>
  .toArray();                         // string[]
```

### Inference with Interfaces

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

const users: User[] = [
  { id: 1, name: 'Alice', age: 25, active: true },
  { id: 2, name: 'Bob', age: 30, active: false },
];

// Type is IterFlow<User>
const activeUsers = iter(users)
  .filter(u => u.active); // TypeScript knows u is User

// Type is IterFlow<string>
const names = activeUsers
  .map(u => u.name); // TypeScript knows u is User, returns string

// Type is IterFlow<{ id: number; displayName: string }>
const display = activeUsers
  .map(u => ({
    id: u.id,
    displayName: u.name.toUpperCase(),
  }));
```

## Type Constraints

### Statistical Operations Are Constrained to Numbers

IterFlow enforces type constraints for statistical operations:

```typescript
const numbers = iter([1, 2, 3, 4, 5]);
numbers.sum();     // ✅ OK
numbers.mean();    // ✅ OK
numbers.median();  // ✅ OK

const strings = iter(['a', 'b', 'c']);
strings.sum();     // ❌ TypeScript error: sum() requires IterFlow<number>
strings.mean();    // ❌ TypeScript error
strings.median();  // ❌ TypeScript error
```

### Enforcing Number Types

```typescript
// Explicit type annotation ensures numbers
const data: number[] = getUserScores();
iter(data).mean(); // ✅ OK

// Filter maintains the number type
iter([1, 2, 3, 4, 5])
  .filter(x => x > 2)  // Still IterFlow<number>
  .mean();             // ✅ OK

// Map to numbers before statistical operations
interface Item {
  value: number;
}

const items: Item[] = [{ value: 1 }, { value: 2 }];

iter(items)
  .map(item => item.value)  // IterFlow<number>
  .mean();                  // ✅ OK
```

### Sort Constraints

The `sort()` method is constrained to primitive types:

```typescript
// ✅ OK - numbers
iter([3, 1, 4, 1, 5]).sort().toArray();

// ✅ OK - strings
iter(['c', 'a', 'b']).sort().toArray();

// ❌ Error - complex objects need sortBy
iter([{ id: 1 }, { id: 2 }]).sort(); // TypeScript error

// ✅ Use sortBy for complex types
iter([{ id: 3 }, { id: 1 }, { id: 2 }])
  .sortBy((a, b) => a.id - b.id)
  .toArray();
```

## Generic Type Patterns

### Generic Functions with IterFlow

```typescript
// Generic function that works with any type
function takeFirst<T>(items: Iterable<T>, n: number): T[] {
  return iter(items)
    .take(n)
    .toArray();
}

const numbers = takeFirst([1, 2, 3, 4, 5], 3);    // number[]
const strings = takeFirst(['a', 'b', 'c'], 2);    // string[]

// Generic transformation function
function mapAndFilter<T, U>(
  items: Iterable<T>,
  mapper: (item: T) => U,
  predicate: (item: U) => boolean
): U[] {
  return iter(items)
    .map(mapper)
    .filter(predicate)
    .toArray();
}

const result = mapAndFilter(
  [1, 2, 3, 4, 5],
  x => x * 2,
  x => x > 5
);
// result is number[]
```

### Generic Data Processing Pipelines

```typescript
interface DataProcessor<TIn, TOut> {
  process(data: Iterable<TIn>): TOut[];
}

class FilterMapProcessor<TIn, TOut> implements DataProcessor<TIn, TOut> {
  constructor(
    private mapper: (item: TIn) => TOut,
    private predicate: (item: TOut) => boolean
  ) {}

  process(data: Iterable<TIn>): TOut[] {
    return iter(data)
      .map(this.mapper)
      .filter(this.predicate)
      .toArray();
  }
}

// Usage with full type inference
const processor = new FilterMapProcessor(
  (x: number) => x * 2,
  (x: number) => x > 10
);

const result = processor.process([1, 2, 3, 4, 5, 6, 7, 8]);
// result is number[]
```

## Working with Complex Types

### Union Types

```typescript
type Value = string | number;

const mixed: Value[] = [1, 'hello', 2, 'world'];

// TypeScript maintains union type
const filtered = iter(mixed)
  .filter(x => typeof x === 'number') // Type is still Value
  .toArray(); // Value[]

// Use type guards for narrowing
const numbers = iter(mixed)
  .filter((x): x is number => typeof x === 'number')
  .toArray(); // number[]
```

### Nested Types

```typescript
interface Department {
  name: string;
  employees: Employee[];
}

interface Employee {
  id: number;
  name: string;
  salary: number;
}

const departments: Department[] = [...];

// Flatten and process nested structures
const allEmployees = iter(departments)
  .flatMap(dept => dept.employees)
  .toArray(); // Employee[]

// Calculate total payroll
const totalPayroll = iter(departments)
  .flatMap(dept => dept.employees)
  .map(emp => emp.salary)
  .sum(); // number

// Group employees by salary range
const salaryRanges = iter(departments)
  .flatMap(dept => dept.employees)
  .groupBy(emp => {
    if (emp.salary < 50000) return 'low';
    if (emp.salary < 100000) return 'medium';
    return 'high';
  }); // Map<string, Employee[]>
```

### Optional and Nullable Types

```typescript
interface Product {
  id: number;
  name: string;
  price?: number;
  discount: number | null;
}

const products: Product[] = [...];

// Filter out undefined prices
const withPrices = iter(products)
  .filter((p): p is Product & { price: number } => p.price !== undefined)
  .toArray(); // (Product & { price: number })[]

// Handle nullables
const validDiscounts = iter(products)
  .map(p => p.discount)
  .filter((d): d is number => d !== null)
  .toArray(); // number[]

// Or use optional chaining and defaults
const prices = iter(products)
  .map(p => p.price ?? 0)
  .toArray(); // number[]
```

## Type Guards and Narrowing

### Using Type Guards with filter()

```typescript
interface Dog {
  type: 'dog';
  bark(): void;
}

interface Cat {
  type: 'cat';
  meow(): void;
}

type Pet = Dog | Cat;

const pets: Pet[] = [...];

// Type guard function
function isDog(pet: Pet): pet is Dog {
  return pet.type === 'dog';
}

// TypeScript narrows the type
const dogs = iter(pets)
  .filter(isDog)  // Type is now IterFlow<Dog>
  .toArray();     // Dog[]

// Inline type guard
const cats = iter(pets)
  .filter((pet): pet is Cat => pet.type === 'cat')
  .toArray(); // Cat[]
```

### Discriminated Unions

```typescript
type Result<T> =
  | { success: true; value: T }
  | { success: false; error: string };

const results: Result<number>[] = [
  { success: true, value: 42 },
  { success: false, error: 'Failed' },
  { success: true, value: 100 },
];

// Extract successful values with type narrowing
const values = iter(results)
  .filter((r): r is Extract<Result<number>, { success: true }> => r.success)
  .map(r => r.value)  // TypeScript knows r.value exists
  .toArray();         // number[]

// Or extract errors
const errors = iter(results)
  .filter((r): r is Extract<Result<number>, { success: false }> => !r.success)
  .map(r => r.error)
  .toArray(); // string[]
```

### Type Assertions (Use Sparingly)

```typescript
// Sometimes you know more than TypeScript
const data: unknown[] = getUserData();

// ❌ Bad - no type safety
const processed = iter(data as number[])
  .map(x => x * 2)
  .toArray();

// ✅ Better - validate at runtime
const processed = iter(data)
  .filter((x): x is number => typeof x === 'number')
  .map(x => x * 2)
  .toArray();
```

## Functional API Typing

### Curried Function Types

```typescript
import { map, filter, pipe } from 'iterflow/fn';

// Type inference works through curried functions
const double = map((x: number) => x * 2);
const isEven = filter((x: number) => x % 2 === 0);

// Composed function has correct type
const processNumbers = pipe(
  double,    // (Iterable<number>) => Iterable<number>
  isEven     // (Iterable<number>) => Iterable<number>
); // (Iterable<number>) => Iterable<number>

const result = processNumbers([1, 2, 3, 4, 5]); // Iterable<number>
```

### Building Type-Safe Pipelines

```typescript
import { pipe, map, filter, take, toArray } from 'iterflow/fn';

interface Person {
  name: string;
  age: number;
}

// Build a type-safe pipeline
const getYoungAdultNames = pipe(
  filter((p: Person) => p.age >= 18 && p.age < 30),
  map((p: Person) => p.name),
  take(10),
  toArray
); // (Iterable<Person>) => string[]

const people: Person[] = [...];
const names = getYoungAdultNames(people); // string[]
```

### Generic Pipeline Functions

```typescript
import { pipe, map, filter } from 'iterflow/fn';

// Generic pipeline builder
function createProcessor<T, U>(
  mapper: (item: T) => U,
  predicate: (item: U) => boolean
) {
  return pipe(
    map(mapper),
    filter(predicate),
    toArray
  );
}

// Type inference works
const numberProcessor = createProcessor(
  (x: string) => parseInt(x),
  (x: number) => x > 10
); // (Iterable<string>) => number[]
```

## Common Type Issues

### Issue 1: Lost Type Information

```typescript
// ❌ Problem: TypeScript loses specific type
const data = [1, 2, 3];
const result = iter(data)
  .map(x => ({ value: x }))
  .toArray();
// Type is { value: number }[] but could be more specific

// ✅ Solution: Use explicit type annotation
interface ValueWrapper {
  value: number;
  readonly processed: true;
}

const result = iter(data)
  .map((x): ValueWrapper => ({
    value: x,
    processed: true as const
  }))
  .toArray(); // ValueWrapper[]
```

### Issue 2: Callback Parameter Types

```typescript
// ❌ Problem: Implicit any
iter([1, 2, 3]).map(x => x * 2); // x is inferred as number ✓

// But with complex callbacks:
iter([{ value: 1 }]).map(obj => {
  // obj type is inferred correctly
  return obj.value * 2;
});

// ✅ Explicit types for clarity
interface Item {
  value: number;
}

iter<Item>([{ value: 1 }]).map((obj: Item) => obj.value * 2);
```

### Issue 3: Generic Constraints

```typescript
// Problem: Want to constrain to objects with id
function processItems<T>(items: T[]) {
  return iter(items)
    .distinctBy(item => item.id); // ❌ Error: Property 'id' does not exist
}

// ✅ Solution: Add generic constraint
function processItems<T extends { id: number }>(items: T[]) {
  return iter(items)
    .distinctBy(item => item.id) // ✅ OK
    .toArray();
}
```

### Issue 4: Return Type Inference

```typescript
// Sometimes TypeScript needs help with return types
function process(data: number[]) {
  return iter(data)
    .filter(x => x > 0)
    .map(x => x * 2);
  // Return type is IterFlow<number>, not number[]
}

// ✅ Be explicit about terminal operation
function process(data: number[]): number[] {
  return iter(data)
    .filter(x => x > 0)
    .map(x => x * 2)
    .toArray();
}
```

## Advanced Patterns

### Builder Pattern with Type Safety

```typescript
class QueryBuilder<T> {
  private pipeline: IterFlow<T>;

  constructor(data: Iterable<T>) {
    this.pipeline = iter(data);
  }

  where(predicate: (item: T) => boolean): QueryBuilder<T> {
    this.pipeline = this.pipeline.filter(predicate);
    return this;
  }

  select<U>(mapper: (item: T) => U): QueryBuilder<U> {
    const newPipeline = this.pipeline.map(mapper);
    return new QueryBuilder(newPipeline);
  }

  take(n: number): QueryBuilder<T> {
    this.pipeline = this.pipeline.take(n);
    return this;
  }

  execute(): T[] {
    return this.pipeline.toArray();
  }
}

// Usage with full type safety
interface User {
  id: number;
  name: string;
  age: number;
}

const users: User[] = [...];

const result = new QueryBuilder(users)
  .where(u => u.age >= 18)        // QueryBuilder<User>
  .select(u => ({ id: u.id, name: u.name }))  // QueryBuilder<{ id: number, name: string }>
  .take(10)
  .execute(); // { id: number, name: string }[]
```

### Conditional Types with IterFlow

```typescript
// Extract array element type
type ElementType<T> = T extends Iterable<infer U> ? U : never;

// Helper to infer element type from iterable
function processIterable<T extends Iterable<any>>(
  data: T
): ElementType<T>[] {
  return iter(data).toArray();
}

const numbers = processIterable([1, 2, 3]); // number[]
const strings = processIterable(['a', 'b']); // string[]
```

### Mapped Types

```typescript
// Make all properties optional in output
type PartialFields<T> = {
  [K in keyof T]?: T[K];
};

function toPartial<T>(items: Iterable<T>): PartialFields<T>[] {
  return iter(items)
    .map(item => ({ ...item }))
    .toArray();
}
```

### Type-Safe Aggregations

```typescript
interface Metric {
  name: string;
  value: number;
}

function aggregateMetrics<T extends Metric>(
  metrics: Iterable<T>
): Map<string, number> {
  return iter(metrics)
    .groupBy(m => m.name)
    .entries()
    .map(([name, group]) => [
      name,
      iter(group).map(m => m.value).sum()
    ] as const)
    .reduce((map, [name, sum]) => {
      map.set(name, sum);
      return map;
    }, new Map<string, number>());
}
```

## Best Practices Summary

### ✅ Do

1. **Leverage Type Inference**
   ```typescript
   // Let TypeScript infer types
   const result = iter([1, 2, 3])
     .map(x => x * 2)
     .filter(x => x > 2)
     .toArray();
   ```

2. **Use Type Guards**
   ```typescript
   // Narrow types with type guards
   const numbers = iter(mixed)
     .filter((x): x is number => typeof x === 'number')
     .toArray();
   ```

3. **Annotate Complex Callbacks**
   ```typescript
   // Be explicit when needed
   interface Item { value: number }
   iter(items).map((item: Item) => item.value * 2);
   ```

4. **Constrain Generics**
   ```typescript
   // Add constraints for type safety
   function process<T extends { id: number }>(items: T[]) {
     return iter(items).distinctBy(x => x.id);
   }
   ```

5. **Use Discriminated Unions**
   ```typescript
   // Leverage TypeScript's type narrowing
   type Result = { success: true, value: number } | { success: false, error: string };
   ```

### ❌ Don't

1. **Overuse Type Assertions**
   ```typescript
   // ❌ Avoid as much as possible
   const data = unknownData as number[];
   ```

2. **Ignore Type Errors**
   ```typescript
   // ❌ Don't silence with @ts-ignore
   // @ts-ignore
   iter(strings).sum();
   ```

3. **Use `any`**
   ```typescript
   // ❌ Defeats the purpose of TypeScript
   function process(data: any) { ... }
   ```

4. **Skip Return Types**
   ```typescript
   // ❌ Be explicit for public APIs
   function getData() { return iter(...); }

   // ✅ Better
   function getData(): number[] { return iter(...).toArray(); }
   ```

## Next Steps

- Explore [Common Patterns and Recipes](common-patterns.md)
- Read the [API Reference](../api.md) for detailed type signatures
- Check out [Wrapper vs Functional API](wrapper-vs-functional.md) guide

## Summary

IterFlow provides excellent TypeScript support through:
- Automatic type inference through method chains
- Type constraints for statistical operations
- Generic support for custom types
- Type narrowing with type guards
- Full typing for functional API

Follow these best practices to write type-safe, maintainable code with IterFlow! 🎯
