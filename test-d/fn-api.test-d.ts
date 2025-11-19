/**
 * Type tests for Functional API
 * These tests run at compile-time to ensure type safety of the functional API
 */

import { expectType } from 'tsd';
import * as fn from '../src/fn/index.js';

// =============================================================================
// Statistical Operations
// =============================================================================

// sum should accept number iterables and return number
expectType<number>(fn.sum([1, 2, 3]));
expectType<number>(fn.sum(new Set([1, 2, 3])));

// mean should accept number iterables and return number | undefined
expectType<number | undefined>(fn.mean([1, 2, 3]));
expectType<number | undefined>(fn.mean([]));

// min/max should accept number iterables
expectType<number | undefined>(fn.min([1, 2, 3]));
expectType<number | undefined>(fn.max([1, 2, 3]));

// median should accept number iterables
expectType<number | undefined>(fn.median([1, 2, 3]));
expectType<number | undefined>(fn.median([]));

// variance/stdDev should accept number iterables
expectType<number | undefined>(fn.variance([1, 2, 3]));
expectType<number | undefined>(fn.stdDev([1, 2, 3]));

// percentile should accept number iterables and percentile value
expectType<number | undefined>(fn.percentile([1, 2, 3], 50));
expectType<number | undefined>(fn.percentile([1, 2, 3, 4, 5], 75));

// mode should accept number iterables
expectType<number[] | undefined>(fn.mode([1, 2, 2, 3, 3, 3]));

// quartiles should accept number iterables
expectType<{ Q1: number; Q2: number; Q3: number } | undefined>(
  fn.quartiles([1, 2, 3, 4, 5])
);

// span should accept number iterables
expectType<number | undefined>(fn.span([1, 2, 3, 4, 5]));

// product should accept number iterables
expectType<number>(fn.product([1, 2, 3, 4]));

// covariance should accept two number iterables
expectType<number | undefined>(fn.covariance([1, 2, 3], [2, 4, 6]));

// correlation should accept two number iterables
expectType<number | undefined>(fn.correlation([1, 2, 3], [2, 4, 6]));

// count should work on any iterable
expectType<number>(fn.count([1, 2, 3]));
expectType<number>(fn.count(['a', 'b', 'c']));

// =============================================================================
// Transformation Operations - Curried Functions
// =============================================================================

// map should be curried and transform types
const doubleNumbers = fn.map((x: number) => x * 2);
expectType<IterableIterator<number>>(doubleNumbers([1, 2, 3]));

const toStrings = fn.map((x: number) => x.toString());
expectType<IterableIterator<string>>(toStrings([1, 2, 3]));

// filter should be curried and preserve type
const filterEvens = fn.filter((x: number) => x % 2 === 0);
expectType<IterableIterator<number>>(filterEvens([1, 2, 3, 4]));

const filterLong = fn.filter((s: string) => s.length > 5);
expectType<IterableIterator<string>>(filterLong(['hello', 'world', 'typescript']));

// take should be curried and preserve type
const takeThree = fn.take<number>(3);
expectType<IterableIterator<number>>(takeThree([1, 2, 3, 4, 5]));

const takeTwoStrings = fn.take<string>(2);
expectType<IterableIterator<string>>(takeTwoStrings(['a', 'b', 'c']));

// drop should be curried and preserve type
const dropTwo = fn.drop<number>(2);
expectType<IterableIterator<number>>(dropTwo([1, 2, 3, 4, 5]));

// flatMap should be curried and flatten types
const duplicateEach = fn.flatMap((x: number) => [x, x * 2]);
expectType<IterableIterator<number>>(duplicateEach([1, 2, 3]));

const splitWords = fn.flatMap((s: string) => s.split(' '));
expectType<IterableIterator<string>>(splitWords(['hello world', 'foo bar']));

// concat should work on multiple iterables
const concatNumbers = fn.concat<number>();
expectType<IterableIterator<number>>(concatNumbers([1, 2], [3, 4], [5, 6]));

// intersperse should be curried
const addCommas = fn.intersperse(',');
expectType<IterableIterator<string>>(addCommas(['a', 'b', 'c']));

const addZeros = fn.intersperse(0);
expectType<IterableIterator<number>>(addZeros([1, 2, 3]));

// scan should be curried and allow type transformation
const runningSum = fn.scan((acc: number, x: number) => acc + x, 0);
expectType<IterableIterator<number>>(runningSum([1, 2, 3]));

const buildString = fn.scan((acc: string, x: number) => acc + x.toString(), '');
expectType<IterableIterator<string>>(buildString([1, 2, 3]));

// enumerate should be curried
const enumerateNumbers = fn.enumerate<number>();
expectType<IterableIterator<[number, number]>>(enumerateNumbers([10, 20, 30]));

const enumerateStrings = fn.enumerate<string>();
expectType<IterableIterator<[number, string]>>(enumerateStrings(['a', 'b', 'c']));

