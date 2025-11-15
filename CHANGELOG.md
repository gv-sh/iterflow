# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


### Added

#### Core Features
- **IterFlow class** - Main wrapper for iterator operations
- **Factory function** - `iter()` for creating IterFlow instances
- **Dual API support** - Both wrapper and functional programming styles

#### Statistical Operations
- `sum()` - Sum all numeric values
- `mean()` - Calculate arithmetic mean
- `min()` / `max()` - Find minimum/maximum values
- `count()` - Count elements in iterator
- `median()` - Calculate median value
- `variance()` - Calculate population variance
- `stdDev()` - Calculate standard deviation
- `percentile(p)` - Calculate p-th percentile

#### Windowing Operations
- `window(size)` - Sliding window with overlapping elements
- `chunk(size)` - Non-overlapping groups of elements
- `pairwise()` - Consecutive pairs of elements

#### Grouping & Partitioning
- `partition(predicate)` - Split into two arrays based on condition
- `groupBy(keyFn)` - Group elements by key function result

#### Set Operations
- `distinct()` - Remove duplicate elements
- `distinctBy(keyFn)` - Remove duplicates by key function

#### Combining Operations
- `iter.zip(iter1, iter2)` - Combine two iterators element-wise
- `iter.zipWith(iter1, iter2, fn)` - Combine with custom function

#### Utility Operations
- `tap(fn)` - Execute side effects without modifying stream
- `takeWhile(predicate)` - Take elements while condition is true
- `dropWhile(predicate)` - Drop elements while condition is true
- `toArray()` - Convert to array (terminal operation)

#### Generator Functions
- `iter.range(stop)` / `iter.range(start, stop, step)` - Numeric sequences
- `iter.repeat(value, times?)` - Repeat value finite or infinite times

#### Native Iterator Support
- `map(fn)` - Transform elements
- `filter(predicate)` - Filter elements
- `take(limit)` - Take first N elements
- `drop(count)` - Skip first N elements
- `flatMap(fn)` - Map and flatten results

### Technical Features
- **TypeScript-first** - Complete type safety and inference
- **ES2022+ compatibility** - Modern JavaScript features
- **Zero dependencies** - Pure TypeScript/JavaScript implementation
- **Tree-shakeable** - Import only what you need
- **Lazy evaluation** - Efficient processing of large/infinite sequences
- **Dual exports** - ESM and CommonJS support

### Documentation
- Complete API reference documentation
- Comprehensive README with examples
- TypeScript type definitions
- Usage examples and best practices

### Development Tools
- Full test suite with 109 tests
- TypeScript strict mode configuration
- ESLint code quality checks
- Vitest testing framework
- Build pipeline with tsup
- GitHub Actions CI/CD
- Code coverage reporting

[0.1.0]: https://github.com/gv-sh/iterflow/releases/tag/v0.1.0