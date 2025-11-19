/**
 * Type tests for IterFlow class
 * These tests run at compile-time to ensure type safety
 */

import { expectType } from 'tsd';
import { iter, IterFlow } from '../src/index.js';

// =============================================================================
// Basic Type Inference
// =============================================================================

// Should infer number type from number array
expectType<IterFlow<number>>(iter([1, 2, 3]));

// Should infer string type from string array
expectType<IterFlow<string>>(iter(['a', 'b', 'c']));

// Should infer union types correctly
expectType<IterFlow<string | number>>(iter([1, 'a', 2, 'b']));

// Should infer object types
interface User {
  name: string;
  age: number;
}
const users: User[] = [{ name: 'Alice', age: 30 }];
expectType<IterFlow<User>>(iter(users));

// =============================================================================
// Transformation Operations - Type Preservation
// =============================================================================

// map should transform types correctly
expectType<IterFlow<string>>(iter([1, 2, 3]).map(x => x.toString()));
expectType<IterFlow<number>>(iter(['1', '2', '3']).map(x => parseInt(x)));

// filter should preserve type
expectType<IterFlow<number>>(iter([1, 2, 3]).filter(x => x > 1));

// flatMap should flatten and transform correctly
expectType<IterFlow<string>>(iter(['hello', 'world']).flatMap(s => s.split('')));
expectType<IterFlow<number>>(iter([1, 2, 3]).flatMap(x => [x, x * 2]));

// take/drop should preserve type
expectType<IterFlow<number>>(iter([1, 2, 3]).take(2));
expectType<IterFlow<string>>(iter(['a', 'b', 'c']).drop(1));

// takeWhile/dropWhile should preserve type
expectType<IterFlow<number>>(iter([1, 2, 3]).takeWhile(x => x < 3));
expectType<IterFlow<number>>(iter([1, 2, 3]).dropWhile(x => x < 2));

// concat should preserve type
expectType<IterFlow<number>>(iter([1, 2]).concat([3, 4]));

// intersperse should preserve type
expectType<IterFlow<number>>(iter([1, 2, 3]).intersperse(0));
expectType<IterFlow<string>>(iter(['a', 'b']).intersperse('-'));

// scan should allow type transformation
expectType<IterFlow<number>>(iter([1, 2, 3]).scan((acc, x) => acc + x, 0));
expectType<IterFlow<string>>(iter([1, 2, 3]).scan((acc, x) => acc + x.toString(), ''));

// enumerate should create tuple type
expectType<IterFlow<[number, string]>>(iter(['a', 'b', 'c']).enumerate());

// reverse should preserve type
expectType<IterFlow<number>>(iter([1, 2, 3]).reverse());

// sort should only work on number | string
expectType<IterFlow<number | string>>(iter([3, 1, 4]).sort());
expectType<IterFlow<number | string>>(iter(['c', 'a', 'b']).sort());

// sortBy should work on any type with comparator
expectType<IterFlow<number>>(iter([3, 1, 4]).sortBy((a, b) => a - b));
expectType<IterFlow<User>>(iter(users).sortBy((a, b) => a.age - b.age));

// =============================================================================
// Windowing Operations
// =============================================================================

// window should create arrays
expectType<IterFlow<number[]>>(iter([1, 2, 3, 4]).window(2));
expectType<IterFlow<string[]>>(iter(['a', 'b', 'c']).window(3));

// chunk should create arrays
expectType<IterFlow<number[]>>(iter([1, 2, 3, 4, 5]).chunk(2));

// pairwise should create tuples
expectType<IterFlow<[number, number]>>(iter([1, 2, 3]).pairwise());
expectType<IterFlow<[string, string]>>(iter(['a', 'b', 'c']).pairwise());

// =============================================================================
// Set Operations
// =============================================================================

// distinct should preserve type
expectType<IterFlow<number>>(iter([1, 2, 2, 3]).distinct());
expectType<IterFlow<string>>(iter(['a', 'b', 'a']).distinct());

// distinctBy should preserve element type
expectType<IterFlow<User>>(iter(users).distinctBy(u => u.name));
expectType<IterFlow<number>>(iter([1, 2, 3]).distinctBy(x => x % 2));

// =============================================================================
// Statistical Operations - Type Constraints
// =============================================================================