// reverse should be curried
const reverseNumbers = fn.reverse<number>();
expectType<IterableIterator<number>>(reverseNumbers([1, 2, 3]));

// sort should work on number | string
expectType<IterableIterator<number | string>>(fn.sort([3, 1, 4]));
expectType<IterableIterator<number | string>>(fn.sort(['c', 'a', 'b']));

// sortBy should be curried
const sortAscending = fn.sortBy<number>((a, b) => a - b);
expectType<IterableIterator<number>>(sortAscending([3, 1, 4]));

interface User {
  name: string;
  age: number;
}

const sortByAge = fn.sortBy<User>((a, b) => a.age - b.age);
const users: User[] = [{ name: 'Alice', age: 30 }];
expectType<IterableIterator<User>>(sortByAge(users));

// =============================================================================
// Windowing Operations
// =============================================================================

// window should be curried
const windowThree = fn.window<number>(3);
expectType<IterableIterator<number[]>>(windowThree([1, 2, 3, 4, 5]));

// chunk should be curried
const chunkTwo = fn.chunk<string>(2);
expectType<IterableIterator<string[]>>(chunkTwo(['a', 'b', 'c', 'd']));

// pairwise should create tuples
expectType<IterableIterator<[number, number]>>(fn.pairwise([1, 2, 3, 4]));
expectType<IterableIterator<[string, string]>>(fn.pairwise(['a', 'b', 'c']));

// =============================================================================
// Grouping Operations
// =============================================================================

// partition should be curried
const partitionEvens = fn.partition((x: number) => x % 2 === 0);
expectType<[number[], number[]]>(partitionEvens([1, 2, 3, 4, 5]));

const partitionLong = fn.partition((s: string) => s.length > 5);
expectType<[string[], string[]]>(partitionLong(['hello', 'world', 'hi']));

// groupBy should be curried and infer key type
const groupByParity = fn.groupBy((x: number) => x % 2 === 0);
expectType<Map<boolean, number[]>>(groupByParity([1, 2, 3, 4]));

const groupByLength = fn.groupBy((s: string) => s.length);
expectType<Map<number, string[]>>(groupByLength(['a', 'bb', 'ccc']));

const groupByFirstLetter = fn.groupBy((s: string) => s[0]!);
expectType<Map<string, string[]>>(groupByFirstLetter(['apple', 'apricot', 'banana']));

// =============================================================================
// Set Operations
// =============================================================================

// distinct should preserve type
expectType<IterableIterator<number>>(fn.distinct([1, 2, 2, 3]));
expectType<IterableIterator<string>>(fn.distinct(['a', 'b', 'a']));

// distinctBy should be curried and preserve element type
const distinctByParity = fn.distinctBy((x: number) => x % 2);
expectType<IterableIterator<number>>(distinctByParity([1, 2, 3, 4]));

const distinctByLength = fn.distinctBy((s: string) => s.length);
expectType<IterableIterator<string>>(distinctByLength(['a', 'bb', 'ccc', 'd']));

// =============================================================================
// Utility Operations
// =============================================================================

// tap should be curried and preserve type
const tapLog = fn.tap<number>(() => { /* side effect */ });
expectType<IterableIterator<number>>(tapLog([1, 2, 3]));

// takeWhile should be curried
const takeLessThanFive = fn.takeWhile((x: number) => x < 5);
expectType<IterableIterator<number>>(takeLessThanFive([1, 2, 3, 4, 5, 6]));

// dropWhile should be curried
const dropLessThanThree = fn.dropWhile((x: number) => x < 3);
expectType<IterableIterator<number>>(dropLessThanThree([1, 2, 3, 4]));

// =============================================================================
// Terminal Operations
// =============================================================================

// toArray should preserve type
expectType<number[]>(fn.toArray([1, 2, 3]));
expectType<string[]>(fn.toArray(['a', 'b', 'c']));

// reduce should be curried and allow type transformation
const sumReduce = fn.reduce((acc: number, x: number) => acc + x, 0);
expectType<number>(sumReduce([1, 2, 3]));

const concatReduce = fn.reduce((acc: string, x: string) => acc + x, '');
expectType<string>(concatReduce(['a', 'b', 'c']));

// find should be curried
const findGreaterThanFive = fn.find((x: number) => x > 5);
expectType<number | undefined>(findGreaterThanFive([1, 2, 3, 4, 5, 6]));

// findIndex should be curried
const findIndexEven = fn.findIndex((x: number) => x % 2 === 0);
expectType<number>(findIndexEven([1, 2, 3, 4]));

// some should be curried
const hasEven = fn.some((x: number) => x % 2 === 0);
expectType<boolean>(hasEven([1, 2, 3]));

// every should be curried
const allPositive = fn.every((x: number) => x > 0);
expectType<boolean>(allPositive([1, 2, 3]));

