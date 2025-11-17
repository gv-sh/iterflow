import { iter } from '../src/index.js';

// Basic statistical operations
const numbers = [1, 2, 3, 4, 5];

console.log('Numbers:', numbers);
console.log('Mean:', iter(numbers).mean());     // 3
console.log('Median:', iter(numbers).median()); // 3
console.log('Sum:', iter(numbers).sum());       // 15
console.log('Min:', iter(numbers).min());       // 1
console.log('Max:', iter(numbers).max());       // 5
