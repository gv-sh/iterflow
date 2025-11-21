import { iter } from 'iterflow';

/**
 * Basic iterflow examples
 * Demonstrates fundamental operations
 */

// Map: Transform each element
export function mapExample() {
  const numbers = [1, 2, 3, 4, 5];
  const doubled = iter(numbers)
    .map(n => n * 2)
    .toArray();
  console.log('Doubled:', doubled); // [2, 4, 6, 8, 10]
}

// Filter: Keep elements matching a condition
export function filterExample() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const evenNumbers = iter(numbers)
    .filter(n => n % 2 === 0)
    .toArray();
  console.log('Even numbers:', evenNumbers); // [2, 4, 6, 8, 10]
}

// Reduce: Aggregate to a single value
export function reduceExample() {
  const numbers = [1, 2, 3, 4, 5];
  const sum = iter(numbers)
    .reduce((acc, n) => acc + n, 0);
  console.log('Sum:', sum); // 15
}

// Take: Get first N elements
export function takeExample() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const firstFive = iter(numbers)
    .take(5)
    .toArray();
  console.log('First 5:', firstFive); // [1, 2, 3, 4, 5]
}

// Skip: Skip first N elements
export function skipExample() {
  const numbers = [1, 2, 3, 4, 5];
  const afterTwo = iter(numbers)
    .drop(2)
    .toArray();
  console.log('After skipping 2:', afterTwo); // [3, 4, 5]
}

// Unique: Remove duplicates
export function uniqueExample() {
  const numbers = [1, 2, 2, 3, 3, 3, 4, 4, 5];
  const unique = iter(numbers)
    .unique()
    .toArray();
  console.log('Unique:', unique); // [1, 2, 3, 4, 5]
}

// Run all examples
if (require.main === module) {
  console.log('=== Map Example ===');
  mapExample();

  console.log('\n=== Filter Example ===');
  filterExample();

  console.log('\n=== Reduce Example ===');
  reduceExample();

  console.log('\n=== Take Example ===');
  takeExample();

  console.log('\n=== Skip Example ===');
  skipExample();

  console.log('\n=== Unique Example ===');
  uniqueExample();
}