// first/last should preserve type
expectType<number | undefined>(fn.first([1, 2, 3]));
expectType<number | undefined>(fn.first([1, 2, 3], 0));
expectType<string | undefined>(fn.last(['a', 'b', 'c']));
expectType<string | undefined>(fn.last(['a', 'b', 'c'], 'default'));

// nth should be curried
const getSecond = fn.nth<number>(2);
expectType<number | undefined>(getSecond([1, 2, 3, 4]));

// isEmpty should work on any iterable
expectType<boolean>(fn.isEmpty([]));
expectType<boolean>(fn.isEmpty([1, 2, 3]));

// includes should be curried
const includesThree = fn.includes(3);
expectType<boolean>(includesThree([1, 2, 3, 4]));

const includesHello = fn.includes('hello');
expectType<boolean>(includesHello(['hello', 'world']));

// =============================================================================
// Combining Operations
// =============================================================================

// zip should combine types correctly
expectType<IterableIterator<[number, string]>>(fn.zip([1, 2, 3], ['a', 'b', 'c']));
expectType<IterableIterator<[User, number]>>(fn.zip(users, [1, 2, 3]));

// zipWith should use result type from combining function
expectType<IterableIterator<string>>(
  fn.zipWith([1, 2, 3], ['a', 'b', 'c'], (n, s) => `${n}-${s}`)
);
expectType<IterableIterator<number>>(
  fn.zipWith([1, 2, 3], [4, 5, 6], (a, b) => a + b)
);

// =============================================================================
// Generator Functions
// =============================================================================

// range should return number iterator
expectType<IterableIterator<number>>(fn.range(5));
expectType<IterableIterator<number>>(fn.range(1, 10));
expectType<IterableIterator<number>>(fn.range(0, 100, 2));

// repeat should preserve value type
expectType<IterableIterator<string>>(fn.repeat('hello', 5));
expectType<IterableIterator<number>>(fn.repeat(42, 3));
expectType<IterableIterator<User>>(fn.repeat(users[0]!, 2));

// =============================================================================
// Interleaving Operations
// =============================================================================

// interleave should preserve element type
expectType<IterableIterator<number>>(fn.interleave([1, 2], [3, 4], [5, 6]));
expectType<IterableIterator<string>>(fn.interleave(['a', 'b'], ['c', 'd']));

// merge should preserve element type
expectType<IterableIterator<number>>(fn.merge([1, 3, 5], [2, 4, 6]));
expectType<IterableIterator<string>>(fn.merge(['a', 'c'], ['b', 'd']));
expectType<IterableIterator<number>>(fn.merge((a, b) => a - b, [1, 3], [2, 4]));

// chain should preserve element type
expectType<IterableIterator<number>>(fn.chain([1, 2], [3, 4], [5, 6]));
expectType<IterableIterator<string>>(fn.chain(['a', 'b'], ['c', 'd']));

// =============================================================================
// Complex Composition
// =============================================================================

// Compose multiple curried functions
const processNumbers = (nums: number[]) => {
  const doubled = fn.map((x: number) => x * 2);
  const filtered = fn.filter((x: number) => x > 5);
  const windowed = fn.window<number>(2);

  return Array.from(windowed(filtered(doubled(nums))));
};

expectType<number[][]>(processNumbers([1, 2, 3, 4, 5]));

// Pipeline with different types
const pipeline = (words: string[]) => {
  const upperCase = fn.map((s: string) => s.toUpperCase());
  const longWords = fn.filter((s: string) => s.length > 3);
  const lengths = fn.map((s: string) => s.length);

  return Array.from(lengths(longWords(upperCase(words))));
};

expectType<number[]>(pipeline(['hello', 'hi', 'world']));

// =============================================================================
// Type Narrowing with Functional API
// =============================================================================

// Type guards in filter - functional API preserves original type
const isNum = (x: string | number): x is number => typeof x === 'number';
const mixedArray: (string | number)[] = [1, 'a', 2, 'b'];
const onlyNumbers = fn.filter(isNum);
expectType<IterableIterator<string | number>>(onlyNumbers(mixedArray));

// =============================================================================
// Edge Cases
// =============================================================================

// Empty arrays
expectType<number | undefined>(fn.mean([]));
expectType<never[]>(fn.toArray([]));

// Readonly arrays
const readonly: readonly number[] = [1, 2, 3];
expectType<number>(fn.sum(readonly));
expectType<number[]>(fn.toArray(readonly));

// Generators
function* numberGen(): Generator<number> {
  yield 1;
  yield 2;
  yield 3;
}
expectType<number>(fn.sum(numberGen()));

// Sets and Maps
expectType<number>(fn.sum(new Set([1, 2, 3])));
expectType<[string, number][]>(fn.toArray(new Map([['a', 1], ['b', 2]])));
