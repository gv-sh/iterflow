# Iterflow Snippets for VS Code

Code snippets for [iterflow](https://github.com/gv-sh/iterflow) - powerful iterator utilities for TypeScript/JavaScript.

## Features

This extension provides IntelliSense code snippets for iterflow methods and patterns, making it easier to write iterator pipelines.

## Snippets

All snippets are prefixed with `i` (for iterflow) to avoid conflicts with other extensions.

### Import Snippets

- `iiter` - Import iter from iterflow
- `iiterfn` - Import functional API from iterflow

### Creation & Pipeline

- `iiter-create` - Create an iterflow iterator with method chaining
- `ipipe` - Create functional pipeline with pipe()

### Transformation Operations

- `imap` - Map transformation
- `ifilter` - Filter transformation
- `iflatmap` - FlatMap transformation
- `itake` - Take first N items
- `idrop` - Drop first N items
- `ichunk` - Chunk into arrays
- `iwindow` - Create sliding window
- `iunique` - Get unique values
- `ienumerate` - Add index to each element
- `izip` - Zip with another iterator

### Grouping & Partitioning

- `igroupby` - Group by key function
- `ipartition` - Partition into two groups

### Terminal Operations

- `ireduce` - Reduce to single value
- `itoarray` - Convert to array
- `itoset` - Convert to Set
- `itomap` - Convert to Map
- `ifind` - Find first matching item
- `isome` - Test if any item matches
- `ievery` - Test if all items match
- `icount` - Count items

### Statistical Operations

- `imean` - Calculate mean/average
- `imedian` - Calculate median
- `isum` - Sum all values
- `imin` - Find minimum value
- `imax` - Find maximum value
- `istddev` - Calculate standard deviation
- `ivariance` - Calculate variance
- `imovingavg` - Calculate moving average

### Async Operations

- `iasync` - Create async iterator

## Usage

1. Type a snippet prefix (e.g., `iiter`)
2. Press `Tab` to expand the snippet
3. Use `Tab` to navigate between placeholder fields
4. Press `Enter` to finish

## Example

Type `iiter-create` and press Tab:

```typescript
const result = iter(data)
  .map(x => x)
  .toArray();
```

## Requirements

This extension provides snippets for the [iterflow](https://www.npmjs.com/package/iterflow) library. Install it in your project:

```bash
npm install iterflow
```

## Release Notes

### 0.1.0

- Initial release
- 30+ snippets for common iterflow operations
- Support for both wrapper and functional APIs
- Statistical operations snippets
- Async iterator snippets

## License

MIT

## Links

- [iterflow on GitHub](https://github.com/gv-sh/iterflow)
- [iterflow on npm](https://www.npmjs.com/package/iterflow)
