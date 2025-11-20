import { iter } from 'iterflow';

/**
 * Advanced iterflow examples
 * Demonstrates complex operations and patterns
 */

// FlatMap: Map and flatten
export function flatMapExample() {
  const nestedArrays = [[1, 2], [3, 4], [5, 6]];
  const flattened = iter(nestedArrays)
    .flatMap(arr => arr)
    .toArray();
  console.log('Flattened:', flattened); // [1, 2, 3, 4, 5, 6]
}

// GroupBy: Group elements by key
export function groupByExample() {
  interface Person {
    name: string;
    age: number;
    department: string;
  }

  const people: Person[] = [
    { name: 'Alice', age: 30, department: 'Engineering' },
    { name: 'Bob', age: 25, department: 'Sales' },
    { name: 'Charlie', age: 35, department: 'Engineering' },
    { name: 'David', age: 28, department: 'Sales' },
  ];

  const byDepartment = iter(people)
    .groupBy(p => p.department);
  console.log('Grouped by department:', byDepartment);
}

// Window: Process sliding windows
export function windowExample() {
  const temperatures = [20, 22, 21, 23, 25, 24, 26, 28, 27];

  // Calculate 3-day moving average
  const movingAverage = iter(temperatures)
    .window(3)
    .map(window => iter(window).mean())
    .toArray();

  console.log('3-day moving average:', movingAverage);
}

// Chunk: Process in fixed-size batches
export function chunkExample() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const batches = iter(numbers)
    .chunk(3)
    .toArray();

  console.log('Batches of 3:', batches); // [[1,2,3], [4,5,6], [7,8,9], [10]]
}

// Zip: Combine multiple iterators
export function zipExample() {
  const names = ['Alice', 'Bob', 'Charlie'];
  const ages = [30, 25, 35];
  const departments = ['Engineering', 'Sales', 'Engineering'];

  const combined = iter(names)
    .zip(ages, departments)
    .map(([name, age, dept]) => ({ name, age, department: dept }))
    .toArray();

  console.log('Combined data:', combined);
}

// Partition: Split by predicate
export function partitionExample() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [evens, odds] = iter(numbers)
    .partition(n => n % 2 === 0);

  console.log('Evens:', evens); // [2, 4, 6, 8, 10]
  console.log('Odds:', odds);   // [1, 3, 5, 7, 9]
}

// Complex pipeline: Realistic data processing
export function complexPipelineExample() {
  interface Order {
    id: number;
    customerId: string;
    amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    date: string;
  }

  const orders: Order[] = [
    { id: 1, customerId: 'C001', amount: 100, status: 'completed', date: '2024-01-15' },
    { id: 2, customerId: 'C002', amount: 250, status: 'completed', date: '2024-01-16' },
    { id: 3, customerId: 'C001', amount: 150, status: 'pending', date: '2024-01-17' },
    { id: 4, customerId: 'C003', amount: 300, status: 'completed', date: '2024-01-18' },
    { id: 5, customerId: 'C002', amount: 75, status: 'cancelled', date: '2024-01-19' },
  ];

  // Calculate total revenue from completed orders by customer
  const revenueByCustomer = iter(orders)
    .filter(order => order.status === 'completed')
    .groupBy(order => order.customerId);

  const customerStats = Object.entries(revenueByCustomer)
    .map(([customerId, orders]) => ({
      customerId,
      totalRevenue: iter(orders).map(o => o.amount).sum(),
      orderCount: orders.length,
      avgOrderValue: iter(orders).map(o => o.amount).mean(),
    }));

  console.log('Customer statistics:', customerStats);
}

// Run all examples
if (require.main === module) {
  console.log('=== FlatMap Example ===');
  flatMapExample();

  console.log('\n=== GroupBy Example ===');
  groupByExample();

  console.log('\n=== Window Example ===');
  windowExample();

  console.log('\n=== Chunk Example ===');
  chunkExample();

  console.log('\n=== Zip Example ===');
  zipExample();

  console.log('\n=== Partition Example ===');
  partitionExample();

  console.log('\n=== Complex Pipeline Example ===');
  complexPipelineExample();
}
