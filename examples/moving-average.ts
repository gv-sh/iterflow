import { iter } from '../src/index.js';

// Calculate 3-day moving average for temperature data
const temperatures = [20, 22, 25, 23, 21, 19, 18, 20, 22, 24, 26, 25];

const movingAverage = iter(temperatures)
  .window(3)
  .map(window => iter(window).mean())
  .toArray();

console.log('Temperatures:', temperatures);
console.log('3-day moving average:', movingAverage);
