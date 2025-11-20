# Iterflow StackBlitz Playground

Interactive playground for [iterflow](https://github.com/gv-sh/iterflow) - powerful iterator utilities for TypeScript/JavaScript.

## 🚀 Quick Start

This StackBlitz project demonstrates iterflow capabilities with interactive examples that run in your browser!

### Features

- ✨ Live code editing
- 📊 Visual output display
- 🔍 Browser console integration
- 💡 Real-world examples

## 📚 Examples Included

1. **Basic Pipeline** - Map and filter operations
2. **Statistical Analysis** - Mean, median, standard deviation
3. **Moving Average** - Sliding window calculations
4. **Group By** - Data organization
5. **Lazy Evaluation** - Efficient large dataset processing
6. **Unique & Sort** - Data deduplication and sorting
7. **Chunking** - Split data into groups

## 🎯 Try It Out

1. Open `index.ts`
2. Modify the examples or add your own
3. See results update in real-time!

## 📖 Learn More

- [GitHub Repository](https://github.com/gv-sh/iterflow)
- [Full Documentation](https://github.com/gv-sh/iterflow#readme)
- [API Reference](https://github.com/gv-sh/iterflow/blob/main/docs/api.md)
- [npm Package](https://www.npmjs.com/package/iterflow)

## 🛠️ Common Methods

```typescript
// Transformations
.map(fn)        // Transform each element
.filter(fn)     // Keep matching elements
.take(n)        // Take first n elements
.drop(n)        // Skip first n elements
.unique()       // Remove duplicates
.flatMap(fn)    // Map and flatten

// Windowing
.chunk(size)    // Fixed-size groups
.window(size)   // Sliding windows

// Grouping
.groupBy(fn)    // Group by key
.partition(fn)  // Split into two groups

// Statistics
.mean()         // Average
.median()       // Middle value
.sum()          // Total
.min()          // Minimum
.max()          // Maximum
.stddev()       // Standard deviation

// Terminals
.toArray()      // Collect to array
.toSet()        // Collect to Set
.count()        // Count elements
.reduce(fn)     // Reduce to single value
```

## 💡 Tips

- Check browser console for detailed output
- All operations are lazy - they only run when needed
- Chain multiple operations for powerful data pipelines
- Works with any iterable (arrays, sets, generators, etc.)

Happy coding! 🎉
