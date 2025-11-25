# Evaluation Plan for IterFlow Paper

This document outlines the benchmarks and evaluations needed to support the claims in the technical paper.

---

## Research Questions

| ID | Question | Required Evidence |
|----|----------|-------------------|
| RQ1 | Memory efficiency vs eager alternatives | Memory profiling benchmarks |
| RQ2 | Throughput impact of lazy evaluation | Operations/second measurements |
| RQ3 | Early termination benefits | Comparative timing experiments |
| RQ4 | Statistical accuracy | Numerical comparison with reference implementations |

---

## Benchmark Suite

### 1. Memory Usage Benchmarks

#### 1.1 Pipeline Memory Overhead

**Purpose:** Demonstrate O(1) vs O(n) memory usage

**Methodology:**
```javascript
// Measure heap usage during:
// filter → map → take(100) pipeline

const sizes = [1_000, 10_000, 100_000, 1_000_000, 10_000_000];

for (const n of sizes) {
  const data = generateData(n);

  // Measure: Native Array
  const memNative = measureHeap(() => {
    data
      .filter(x => x > 0.5)
      .map(x => x * 2)
      .slice(0, 100);
  });

  // Measure: Lodash
  const memLodash = measureHeap(() => {
    _.take(_.map(_.filter(data, x => x > 0.5), x => x * 2), 100);
  });

  // Measure: IterFlow
  const memIterFlow = measureHeap(() => {
    iter(data)
      .filter(x => x > 0.5)
      .map(x => x * 2)
      .take(100)
      .toArray();
  });
}
```

**Expected Results:**
| n | Native | Lodash | IterFlow |
|---|--------|--------|----------|
| 1K | ~16KB | ~16KB | ~8KB |
| 10K | ~160KB | ~160KB | ~8KB |
| 100K | ~1.6MB | ~1.6MB | ~8KB |
| 1M | ~16MB | ~16MB | ~8KB |
| 10M | ~160MB | ~160MB | ~8KB |

**Tools:**
- `process.memoryUsage().heapUsed` (Node.js)
- V8 heap snapshots for detailed analysis
- `gc()` calls between measurements

---

#### 1.2 Window Operation Memory

**Purpose:** Show circular buffer efficiency

**Methodology:**
```javascript
// Compare sliding window implementations
const data = generateData(100_000);

// Naive: Creates n windows of size w
const memNaive = measureHeap(() => {
  const windows = [];
  for (let i = 0; i <= data.length - 100; i++) {
    windows.push(data.slice(i, i + 100));
  }
});

// IterFlow: O(w) circular buffer
const memIterFlow = measureHeap(() => {
  iter(data).window(100).toArray();
});
```

**Expected:** IterFlow uses ~100× less memory during iteration (before toArray).

---

### 2. Throughput Benchmarks

#### 2.1 Single Operation Throughput

**Purpose:** Measure overhead of lazy evaluation wrapper

**Methodology:**
```javascript
import Benchmark from 'benchmark';

const data = Array.from({length: 100_000}, () => Math.random());

const suite = new Benchmark.Suite();

suite
  .add('Native map', () => data.map(x => x * 2))
  .add('Lodash map', () => _.map(data, x => x * 2))
  .add('IterFlow map', () => iter(data).map(x => x * 2).toArray())
  .run();
```

**Metrics:**
- Operations per second
- Standard deviation
- Statistical significance (p < 0.05)

---

#### 2.2 Pipeline Throughput

**Purpose:** Show lazy evaluation benefits for compound operations

**Methodology:**
```javascript
// 3-operation pipeline
const pipeline = (data) => {
  // Native
  const native = data
    .filter(x => x > 0.5)
    .map(x => x * 2)
    .filter(x => x < 1.5);

  // IterFlow
  const iterflow = iter(data)
    .filter(x => x > 0.5)
    .map(x => x * 2)
    .filter(x => x < 1.5)
    .toArray();
};
```

**Expected:** IterFlow approaches or exceeds eager alternatives for 3+ operations due to fusion.

---

### 3. Early Termination Benchmarks

#### 3.1 find() with Expensive Transformation

**Purpose:** Demonstrate dramatic benefits of lazy evaluation

**Methodology:**
```javascript
const data = Array.from({length: 1_000_000}, (_, i) => i);
const expensive = (x) => { /* simulate work */ return x * 2; };
const target = 100; // Found at index 50

// Lodash (processes all, then finds)
const lodashTime = measure(() => {
  _.find(_.map(data, expensive), x => x === target * 2);
});

// IterFlow (stops at index 50)
const iterflowTime = measure(() => {
  iter(data).map(expensive).find(x => x === target * 2);
});
```

**Expected:** 10,000×+ speedup when target is near beginning.

---

#### 3.2 take() with Infinite Sequence

**Purpose:** Show capability with unbounded data

**Methodology:**
```javascript
function* infiniteNumbers() {
  let n = 0;
  while (true) yield n++;
}

// Only IterFlow can handle this
const result = iter(infiniteNumbers())
  .filter(x => x % 2 === 0)
  .map(x => x * x)
  .take(10)
  .toArray();
// [0, 4, 16, 36, 64, 100, 144, 196, 256, 324]
```

**Comparison:** Document that Lodash/native cannot handle infinite sequences.

---

### 4. Statistical Accuracy Benchmarks