// Statistical methods should only work on IterFlow<number>
expectType<number>(iter([1, 2, 3]).sum());
expectType<number | undefined>(iter([1, 2, 3]).mean());
expectType<number | undefined>(iter([1, 2, 3]).min());
expectType<number | undefined>(iter([1, 2, 3]).max());
expectType<number | undefined>(iter([1, 2, 3]).median());
expectType<number | undefined>(iter([1, 2, 3]).variance());
expectType<number | undefined>(iter([1, 2, 3]).stdDev());
expectType<number | undefined>(iter([1, 2, 3]).percentile(50));
expectType<number[] | undefined>(iter([1, 2, 3]).mode());
expectType<{ Q1: number; Q2: number; Q3: number } | undefined>(iter([1, 2, 3]).quartiles());
expectType<number | undefined>(iter([1, 2, 3]).span());
expectType<number>(iter([1, 2, 3]).product());
expectType<number | undefined>(iter([1, 2, 3]).covariance([2, 4, 6]));
expectType<number | undefined>(iter([1, 2, 3]).correlation([2, 4, 6]));

// Statistical methods should NOT work on strings (should cause compile error)
// @ts-expect-error - sum should not work on strings
iter(['a', 'b', 'c']).sum();

// @ts-expect-error - mean should not work on strings
iter(['a', 'b', 'c']).mean();

// @ts-expect-error - median should not work on strings
iter(['a', 'b', 'c']).median();

// =============================================================================
// Grouping Operations
// =============================================================================

// partition should return tuple of arrays
expectType<[number[], number[]]>(iter([1, 2, 3, 4]).partition(x => x % 2 === 0));
expectType<[User[], User[]]>(iter(users).partition(u => u.age > 25));

// groupBy should return Map with correct key and value types
expectType<Map<boolean, number[]>>(iter([1, 2, 3, 4]).groupBy(x => x % 2 === 0));
expectType<Map<string, User[]>>(iter(users).groupBy(u => u.name));
expectType<Map<number, User[]>>(iter(users).groupBy(u => u.age));

// =============================================================================
// Terminal Operations
// =============================================================================

// toArray should return array of same type
expectType<number[]>(iter([1, 2, 3]).toArray());
expectType<string[]>(iter(['a', 'b', 'c']).toArray());
expectType<User[]>(iter(users).toArray());

// count should return number
expectType<number>(iter([1, 2, 3]).count());

// reduce should allow type transformation
expectType<number>(iter([1, 2, 3]).reduce((acc, x) => acc + x, 0));
expectType<string>(iter([1, 2, 3]).reduce((acc, x) => acc + x.toString(), ''));

// find should return element type or undefined
expectType<number | undefined>(iter([1, 2, 3]).find(x => x > 2));
expectType<User | undefined>(iter(users).find(u => u.age > 25));

// findIndex should return number
expectType<number>(iter([1, 2, 3]).findIndex(x => x > 2));

// some/every should return boolean
expectType<boolean>(iter([1, 2, 3]).some(x => x > 2));
expectType<boolean>(iter([1, 2, 3]).every(x => x > 0));

// first/last should return element type or undefined
expectType<number | undefined>(iter([1, 2, 3]).first());
expectType<number | undefined>(iter([1, 2, 3]).first(0));
expectType<number | undefined>(iter([1, 2, 3]).last());
expectType<number | undefined>(iter([1, 2, 3]).last(0));

// nth should return element type or undefined
expectType<number | undefined>(iter([1, 2, 3]).nth(1));

// isEmpty should return boolean
expectType<boolean>(iter([1, 2, 3]).isEmpty());

// includes should return boolean
expectType<boolean>(iter([1, 2, 3]).includes(2));

// =============================================================================
// Static Methods - iter namespace
// =============================================================================

// zip should create tuple types
expectType<IterFlow<[number, string]>>(iter.zip([1, 2, 3], ['a', 'b', 'c']));
expectType<IterFlow<[User, number]>>(iter.zip(users, [1, 2, 3]));

// zipWith should use result type from combining function
expectType<IterFlow<string>>(iter.zipWith([1, 2, 3], ['a', 'b', 'c'], (n, s) => `${n}-${s}`));
expectType<IterFlow<number>>(iter.zipWith([1, 2, 3], [4, 5, 6], (a, b) => a + b));

// range should always return IterFlow<number>
expectType<IterFlow<number>>(iter.range(5));
expectType<IterFlow<number>>(iter.range(1, 10));
expectType<IterFlow<number>>(iter.range(0, 100, 2));

