/**
 * Iterflow Playground
 *
 * Check the browser console for output!
 * Edit this file to experiment with iterflow.
 */

import { iter } from 'iterflow';

// Helper to display results in the page
function displayExample(title: string, description: string, code: string, result: any) {
  const examplesDiv = document.getElementById('examples');
  if (!examplesDiv) return;

  const exampleDiv = document.createElement('div');
  exampleDiv.className = 'example';
  exampleDiv.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
    <div class="output">${JSON.stringify(result, null, 2)}</div>
  `;
  examplesDiv.appendChild(exampleDiv);

  console.log(`\n=== ${title} ===`);
  console.log(description);
  console.log('Result:', result);
}

// Example 1: Basic Pipeline
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const doubled = iter(numbers)
  .map(x => x * 2)
  .filter(x => x > 10)
  .toArray();

displayExample(
  'Basic Pipeline',
  'Map, filter, and collect results',
  'iter([1,2,3...]).map(x => x*2).filter(x => x>10).toArray()',
  doubled
);

// Example 2: Statistics
const data = [10, 20, 30, 40, 50, 15, 25, 35, 45];
const stats = {
  count: iter(data).count(),
  sum: iter(data).sum(),
  mean: iter(data).mean(),
  median: iter(data).median(),
  min: iter(data).min(),
  max: iter(data).max(),
  stddev: iter(data).stddev()
};

displayExample(
  'Statistical Analysis',
  'Calculate various statistics from your data',
  'iter(data).mean(), .median(), .stddev(), etc.',
  stats
);

// Example 3: Windowing
const timeSeries = [1, 4, 2, 8, 5, 7, 3, 6];
const movingAvg = iter(timeSeries)
  .window(3)
  .map(window => {
    const sum = window.reduce((a, b) => a + b, 0);
    return +(sum / window.length).toFixed(2);
  })
  .toArray();

displayExample(
  'Moving Average',
  'Calculate sliding window statistics',
  'iter(data).window(3).map(w => average(w))',
  { original: timeSeries, movingAverage: movingAvg }
);

// Example 4: Grouping
const products = [
  { category: 'electronics', name: 'Laptop', price: 999 },
  { category: 'electronics', name: 'Mouse', price: 29 },
  { category: 'books', name: 'TypeScript Guide', price: 39 },
  { category: 'books', name: 'Node.js Handbook', price: 49 },
  { category: 'electronics', name: 'Keyboard', price: 79 }
];

const grouped = iter(products).groupBy(p => p.category);

displayExample(
  'Group By Category',
  'Organize data into groups',
  'iter(products).groupBy(p => p.category)',
  grouped
);

// Example 5: Lazy Evaluation
const largeDataGenerator = function* () {
  console.log('Generator started (lazy evaluation)');
  for (let i = 0; i < 1000000; i++) {
    yield i;
  }
};

const first5Squares = iter(largeDataGenerator())
  .map(x => {
    // This only runs 5 times, not 1 million times!
    return x * x;
  })
  .take(5)
  .toArray();

displayExample(
  'Lazy Evaluation',
  'Process only what you need - efficiently handles large datasets',
  'iter(million_items).map(...).take(5)',
  { message: 'Only processed 5 items instead of 1,000,000!', result: first5Squares }
);

// Example 6: Unique and Sorting
const duplicates = [5, 2, 8, 2, 9, 1, 5, 8, 3];
const uniqueSorted = iter(duplicates)
  .unique()
  .sortBy((a, b) => a - b)
  .toArray();

displayExample(
  'Unique & Sort',
  'Remove duplicates and sort in one pipeline',
  'iter(data).unique().sortBy((a,b) => a-b)',
  { original: duplicates, result: uniqueSorted }
);

// Example 7: Chunking
const items = Array.from({ length: 10 }, (_, i) => i + 1);
const chunks = iter(items)
  .chunk(3)
  .toArray();

displayExample(
  'Chunking',
  'Split data into fixed-size groups',
  'iter(data).chunk(3)',
  chunks
);

console.log('\n✨ All examples completed! Check the page and console output.');
console.log('💡 Tip: Edit index.ts to try your own examples!');
