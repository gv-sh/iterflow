# Iterflow Starter Template

Welcome to the Iterflow starter template! This sandbox provides a quick way to experiment with [iterflow](https://github.com/gv-sh/iterflow) - powerful iterator utilities for TypeScript/JavaScript.

## Getting Started

The `index.ts` file contains several examples to get you started:

1. **Basic Transformations** - map, filter, and array operations
2. **Statistical Operations** - mean, median, sum, min, max
3. **Windowing** - sliding windows and moving averages
4. **Grouping** - group and partition data
5. **Lazy Evaluation** - efficient processing of large datasets

## Running the Code

Click the "Run" button or the terminal will automatically execute the code when you make changes.

## Learn More

- [GitHub Repository](https://github.com/gv-sh/iterflow)
- [Full Documentation](https://github.com/gv-sh/iterflow#readme)
- [API Reference](https://github.com/gv-sh/iterflow/blob/main/docs/api.md)

## Quick Reference

### Common Methods

```typescript
import { iter } from 'iterflow';

// Transformations
iter(data).map(fn)
iter(data).filter(fn)
iter(data).flatMap(fn)
iter(data).take(n)
iter(data).drop(n)
iter(data).unique()

// Windowing
iter(data).chunk(size)
iter(data).window(size)

// Grouping
iter(data).groupBy(keyFn)
iter(data).partition(predicateFn)

// Statistics
iter(data).mean()
iter(data).median()
iter(data).sum()
iter(data).min()
iter(data).max()
iter(data).stddev()

// Terminals
iter(data).toArray()
iter(data).toSet()
iter(data).reduce(fn, init)
iter(data).forEach(fn)
iter(data).find(fn)
```

Happy coding! 🚀
