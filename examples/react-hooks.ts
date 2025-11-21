import { iter } from '../src/index.js';

/**
 * React Hooks Integration Example
 *
 * This example demonstrates how to use iterflow with React hooks
 * for efficient data processing in React applications.
 */

// Example: Custom hook for filtering and transforming data
interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

// Simulated React hook (types only - would be implemented in a React app)
function useFilteredUsers(users: User[], minAge: number) {
  // In a real React app, this would use useMemo for optimization
  const filteredUsers = iter(users)
    .filter(user => user.active)
    .filter(user => user.age >= minAge)
    .map(user => ({
      ...user,
      displayName: user.name.toUpperCase()
    }))
    .toArray();

  const stats = {
    totalActive: iter(users).filter(u => u.active).count(),
    averageAge: iter(users).filter(u => u.active).map(u => u.age).mean(),
    count: filteredUsers.length
  };

  return { filteredUsers, stats };
}

// Example: Paginated data processing with React
function usePaginatedData<T>(items: T[], page: number, pageSize: number) {
  const paginatedItems = iter(items)
    .drop(page * pageSize)
    .take(pageSize)
    .toArray();

  const totalPages = Math.ceil(items.length / pageSize);

  return {
    items: paginatedItems,
    page,
    totalPages,
    hasNext: page < totalPages - 1,
    hasPrev: page > 0
  };
}

// Example: Real-time data aggregation
function useDataAggregation(dataPoints: number[], windowSize: number) {
  const movingAverage = iter(dataPoints)
    .window(windowSize)
    .map(window => iter(window).mean())
    .toArray();

  const statistics = {
    mean: iter(dataPoints).mean(),
    median: iter(dataPoints).median(),
    stdDev: iter(dataPoints).stdDev(),
    min: iter(dataPoints).min(),
    max: iter(dataPoints).max()
  };

  return { movingAverage, statistics };
}

// Example: Infinite scroll data processing
function useInfiniteScrollData<T>(
  allItems: T[],
  loadedCount: number,
  batchSize: number
) {
  const loadedItems = iter(allItems)
    .take(loadedCount)
    .toArray();

  const nextBatch = iter(allItems)
    .drop(loadedCount)
    .take(batchSize)
    .toArray();

  return {
    loadedItems,
    nextBatch,
    hasMore: loadedCount < allItems.length,
    progress: (loadedCount / allItems.length) * 100
  };
}

// Demonstration
console.log('=== React Hooks Integration Examples ===\n');

// Demo: useFilteredUsers
const users: User[] = [
  { id: 1, name: 'Alice', age: 25, active: true },
  { id: 2, name: 'Bob', age: 30, active: false },
  { id: 3, name: 'Charlie', age: 35, active: true },
  { id: 4, name: 'Diana', age: 28, active: true },
  { id: 5, name: 'Eve', age: 22, active: false },
];

const { filteredUsers, stats } = useFilteredUsers(users, 25);
console.log('Filtered Users (age >= 25, active only):');
console.log(filteredUsers);
console.log('Statistics:', stats);
console.log();

// Demo: usePaginatedData
const allItems = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
const page1 = usePaginatedData(allItems, 0, 10);
console.log('Paginated Data (Page 1):');
console.log('Items:', page1.items);
console.log('Metadata:', { page: page1.page, totalPages: page1.totalPages, hasNext: page1.hasNext });
console.log();

// Demo: useDataAggregation
const dataPoints = [10, 12, 15, 14, 18, 20, 19, 22, 25, 23];
const { movingAverage, statistics } = useDataAggregation(dataPoints, 3);
console.log('Data Aggregation:');
console.log('Moving Average (window=3):', movingAverage);
console.log('Statistics:', statistics);
console.log();

// Demo: useInfiniteScrollData
const scrollItems = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));
const infiniteScroll = useInfiniteScrollData(scrollItems, 20, 10);
console.log('Infinite Scroll:');
console.log('Loaded items count:', infiniteScroll.loadedItems.length);
console.log('Next batch count:', infiniteScroll.nextBatch.length);
console.log('Progress:', infiniteScroll.progress.toFixed(1) + '%');
console.log('Has more:', infiniteScroll.hasMore);
