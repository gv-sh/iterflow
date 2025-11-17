import { iter } from '../src/index.js';

// Example sales data
const sales = [
  { product: 'Laptop', amount: 1200, category: 'Electronics' },
  { product: 'Mouse', amount: 25, category: 'Electronics' },
  { product: 'Book', amount: 15, category: 'Books' },
  { product: 'Keyboard', amount: 80, category: 'Electronics' },
  { product: 'Novel', amount: 20, category: 'Books' },
  { product: 'Monitor', amount: 300, category: 'Electronics' },
];

// Get unique categories for sales over $100
const highValueCategories = iter(sales)
  .filter(s => s.amount > 100)
  .map(s => s.category)
  .distinct()
  .toArray();

console.log('Sales data:', sales);
console.log('Categories with sales over $100:', highValueCategories);

// Calculate average sale amount for Electronics
const electronicsAverage = iter(sales)
  .filter(sale => sale.category === 'Electronics')
  .map(sale => sale.amount)
  .mean();

console.log('Average Electronics sale:', electronicsAverage);