#### 4.1 Numerical Accuracy Comparison

**Purpose:** Validate statistical calculations

**Methodology:**
```javascript
import { mean, variance, median } from 'simple-statistics';

const testCases = [
  [1, 2, 3, 4, 5],
  Array.from({length: 10000}, () => Math.random()),
  [0.1, 0.2, 0.3],  // Floating point edge cases
  [1e10, 1, -1e10], // Large magnitude differences
];

for (const data of testCases) {
  // Reference
  const refMean = mean(data);
  const refVar = variance(data);
  const refMed = median(data);

  // IterFlow
  const ifMean = iter(data).mean();
  const ifVar = iter(data).variance();
  const ifMed = iter(data).median();

  // Assert equality within floating point tolerance
  assert(Math.abs(refMean - ifMean) < 1e-10);
  assert(Math.abs(refVar - ifVar) < 1e-10);
  assert(Math.abs(refMed - ifMed) < 1e-10);
}
```

---

#### 4.2 Statistical Operation Performance

**Purpose:** Compare performance with dedicated statistical libraries

**Methodology:**
```javascript
const data = Array.from({length: 100_000}, () => Math.random());

const suite = new Benchmark.Suite();

suite
  .add('simple-statistics mean', () => ss.mean(data))
  .add('IterFlow mean', () => iter(data).mean())
  .add('simple-statistics variance', () => ss.variance(data))
  .add('IterFlow variance', () => iter(data).variance())
  .add('simple-statistics percentile', () => ss.quantile(data, 0.95))
  .add('IterFlow percentile', () => iter(data).percentile(95))
  .run();
```

**Expected:** IterFlow within 20-50% of dedicated libraries (acceptable trade-off for integration benefits).

---

### 5. Real-World Workload Benchmarks

#### 5.1 CSV Processing

**Purpose:** Demonstrate practical applicability

**Scenario:**
```javascript
// Process 1M-row CSV: filter, transform, calculate statistics

const csvData = loadCSV('large_dataset.csv'); // 1M rows

// Task: Filter active users, calculate average transaction

// IterFlow
const result = iter(csvData)
  .filter(row => row.status === 'active')
  .map(row => parseFloat(row.amount))
  .mean();
```

**Metrics:**
- Time to completion
- Peak memory usage
- Comparison with pandas (if applicable)

---

#### 5.2 Time Series Analysis

**Purpose:** Show windowing for practical data science

**Scenario:**
```javascript
// Calculate 7-day moving average of stock prices

const prices = loadPrices(); // Daily prices, 10 years = ~2500 points

const movingAvg = iter(prices)
  .window(7)
  .map(week => iter(week).mean())
  .toArray();
```

---

### 6. Comparison Matrix

#### 6.1 Feature Comparison

| Feature | Native | Lodash | Ramda | IterFlow |
|---------|--------|--------|-------|----------|
| Lazy evaluation | ❌ | ❌ | ❌ | ✅ |
| sum | ❌ | ✅ | ❌ | ✅ |
| mean | ❌ | ✅ | ✅ | ✅ |
| median | ❌ | ❌ | ✅ | ✅ |
| variance | ❌ | ❌ | ❌ | ✅ |
| stdDev | ❌ | ❌ | ❌ | ✅ |
| percentile | ❌ | ❌ | ❌ | ✅ |
| correlation | ❌ | ❌ | ❌ | ✅ |
| window | ❌ | ❌ | ❌ | ✅ |
| chunk | ❌ | ✅ | ❌ | ✅ |
| Infinite sequences | ❌ | ❌ | ❌ | ✅ |
| TypeScript types | Partial | ✅ | ✅ | ✅ |
| Zero dependencies | ✅ | ❌ | ❌ | ✅ |

---

## Benchmark Infrastructure

### Tools Required

1. **Benchmark.js** - Statistical benchmarking
2. **V8 Profiler** - Memory analysis
3. **Node.js gc()** - Controlled garbage collection
4. **simple-statistics** - Reference implementation
5. **Lodash** - Comparison baseline
6. **Ramda** - Comparison baseline

### Reporting Requirements

For each benchmark:
- Mean ± standard deviation
- 95% confidence interval
- Number of iterations
- Warm-up runs discarded
- Statistical significance test

### Environment Specification

Document in paper:
- Node.js version
- V8 version
- CPU model and speed
- RAM amount
- OS and version
- Any relevant flags (--max-old-space-size, etc.)

---

## Timeline

| Week | Task |
|------|------|
| 1 | Set up benchmark infrastructure |
| 2 | Memory benchmarks (1.1, 1.2) |
| 3 | Throughput benchmarks (2.1, 2.2) |
| 4 | Early termination benchmarks (3.1, 3.2) |
| 5 | Statistical accuracy benchmarks (4.1, 4.2) |
| 6 | Real-world workloads (5.1, 5.2) |
| 7 | Analysis and visualization |
| 8 | Paper integration |

---

## Success Criteria

The evaluation should demonstrate:

1. **Memory:** ≥10× reduction for pipelines with take/find
2. **Throughput:** ≤20% overhead for single operations; ≥equivalent for pipelines
3. **Early Termination:** ≥100× speedup in favorable scenarios
4. **Accuracy:** Numerical equivalence with reference implementations
5. **Practicality:** Competitive performance on real-world workloads
