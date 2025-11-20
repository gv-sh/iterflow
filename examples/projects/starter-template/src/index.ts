import { iter } from 'iterflow';

/**
 * Welcome to the iterflow Starter Template!
 *
 * This file demonstrates basic usage of iterflow.
 * Explore the examples/ directory for more advanced patterns.
 */

// Example 1: Basic data transformation
console.log('=== Example 1: Basic Transformation ===');
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = iter(numbers)
  .filter(n => n % 2 === 0)  // Keep even numbers
  .map(n => n * 2)            // Double them
  .toArray();
console.log('Even numbers doubled:', result);

// Example 2: Statistical operations
console.log('\n=== Example 2: Statistics ===');
const stats = iter(numbers);
console.log('Sum:', stats.sum());
console.log('Mean:', iter(numbers).mean());
console.log('Min:', iter(numbers).min());
console.log('Max:', iter(numbers).max());

// Example 3: Working with objects
console.log('\n=== Example 3: Object Processing ===');
interface Product {
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  { name: 'Laptop', price: 1200, category: 'Electronics' },
  { name: 'Phone', price: 800, category: 'Electronics' },
  { name: 'Desk', price: 300, category: 'Furniture' },
  { name: 'Chair', price: 150, category: 'Furniture' },
];

const expensiveElectronics = iter(products)
  .filter(p => p.category === 'Electronics')
  .filter(p => p.price > 500)
  .map(p => p.name)
  .toArray();
console.log('Expensive electronics:', expensiveElectronics);

// Example 4: Chaining operations
console.log('\n=== Example 4: Complex Pipeline ===');
const totalElectronicsValue = iter(products)
  .filter(p => p.category === 'Electronics')
  .map(p => p.price)
  .sum();
console.log('Total electronics value:', totalElectronicsValue);

// Example 5: Grouping and aggregation
console.log('\n=== Example 5: Grouping ===');
const productsByCategory = iter(products)
  .groupBy(p => p.category);
console.log('Products by category:', productsByCategory);

// Example 6: Window operations
console.log('\n=== Example 6: Moving Average ===');
const values = [10, 20, 30, 40, 50];
const movingAvg = iter(values)
  .window(3)
  .map(window => iter(window).mean())
  .toArray();
console.log('3-period moving average:', movingAvg);

console.log('\n✨ Explore src/examples/ for more advanced patterns!');