// repeat should preserve value type
expectType<IterFlow<string>>(iter.repeat('hello', 5));
expectType<IterFlow<number>>(iter.repeat(42, 3));
expectType<IterFlow<User>>(iter.repeat(users[0]!, 2));

// interleave should preserve element type
expectType<IterFlow<number>>(iter.interleave([1, 2], [3, 4], [5, 6]));
expectType<IterFlow<string>>(iter.interleave(['a', 'b'], ['c', 'd']));

// merge should preserve element type
expectType<IterFlow<number>>(iter.merge([1, 3, 5], [2, 4, 6]));
expectType<IterFlow<string>>(iter.merge(['a', 'c'], ['b', 'd']));
expectType<IterFlow<number>>(iter.merge((a, b) => a - b, [1, 3], [2, 4]));

// chain should preserve element type
expectType<IterFlow<number>>(iter.chain([1, 2], [3, 4], [5, 6]));
expectType<IterFlow<string>>(iter.chain(['a', 'b'], ['c', 'd']));

// =============================================================================
// Complex Type Chains
// =============================================================================

// Complex transformation chain
expectType<string[]>(
  iter([1, 2, 3, 4, 5])
    .filter(x => x > 2)           // IterFlow<number>
    .map(x => x * 2)              // IterFlow<number>
    .map(x => x.toString())       // IterFlow<string>
    .toArray()                    // string[]
);

// Chain with grouping
expectType<Map<boolean, number[]>>(
  iter([1, 2, 3, 4, 5, 6])
    .filter(x => x > 0)
    .map(x => x * 2)
    .groupBy(x => x % 2 === 0)
);

// Chain with windowing
expectType<number[][]>(
  iter([1, 2, 3, 4, 5])
    .filter(x => x > 1)
    .window(2)
    .toArray()
);

// Chain with statistical operations
expectType<number | undefined>(
  iter([1, 2, 3, 4, 5])
    .filter(x => x > 0)
    .map(x => x * 2)
    .mean()
);

// =============================================================================
// Type Narrowing Tests
// =============================================================================

// Type guard-like filtering - preserves union type
const mixed: (string | number)[] = [1, 'a', 2, 'b', 3];
const numbersFiltered = iter(mixed).filter((x): x is number => typeof x === 'number');
expectType<IterFlow<string | number>>(numbersFiltered);

// Const assertion
const constArray = [1, 2, 3] as const;
expectType<IterFlow<1 | 2 | 3>>(iter(constArray));

// Literal types
expectType<IterFlow<'a' | 'b' | 'c'>>(iter(['a', 'b', 'c'] as const));

// =============================================================================
// Edge Cases
// =============================================================================

// Empty array inference
expectType<IterFlow<never>>(iter([]));

// Readonly arrays
const readonlyNums: readonly number[] = [1, 2, 3];
expectType<IterFlow<number>>(iter(readonlyNums));

// Generator function
function* gen(): Generator<number> {
  yield 1;
  yield 2;
  yield 3;
}
expectType<IterFlow<number>>(iter(gen()));

// Set and Map
expectType<IterFlow<number>>(iter(new Set([1, 2, 3])));
expectType<IterFlow<[string, number]>>(iter(new Map([['a', 1], ['b', 2]])));

// String (iterable of characters)
expectType<IterFlow<string>>(iter('hello'));

// Nested iterators
expectType<IterFlow<number>>(iter(iter([1, 2, 3])));

// =============================================================================
// Utility Method Types
// =============================================================================

// tap should preserve type and not modify stream
expectType<IterFlow<number>>(
  iter([1, 2, 3]).tap(() => { /* side effect */ })
);

// =============================================================================
// Error Cases - These should fail
// =============================================================================

// sort should not work on objects without explicit comparator
// @ts-expect-error - sort requires number | string types
iter(users).sort();

// Statistical operations with wrong types
// @ts-expect-error
iter(users).sum();

// @ts-expect-error
iter(users).mean();

// Window size must be positive
// Runtime error, but we can't enforce at type level
expectType<IterFlow<number[]>>(iter([1, 2, 3]).window(0));

// Chunk size must be positive
// Runtime error, but we can't enforce at type level
expectType<IterFlow<number[]>>(iter([1, 2, 3]).chunk(0));
