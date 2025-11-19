import { iter } from '../src/index.js';

/**
 * JSON Data Pipeline Processing Example
 *
 * Demonstrates:
 * - Processing nested JSON structures
 * - Data extraction and flattening
 * - Complex transformations
 * - Multi-stage data pipelines
 * - Aggregations on JSON data
 * - Data denormalization and enrichment
 */

// Simulated API response with nested data (e-commerce orders)
const ordersData = [
  {
    orderId: 'ORD-001',
    customerId: 'CUST-101',
    customerName: 'Alice Johnson',
    orderDate: '2024-01-15T10:30:00Z',
    status: 'completed',
    items: [
      { productId: 'PROD-A', name: 'Laptop', quantity: 1, price: 1200, category: 'Electronics' },
      { productId: 'PROD-B', name: 'Mouse', quantity: 2, price: 25, category: 'Electronics' }
    ],
    shipping: { method: 'express', cost: 15, address: { city: 'New York', country: 'USA' } },
    payment: { method: 'credit_card', amount: 1265 }
  },
  {
    orderId: 'ORD-002',
    customerId: 'CUST-102',
    customerName: 'Bob Smith',
    orderDate: '2024-01-15T11:45:00Z',
    status: 'processing',
    items: [
      { productId: 'PROD-C', name: 'Book: TypeScript Guide', quantity: 3, price: 35, category: 'Books' },
      { productId: 'PROD-D', name: 'Book: Node.js Patterns', quantity: 2, price: 40, category: 'Books' }
    ],
    shipping: { method: 'standard', cost: 5, address: { city: 'Los Angeles', country: 'USA' } },
    payment: { method: 'paypal', amount: 190 }
  },
  {
    orderId: 'ORD-003',
    customerId: 'CUST-103',
    customerName: 'Carol White',
    orderDate: '2024-01-16T09:20:00Z',
    status: 'completed',
    items: [
      { productId: 'PROD-E', name: 'Monitor', quantity: 1, price: 350, category: 'Electronics' },
      { productId: 'PROD-F', name: 'Keyboard', quantity: 1, price: 80, category: 'Electronics' },
      { productId: 'PROD-G', name: 'Webcam', quantity: 1, price: 120, category: 'Electronics' }
    ],
    shipping: { method: 'express', cost: 20, address: { city: 'Chicago', country: 'USA' } },
    payment: { method: 'credit_card', amount: 570 }
  },
  {
    orderId: 'ORD-004',
    customerId: 'CUST-101',
    customerName: 'Alice Johnson',
    orderDate: '2024-01-16T14:30:00Z',
    status: 'shipped',
    items: [
      { productId: 'PROD-H', name: 'Desk Lamp', quantity: 2, price: 45, category: 'Furniture' }
    ],
    shipping: { method: 'standard', cost: 8, address: { city: 'New York', country: 'USA' } },
    payment: { method: 'credit_card', amount: 98 }
  },
  {
    orderId: 'ORD-005',
    customerId: 'CUST-104',
    customerName: 'David Brown',
    orderDate: '2024-01-17T10:00:00Z',
    status: 'completed',
    items: [
      { productId: 'PROD-A', name: 'Laptop', quantity: 2, price: 1200, category: 'Electronics' },
      { productId: 'PROD-B', name: 'Mouse', quantity: 2, price: 25, category: 'Electronics' }
    ],
    shipping: { method: 'express', cost: 25, address: { city: 'Boston', country: 'USA' } },
    payment: { method: 'debit_card', amount: 2475 }
  }
];

console.log('=== JSON Data Pipeline Processing Example ===\n');
console.log(`Processing ${ordersData.length} orders...\n`);

// 1. Flatten order items - create one record per item
interface FlatOrderItem {
  orderId: string;
  customerId: string;
  customerName: string;
  orderDate: Date;
  status: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  category: string;
  itemTotal: number;
  shippingMethod: string;
  shippingCost: number;
  city: string;
}

const flattenedItems = iter(ordersData)
  .flatMap(order =>
    order.items.map(item => ({
      orderId: order.orderId,
      customerId: order.customerId,
      customerName: order.customerName,
      orderDate: new Date(order.orderDate),
      status: order.status,
      productId: item.productId,
      productName: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
      itemTotal: item.quantity * item.price,
      shippingMethod: order.shipping.method,
      shippingCost: order.shipping.cost,
      city: order.shipping.address.city
    }))
  )
  .toArray();

console.log(`Flattened to ${flattenedItems.length} individual items\n`);

