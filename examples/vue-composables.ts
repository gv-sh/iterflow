import { iter } from '../src/index.js';

/**
 * Vue Composables Integration Example
 *
 * This example demonstrates how to use iterflow with Vue 3 composables
 * for reactive data processing in Vue applications.
 */

// Example: Composable for filtered and sorted lists
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// Simulated Vue composable (types only - would be implemented in a Vue 3 app)
function useProductList(products: Product[], filters: { minPrice?: number; category?: string }) {
  // In a real Vue app, this would use computed() and ref() for reactivity
  const filteredProducts = iter(products)
    .filter(p => p.inStock)
    .filter(p => !filters.minPrice || p.price >= filters.minPrice)
    .filter(p => !filters.category || p.category === filters.category)
    .sortBy((a, b) => a.price - b.price)
    .toArray();

  const summary = {
    total: filteredProducts.length,
    averagePrice: iter(filteredProducts).map(p => p.price).mean(),
    categories: iter(filteredProducts).map(p => p.category).distinct().toArray(),
    priceRange: {
      min: iter(filteredProducts).map(p => p.price).min(),
      max: iter(filteredProducts).map(p => p.price).max()
    }
  };

  return {
    products: filteredProducts,
    summary
  };
}

// Example: Search with debouncing and highlighting
function useSearch<T>(
  items: T[],
  searchTerm: string,
  searchFields: ((item: T) => string)[]
) {
  const lowerSearch = searchTerm.toLowerCase();

  const results = iter(items)
    .filter(item =>
      searchFields.some(field =>
        field(item).toLowerCase().includes(lowerSearch)
      )
    )
    .toArray();

  const stats = {
    totalResults: results.length,
    matchRate: (results.length / items.length) * 100
  };

  return { results, stats };
}

// Example: Data table with sorting and grouping
function useDataTable<T, K extends keyof T>(
  data: T[],
  groupBy?: K,
  sortBy?: K,
  sortOrder: 'asc' | 'desc' = 'asc'
) {
  let processedData = iter(data);

  // Apply sorting
  if (sortBy) {
    processedData = processedData.sortBy((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  const items = processedData.toArray();

  // Apply grouping
  const groups = groupBy
    ? iter(items)
        .groupBy(item => String(item[groupBy]))
        .map(([key, values]) => ({ key, items: values, count: values.length }))
        .toArray()
    : null;

  return {
    items,
    groups,
    total: items.length
  };
}

// Example: Real-time statistics composable
function useStatistics(numbers: number[]) {
  const quartiles = iter(numbers).quartiles();

  return {
    basic: {
      count: numbers.length,
      sum: iter(numbers).sum(),
      mean: iter(numbers).mean(),
      median: iter(numbers).median()
    },
    spread: {
      min: iter(numbers).min(),
      max: iter(numbers).max(),
      range: iter(numbers).span(),
      stdDev: iter(numbers).stdDev(),
      variance: iter(numbers).variance()
    },
    quartiles: {
      q1: quartiles.Q1,
      q2: quartiles.Q2,
      q3: quartiles.Q3,
      iqr: quartiles.Q3 - quartiles.Q1
    }
  };
}

// Example: Virtualized list data processing
function useVirtualList<T>(
  items: T[],
  visibleStart: number,
  visibleCount: number,
  bufferSize: number = 5
) {
  const startIndex = Math.max(0, visibleStart - bufferSize);
  const endIndex = visibleStart + visibleCount + bufferSize;

  const visibleItems = iter(items)
    .drop(startIndex)
    .take(endIndex - startIndex)
    .enumerate()
    .map(([index, item]) => ({
      index: startIndex + index,
      item,
      isVisible: index >= bufferSize && index < bufferSize + visibleCount
    }))
    .toArray();

  return {
    visibleItems,
    totalItems: items.length,
    startIndex,
    endIndex: Math.min(endIndex, items.length)
  };
}

// Demonstration
console.log('=== Vue Composables Integration Examples ===\n');

// Demo: useProductList
const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999, category: 'Electronics', inStock: true },
  { id: 2, name: 'Mouse', price: 25, category: 'Electronics', inStock: true },
  { id: 3, name: 'Desk', price: 299, category: 'Furniture', inStock: false },
  { id: 4, name: 'Chair', price: 199, category: 'Furniture', inStock: true },
  { id: 5, name: 'Monitor', price: 399, category: 'Electronics', inStock: true },
  { id: 6, name: 'Lamp', price: 49, category: 'Furniture', inStock: true },
];

const productList = useProductList(products, { minPrice: 100, category: 'Electronics' });
console.log('Product List (Electronics, price >= 100):');
console.log('Products:', productList.products);
console.log('Summary:', productList.summary);
console.log();

// Demo: useSearch
const searchItems = [
  { id: 1, title: 'JavaScript Guide', author: 'John Doe' },
  { id: 2, title: 'TypeScript Handbook', author: 'Jane Smith' },
  { id: 3, title: 'Python Basics', author: 'Bob Johnson' },
  { id: 4, title: 'JavaScript Patterns', author: 'Alice Brown' },
];

const searchResults = useSearch(
  searchItems,
  'javascript',
  [item => item.title, item => item.author]
);
console.log('Search Results for "javascript":');
console.log('Results:', searchResults.results);
console.log('Stats:', searchResults.stats);
console.log();

// Demo: useDataTable
interface Sale {
  id: number;
  product: string;
  amount: number;
  region: string;
}

const sales: Sale[] = [
  { id: 1, product: 'A', amount: 100, region: 'North' },
  { id: 2, product: 'B', amount: 200, region: 'South' },
  { id: 3, product: 'A', amount: 150, region: 'North' },
  { id: 4, product: 'C', amount: 300, region: 'East' },
  { id: 5, product: 'B', amount: 250, region: 'South' },
];

const dataTable = useDataTable(sales, 'region', 'amount', 'desc');
console.log('Data Table (grouped by region, sorted by amount desc):');
console.log('Groups:', dataTable.groups);
console.log();

// Demo: useStatistics
const measurements = [23, 45, 12, 67, 34, 89, 56, 23, 45, 78];
const statistics = useStatistics(measurements);
console.log('Statistics:');
console.log('Basic:', statistics.basic);
console.log('Spread:', statistics.spread);
console.log('Quartiles:', statistics.quartiles);
console.log();

// Demo: useVirtualList
const virtualItems = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
const virtualList = useVirtualList(virtualItems, 100, 20, 5);
console.log('Virtual List (showing items 100-120 with buffer):');
console.log('Visible items:', virtualList.visibleItems.slice(0, 5).map(v => ({ index: v.index, name: v.item.name, isVisible: v.isVisible })));
console.log('Total items:', virtualList.totalItems);
console.log('Index range:', `${virtualList.startIndex}-${virtualList.endIndex}`);
