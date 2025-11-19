import { iter } from '../src/index.js';

/**
 * Advanced Time Series Analysis Example
 *
 * Demonstrates:
 * - Simple Moving Average (SMA)
 * - Exponential Moving Average (EMA)
 * - Bollinger Bands
 * - Trend detection
 * - Statistical analysis on time series data
 */

// Stock price data (simulated daily closing prices)
const stockPrices = [
  100, 102, 101, 105, 108, 107, 110, 112, 109, 111,
  115, 118, 116, 120, 119, 122, 125, 123, 126, 130,
  128, 132, 135, 133, 137, 140, 138, 142, 145, 143
];

console.log('=== Time Series Analysis Example ===\n');
console.log('Stock Prices:', stockPrices);
console.log('');

// 1. Simple Moving Average (SMA) - 5 day
const sma5 = iter(stockPrices)
  .window(5)
  .map(window => iter(window).mean())
  .toArray();

console.log('5-Day Simple Moving Average (SMA):');
console.log(sma5.map(v => v.toFixed(2)));
console.log('');

// 2. Multiple Moving Averages (short and long term)
const sma10 = iter(stockPrices)
  .window(10)
  .map(window => iter(window).mean())
  .toArray();

const sma20 = iter(stockPrices)
  .window(20)
  .map(window => iter(window).mean())
  .toArray();

console.log('10-Day SMA:', sma10.map(v => v.toFixed(2)));
console.log('20-Day SMA:', sma20.map(v => v.toFixed(2)));
console.log('');

// 3. Exponential Moving Average (EMA) - manual implementation
function calculateEMA(data: number[], period: number): number[] {
  const k = 2 / (period + 1); // Smoothing factor
  const ema: number[] = [];

  // Start with SMA for first value
  const firstSMA = iter(data).take(period).mean();
  ema.push(firstSMA);

  // Calculate EMA for remaining values
  for (let i = period; i < data.length; i++) {
    const emaValue = data[i] * k + ema[ema.length - 1] * (1 - k);
    ema.push(emaValue);
  }

  return ema;
}

const ema12 = calculateEMA(stockPrices, 12);
console.log('12-Day Exponential Moving Average (EMA):');
console.log(ema12.map(v => v.toFixed(2)));
console.log('');

// 4. Bollinger Bands (SMA ± 2 standard deviations)
const bollingerPeriod = 20;
const bollingerBands = iter(stockPrices)
  .window(bollingerPeriod)
  .map(window => {
    const prices = Array.from(window);
    const mean = iter(prices).mean();
    const stdDev = iter(prices).stdDev();

    return {
      middle: mean,
      upper: mean + 2 * stdDev,
      lower: mean - 2 * stdDev
    };
  })
  .toArray();

console.log('Bollinger Bands (20-period):');
console.log('Last 3 readings:');
bollingerBands.slice(-3).forEach((band, i) => {
  console.log(`  Reading ${bollingerBands.length - 3 + i + 1}:`);
  console.log(`    Upper: ${band.upper.toFixed(2)}`);
  console.log(`    Middle: ${band.middle.toFixed(2)}`);
  console.log(`    Lower: ${band.lower.toFixed(2)}`);
});
console.log('');

// 5. Price Change Analysis
const priceChanges = iter(stockPrices)
  .pairwise()
  .map(([prev, curr]) => curr - prev)
  .toArray();

const avgDailyChange = iter(priceChanges).mean();
const volatility = iter(priceChanges).stdDev();

console.log('Price Change Analysis:');
console.log('Average Daily Change:', avgDailyChange.toFixed(2));
console.log('Volatility (Std Dev):', volatility.toFixed(2));
console.log('');

// 6. Trend Detection - count consecutive up/down days
const trends = iter(priceChanges)
  .scan({ count: 0, direction: 'none' as 'up' | 'down' | 'none' }, (acc, change) => {
    if (change > 0) {
      return acc.direction === 'up'
        ? { count: acc.count + 1, direction: 'up' }
        : { count: 1, direction: 'up' };
    } else if (change < 0) {
      return acc.direction === 'down'
        ? { count: acc.count + 1, direction: 'down' }
        : { count: 1, direction: 'down' };
    }
    return acc;
  })
  .toArray();

const longestUptrend = iter(trends)
  .filter(t => t.direction === 'up')
  .map(t => t.count)
  .max();

const longestDowntrend = iter(trends)
  .filter(t => t.direction === 'down')
  .map(t => t.count)
  .max();

console.log('Trend Analysis:');
console.log('Longest Uptrend:', longestUptrend, 'days');
console.log('Longest Downtrend:', longestDowntrend, 'days');
console.log('');

// 7. Statistical Summary
const stats = {
  count: stockPrices.length,
  mean: iter(stockPrices).mean(),
  median: iter(stockPrices).median(),
  min: iter(stockPrices).min(),
  max: iter(stockPrices).max(),
  range: iter(stockPrices).span(),
  variance: iter(stockPrices).variance(),
  stdDev: iter(stockPrices).stdDev(),
  quartiles: iter(stockPrices).quartiles()
};

console.log('Statistical Summary:');
console.log('Count:', stats.count);
console.log('Mean:', stats.mean.toFixed(2));
console.log('Median:', stats.median.toFixed(2));
console.log('Min:', stats.min.toFixed(2));
console.log('Max:', stats.max.toFixed(2));
console.log('Range:', stats.range.toFixed(2));
console.log('Variance:', stats.variance.toFixed(2));
console.log('Std Dev:', stats.stdDev.toFixed(2));
console.log('Quartiles:', {
  Q1: stats.quartiles.Q1.toFixed(2),
  Q2: stats.quartiles.Q2.toFixed(2),
  Q3: stats.quartiles.Q3.toFixed(2)
});
console.log('');

// 8. Resistance and Support Levels (peaks and troughs)
const peaks = iter(stockPrices)
  .enumerate()
  .filter(([i, price]) => {
    if (i === 0 || i === stockPrices.length - 1) return false;
    return price > stockPrices[i - 1] && price > stockPrices[i + 1];
  })
  .map(([_, price]) => price)
  .toArray();

const troughs = iter(stockPrices)
  .enumerate()
  .filter(([i, price]) => {
    if (i === 0 || i === stockPrices.length - 1) return false;
    return price < stockPrices[i - 1] && price < stockPrices[i + 1];
  })
  .map(([_, price]) => price)
  .toArray();

console.log('Technical Levels:');
console.log('Resistance (peaks):', peaks);
console.log('Support (troughs):', troughs);
if (peaks.length > 0) {
  console.log('Average Resistance:', iter(peaks).mean().toFixed(2));
}
if (troughs.length > 0) {
  console.log('Average Support:', iter(troughs).mean().toFixed(2));
}
