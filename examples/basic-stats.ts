import { iter } from '../src/index.js';

// Basic statistical operations
const numbers = [1, 2, 3, 4, 5];

console.log('Numbers:', numbers);
console.log('Mean:', iter(numbers).mean());     // 3
console.log('Median:', iter(numbers).median()); // 3
console.log('Sum:', iter(numbers).sum());       // 15
console.log('Min:', iter(numbers).min());       // 1
console.log('Max:', iter(numbers).max());       // 5

// Advanced statistical operations
console.log('\n--- Advanced Statistical Operations ---\n');

// Mode - most frequent value(s)
const modeData = [1, 2, 2, 3, 3, 3, 4];
console.log('Mode Data:', modeData);
console.log('Mode:', iter(modeData).mode());    // [3]

const bimodalData = [1, 1, 2, 2, 3];
console.log('Bimodal Data:', bimodalData);
console.log('Mode:', iter(bimodalData).mode()); // [1, 2]

// Quartiles - Q1, Q2 (median), Q3
const quartilesData = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log('\nQuartiles Data:', quartilesData);
console.log('Quartiles:', iter(quartilesData).quartiles());
// { Q1: 3, Q2: 5, Q3: 7 }

// Span - range from min to max
console.log('\nSpan Data:', numbers);
console.log('Span:', iter(numbers).span());   // 4

// Product - product of all values
const productData = [1, 2, 3, 4, 5];
console.log('\nProduct Data:', productData);
console.log('Product:', iter(productData).product()); // 120

// Covariance - joint variability of two sequences
const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];
console.log('\nCovariance:');
console.log('X:', x);
console.log('Y:', y);
console.log('Covariance:', iter(x).covariance(y)); // 4

// Correlation - Pearson correlation coefficient
console.log('\nCorrelation (perfect positive):');
console.log('X:', x);
console.log('Y:', y);
console.log('Correlation:', iter(x).correlation(y)); // 1

const negativeY = [5, 4, 3, 2, 1];
console.log('\nCorrelation (perfect negative):');
console.log('X:', x);
console.log('Y:', negativeY);
console.log('Correlation:', iter(x).correlation(negativeY)); // -1