// 2. Product sales analysis
const productSales = iter(flattenedItems)
  .groupBy(item => item.productId)
  .map(([productId, items]) => ({
    productId,
    productName: items[0].productName,
    category: items[0].category,
    totalQuantity: iter(items).map(i => i.quantity).sum(),
    totalRevenue: iter(items).map(i => i.itemTotal).sum(),
    orderCount: items.length,
    avgPrice: iter(items).map(i => i.price).mean()
  }))
  .sortBy((a, b) => b.totalRevenue - a.totalRevenue)
  .toArray();

console.log('Product Sales Summary:');
productSales.forEach(p => {
  console.log(`\n${p.productName}:`);
  console.log(`  Product ID: ${p.productId}`);
  console.log(`  Category: ${p.category}`);
  console.log(`  Units Sold: ${p.totalQuantity}`);
  console.log(`  Revenue: $${p.totalRevenue.toLocaleString()}`);
  console.log(`  Orders: ${p.orderCount}`);
});
console.log('');

// 3. Category analysis
const categoryStats = iter(flattenedItems)
  .groupBy(item => item.category)
  .map(([category, items]) => ({
    category,
    revenue: iter(items).map(i => i.itemTotal).sum(),
    itemCount: items.length,
    avgItemValue: iter(items).map(i => i.itemTotal).mean(),
    uniqueProducts: iter(items).map(i => i.productId).distinct().count()
  }))
  .sortBy((a, b) => b.revenue - a.revenue)
  .toArray();

console.log('Category Performance:');
categoryStats.forEach(cat => {
  console.log(`${cat.category}:`);
  console.log(`  Revenue: $${cat.revenue.toLocaleString()}`);
  console.log(`  Items Sold: ${cat.itemCount}`);
  console.log(`  Avg Item Value: $${cat.avgItemValue.toFixed(2)}`);
  console.log(`  Unique Products: ${cat.uniqueProducts}`);
});
console.log('');

// 4. Customer analysis with order aggregation
const customerStats = iter(ordersData)
  .groupBy(order => order.customerId)
  .map(([customerId, orders]) => ({
    customerId,
    customerName: orders[0].customerName,
    orderCount: orders.length,
    totalSpent: iter(orders).map(o => o.payment.amount).sum(),
    avgOrderValue: iter(orders).map(o => o.payment.amount).mean(),
    completedOrders: orders.filter(o => o.status === 'completed').length,
    cities: iter(orders).map(o => o.shipping.address.city).distinct().toArray()
  }))
  .sortBy((a, b) => b.totalSpent - a.totalSpent)
  .toArray();

console.log('Customer Analysis:');
customerStats.forEach(c => {
  console.log(`\n${c.customerName} (${c.customerId}):`);
  console.log(`  Orders: ${c.orderCount} (${c.completedOrders} completed)`);
  console.log(`  Total Spent: $${c.totalSpent.toLocaleString()}`);
  console.log(`  Avg Order Value: $${c.avgOrderValue.toFixed(2)}`);
  console.log(`  Cities: ${c.cities.join(', ')}`);
});
console.log('');

// 5. Shipping method analysis
const shippingStats = iter(ordersData)
  .groupBy(order => order.shipping.method)
  .map(([method, orders]) => ({
    method,
    orderCount: orders.length,
    totalRevenue: iter(orders).map(o => o.payment.amount).sum(),
    avgShippingCost: iter(orders).map(o => o.shipping.cost).mean(),
    totalShippingRevenue: iter(orders).map(o => o.shipping.cost).sum()
  }))
  .toArray();

console.log('Shipping Method Stats:');
shippingStats.forEach(s => {
  console.log(`${s.method}:`);
  console.log(`  Orders: ${s.orderCount}`);
  console.log(`  Revenue: $${s.totalRevenue.toLocaleString()}`);
  console.log(`  Avg Shipping Cost: $${s.avgShippingCost.toFixed(2)}`);
  console.log(`  Total Shipping Revenue: $${s.totalShippingRevenue.toFixed(2)}`);
});
console.log('');

// 6. Multi-stage pipeline: High-value customers with preferences
const highValueCustomers = iter(ordersData)
  .groupBy(o => o.customerId)
  .map(([customerId, orders]) => {
    const items = orders.flatMap(o => o.items);
    return {
      customerId,
      customerName: orders[0].customerName,
      totalSpent: iter(orders).map(o => o.payment.amount).sum(),
      favoriteCategory: iter(items)
        .groupBy(i => i.category)
        .map(([cat, catItems]) => ({ category: cat, count: catItems.length }))
        .sortBy((a, b) => b.count - a.count)
        .first()?.category || 'Unknown',
      preferredPayment: iter(orders)
        .groupBy(o => o.payment.method)
        .map(([method, methodOrders]) => ({ method, count: methodOrders.length }))
        .sortBy((a, b) => b.count - a.count)
        .first()?.method || 'Unknown',
      avgItemsPerOrder: iter(orders).map(o => o.items.length).mean()
    };
  })
  .filter(c => c.totalSpent >= 500)
  .sortBy((a, b) => b.totalSpent - a.totalSpent)
  .toArray();

