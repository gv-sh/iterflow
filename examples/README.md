# IterFlow Examples

Practical examples demonstrating IterFlow's capabilities.

## Running Examples

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run any example with ts-node or compile and run
npx tsx examples/basic-stats.ts
npx tsx examples/moving-average.ts
npx tsx examples/fibonacci.ts
npx tsx examples/chaining.ts
```

## Examples

### basic-stats.ts
Basic statistical operations like mean, median, sum, min, and max.

### moving-average.ts
Calculate moving averages using sliding windows - useful for time series data.

### fibonacci.ts
Working with infinite sequences - demonstrates lazy evaluation by filtering even Fibonacci numbers.

### chaining.ts
Real-world data processing pipeline showing filtering, mapping, and aggregation on sales data.
