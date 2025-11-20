/**
 * Iterflow Starter Template
 *
 * This template demonstrates common iterflow patterns.
 * Modify this file to experiment with iterflow!
 */

import { iter } from 'iterflow';

// Example 1: Basic transformations
console.log('=== Example 1: Basic Transformations ===');
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const result1 = iter(numbers)
  .map(x => x * 2)
  .filter(x => x > 10)
  .toArray();

console.log('Doubled and filtered:', result1);

// Example 2: Statistical operations
console.log('\n=== Example 2: Statistical Operations ===');
const data = [10, 20, 30, 40, 50];

const stats = {
  mean: iter(data).mean(),
  median: iter(data).median(),
  sum: iter(data).sum(),
  min: iter(data).min(),
  max: iter(data).max()
};

console.log('Statistics:', stats);

// Example 3: Windowing and chunking
console.log('\n=== Example 3: Windowing ===');
const series = [1, 2, 3, 4, 5, 6, 7, 8];

const windows = iter(series)
  .window(3)
  .map(window => window.reduce((a, b) => a + b, 0) / window.length)
  .toArray();

console.log('Moving average (window=3):', windows);

// Example 4: Grouping and partitioning
console.log('\n=== Example 4: Grouping ===');
const items = [
  { category: 'fruit', name: 'apple' },
  { category: 'fruit', name: 'banana' },
  { category: 'veggie', name: 'carrot' },
  { category: 'veggie', name: 'broccoli' }
];

const grouped = iter(items)
  .groupBy(item => item.category);

console.log('Grouped by category:', grouped);

// Example 5: Lazy evaluation for performance
console.log('\n=== Example 5: Lazy Evaluation ===');
const largeRange = function* () {
  for (let i = 0; i < 1000000; i++) {
    yield i;
  }
};

const first10Even = iter(largeRange())
  .filter(x => x % 2 === 0)
  .take(10)
  .toArray();

console.log('First 10 even numbers:', first10Even);

// Your code here!
console.log('\n=== Your Turn! ===');
console.log('Try modifying the examples above or write your own!');

// Example to get you started:
// const myData = [/* your data */];
// const myResult = iter(myData)
//   .map(/* your transformation */)
//   .filter(/* your condition */)
//   .toArray();
// console.log(myResult);