console.log('High-Value Customers (>= $500):');
highValueCustomers.forEach(c => {
  console.log(`\n${c.customerName}:`);
  console.log(`  Total Spent: $${c.totalSpent.toLocaleString()}`);
  console.log(`  Favorite Category: ${c.favoriteCategory}`);
  console.log(`  Preferred Payment: ${c.preferredPayment}`);
  console.log(`  Avg Items per Order: ${c.avgItemsPerOrder.toFixed(1)}`);
});
console.log('');

// 7. Order status distribution
const statusDistribution = iter(ordersData)
  .groupBy(o => o.status)
  .map(([status, orders]) => ({
    status,
    count: orders.length,
    totalValue: iter(orders).map(o => o.payment.amount).sum()
  }))
  .toArray();

console.log('Order Status Distribution:');
statusDistribution.forEach(s => {
  const percentage = (s.count / ordersData.length * 100).toFixed(1);
  console.log(`  ${s.status}: ${s.count} orders (${percentage}%) - $${s.totalValue.toLocaleString()}`);
});
console.log('');

// 8. Geographic analysis
const cityStats = iter(ordersData)
  .groupBy(o => o.shipping.address.city)
  .map(([city, orders]) => ({
    city,
    orderCount: orders.length,
    revenue: iter(orders).map(o => o.payment.amount).sum(),
    customers: iter(orders).map(o => o.customerId).distinct().count()
  }))
  .sortBy((a, b) => b.revenue - a.revenue)
  .toArray();

console.log('Top Cities by Revenue:');
cityStats.forEach(c => {
  console.log(`  ${c.city}: ${c.orderCount} orders, ${c.customers} customers, $${c.revenue.toLocaleString()}`);
});
console.log('');

// 9. Create enriched dataset for export
const enrichedOrders = iter(ordersData)
  .map(order => {
    const itemCount = order.items.length;
    const subtotal = iter(order.items).map(i => i.quantity * i.price).sum();
    const categories = iter(order.items).map(i => i.category).distinct().toArray();

    return {
      orderId: order.orderId,
      customer: order.customerName,
      date: new Date(order.orderDate).toISOString().split('T')[0],
      status: order.status,
      itemCount,
      categories: categories.join(', '),
      subtotal,
      shipping: order.shipping.cost,
      total: order.payment.amount,
      city: order.shipping.address.city,
      shippingMethod: order.shipping.method
    };
  })
  .toArray();

console.log('Enriched Order Data (first 3):');
enrichedOrders.slice(0, 3).forEach(o => {
  console.log(`\n${o.orderId}:`);
  console.log(`  Customer: ${o.customer}`);
  console.log(`  Date: ${o.date}`);
  console.log(`  Items: ${o.itemCount} (${o.categories})`);
  console.log(`  Subtotal: $${o.subtotal}`);
  console.log(`  Shipping: $${o.shipping} (${o.shippingMethod})`);
  console.log(`  Total: $${o.total}`);
});
console.log('');

// 10. Business metrics summary
const metrics = {
  totalOrders: ordersData.length,
  totalRevenue: iter(ordersData).map(o => o.payment.amount).sum(),
  avgOrderValue: iter(ordersData).map(o => o.payment.amount).mean(),
  totalItemsSold: iter(flattenedItems).map(i => i.quantity).sum(),
  uniqueCustomers: iter(ordersData).map(o => o.customerId).distinct().count(),
  uniqueProducts: iter(flattenedItems).map(i => i.productId).distinct().count(),
  completionRate: (iter(ordersData).filter(o => o.status === 'completed').count() / ordersData.length * 100).toFixed(1),
  topCategory: categoryStats[0]?.category || 'None'
};

console.log('=== Business Metrics Summary ===');
console.log('Total Orders:', metrics.totalOrders);
console.log('Total Revenue:', `$${metrics.totalRevenue.toLocaleString()}`);
console.log('Avg Order Value:', `$${metrics.avgOrderValue.toFixed(2)}`);
console.log('Total Items Sold:', metrics.totalItemsSold);
console.log('Unique Customers:', metrics.uniqueCustomers);
console.log('Unique Products:', metrics.uniqueProducts);
console.log('Completion Rate:', metrics.completionRate + '%');
console.log('Top Category:', metrics.topCategory);
