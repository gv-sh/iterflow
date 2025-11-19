# Performance Benchmarks

This document describes the benchmark suite for iterflow and provides performance characteristics and comparison with native array methods, lodash, and ramda.

## Running Benchmarks

The benchmark suite uses Vitest's benchmark API. You can run benchmarks using the following commands:

```bash
# Run all benchmarks
npm run bench

# Run specific benchmark suites
npm run bench:transformations  # Map, filter, flatMap, take operations
npm run bench:terminals        # Reduce, find, some, every, count operations
npm run bench:statistics       # Sum, mean, median, variance, stddev, groupBy operations
npm run bench:windowing        # Chunk, window, skip, partition operations
npm run bench:lazy             # Lazy evaluation and early termination benchmarks
npm run bench:memory           # Memory efficiency profiling for windowing
```

## Benchmark Categories

### 1. Transformation Operations (`transformations.bench.ts`)

Benchmarks for common transformation operations across different array sizes:
- **Map**: Transform each element
- **Filter**: Select elements matching a predicate
- **FlatMap**: Map and flatten results
- **Take**: Get first N elements
- **Map + Filter chains**: Combined transformations

**Array sizes tested**: 100, 1,000, 10,000 items

**Libraries compared**: iterflow, native array, lodash, ramda

### 2. Terminal Operations (`terminals.bench.ts`)

Benchmarks for operations that consume the iterator:
- **Reduce**: Aggregate values with accumulator
- **Find**: Locate first matching element (early/late match scenarios)
- **Some**: Test if any element matches
- **Every**: Test if all elements match (all pass/early failure scenarios)
- **Count**: Count elements

**Array sizes tested**: 100, 1,000, 10,000 items

**Libraries compared**: iterflow, native array, lodash, ramda

### 3. Statistical Operations (`statistics.bench.ts`)

Benchmarks for statistical computations:
- **Sum**: Calculate total
- **Mean**: Calculate average
- **Min/Max**: Find minimum/maximum values
- **Median**: Calculate middle value
- **Variance**: Calculate variance
- **Standard Deviation**: Calculate stddev
- **GroupBy**: Group elements by key function

**Array sizes tested**: 100, 1,000, 10,000 items

**Libraries compared**: iterflow, lodash, ramda, manual calculations

### 4. Windowing Operations (`windowing.bench.ts`)

Benchmarks for window and chunk operations:
- **Chunk**: Split into fixed-size chunks
- **Window**: Create sliding windows
- **Moving Average**: Calculate rolling averages
- **Skip**: Skip first N elements
- **Partition**: Split by predicate

**Array sizes tested**: 100, 1,000, 10,000 items

**Libraries compared**: iterflow, lodash, ramda, manual implementations

### 5. Lazy Evaluation (`lazy-evaluation.bench.ts`)

Benchmarks demonstrating the benefits of lazy evaluation:
- **Early Termination**: Find operations that stop early
- **Take After Transform**: Taking small subset after expensive operations
- **Short-Circuit Operations**: Some/every with complex chains
- **Memory Efficiency**: Large pipelines without materialization
- **Infinite Iterator Simulation**: Processing generator sequences
- **Filter Heavy Chains**: Multiple consecutive filters

**Array sizes tested**: 10,000, 100,000 items

**Libraries compared**: iterflow (lazy), native array (eager), lodash chain

### 6. Memory Profiling (`memory-profiling.bench.ts`)

Benchmarks focused on memory efficiency:
- **Window Operations**: Lazy vs eager window creation
- **Chunk Operations**: Lazy vs eager chunking
- **Complex Pipelines**: Windowing with transformations
- **Generator Integration**: Working with infinite sequences
- **Skip + Window Patterns**: Combined operations on large datasets

**Key Insight**: Lazy evaluation avoids materializing intermediate results, reducing memory footprint significantly for large datasets or when only a subset of results is needed.

## Performance Characteristics

### When to Use iterflow

iterflow excels in the following scenarios:

#### 1. **Early Termination Scenarios**
When you only need a subset of results from a large dataset:
```typescript
// Only processes until finding the first match
iter(largeArray)
  .map(expensiveTransform)
  .find(predicate);
```

#### 2. **Large Data Pipelines**
Multiple transformations on large datasets:
```typescript
// Processes elements one at a time through entire pipeline
iter(hugeArray)
  .map(transform1)
  .filter(predicate1)
  .map(transform2)
  .filter(predicate2)
  .take(10);
```

#### 3. **Windowing Operations**
Sliding windows or chunking with minimal memory:
```typescript
// Only materializes windows as needed
iter(data)
  .window(100)
  .map(calculateWindowStats)
  .take(10);
```

#### 4. **Working with Generators**
Processing infinite or very large sequences:
```typescript
iter(infiniteGenerator())
  .filter(predicate)
  .take(100)
  .toArray();
```

#### 5. **Statistical Operations**
Built-in statistical functions are optimized:
```typescript
iter(numbers).mean();
iter(numbers).median();
iter(numbers).variance();
```

### When Native Arrays May Be Faster

Native array methods are typically faster for:

#### 1. **Small Arrays (< 1000 items)**
Native array methods have lower overhead for small datasets.

#### 2. **Full Materialization**
When you need all results anyway:
```typescript
// Native is faster here
array.map(x => x * 2).filter(x => x > 10);
```

#### 3. **Single Operations**
Single transformation on entire array:
```typescript
// Native is faster
array.map(transform);
```

## Performance Tips

1. **Use `take()` for early termination**: When you only need first N results, use `take()` early in the pipeline
2. **Combine predicates when possible**: Multiple filters can sometimes be combined into one
3. **Use statistical methods**: Built-in methods like `sum()`, `mean()`, `median()` are optimized
4. **Avoid unnecessary `toArray()` calls**: Only materialize when you need an array
5. **Use `count()` instead of `toArray().length`**: For counting, avoid materialization
6. **Use windowing for time-series data**: The `window()` and `chunk()` methods are memory-efficient

## Continuous Integration

To enable automated performance benchmarks in CI, add a GitHub Actions workflow file at `.github/workflows/performance.yml`.

**Recommended workflow features:**
- **Push to main/master**: Run full benchmark suite
- **Pull requests**: Run full benchmark suite with results commented on PR
- **Manual trigger**: Allow workflow dispatch for on-demand runs
- **Artifacts**: Store benchmark results for 90 days for historical comparison
- **Matrix strategy**: Run individual benchmark suites in parallel

**Example workflow configuration:**
```yaml
name: Performance Benchmarks

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  workflow_dispatch:

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run bench
```

For a complete workflow example with PR comments and artifact uploads, see the project's GitHub discussions or issues.

## Contributing

When adding new features:
1. Add corresponding benchmarks in the appropriate file
2. Compare against native/lodash/ramda equivalents where applicable
3. Document any performance characteristics in this file
4. Ensure benchmarks pass in CI

## Benchmark Methodology

- **Framework**: Vitest benchmark API
- **Iterations**: Automatically determined by Vitest for statistical significance
- **Metrics Reported**:
  - `hz`: Operations per second
  - `min/max`: Minimum and maximum execution time
  - `mean`: Average execution time
  - `p75/p99`: 75th and 99th percentile times
  - `rme`: Relative margin of error
  - `samples`: Number of samples collected

## Future Improvements

- [ ] Add comparison with native ES2025 iterator helpers when available
- [ ] Add real-world use case benchmarks (log parsing, CSV processing)
- [ ] Add visualization of benchmark results over time
- [ ] Add memory profiling with heap snapshots
- [ ] Automated performance regression detection in CI
