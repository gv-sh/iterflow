# iterflow Starter Template

A minimal starter template for building projects with iterflow.

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

### Running the Project

```bash
# Development mode (with hot reload)
npm run dev

# Build the project
npm run build

# Run the built project
npm start

# Type checking only
npm run type-check
```

## Project Structure

```
starter-template/
├── src/
│   ├── index.ts          # Main entry point
│   ├── examples/         # Example implementations
│   │   ├── basic.ts      # Basic operations
│   │   ├── advanced.ts   # Advanced operations
│   │   └── async.ts      # Async operations
│   └── utils/            # Utility functions
├── package.json
├── tsconfig.json
└── README.md
```

## What's Included

This template includes:

- ✅ TypeScript configuration
- ✅ Basic iterflow examples
- ✅ Advanced patterns
- ✅ Async iterator examples
- ✅ Type-safe utilities
- ✅ Development scripts

## Examples

See `src/examples/` for various usage examples:

- **basic.ts**: Simple operations like map, filter, reduce
- **advanced.ts**: Complex transformations and pipelines
- **async.ts**: Working with async iterators

## Customization

### Using Your Own Data

Replace the sample data in `src/index.ts` with your own:

```typescript
import { iter } from 'iterflow';

// Your data source
const myData = [/* your data */];

// Process with iterflow
const result = iter(myData)
  .filter(item => /* your condition */)
  .map(item => /* your transformation */)
  .toArray();
```

### Adding Dependencies

```bash
npm install <package-name>
npm install -D <dev-package-name>
```

## Learn More

- [iterflow Documentation](https://github.com/gv-sh/iterflow)
- [API Reference](https://github.com/gv-sh/iterflow#api-reference)
- [More Examples](https://github.com/gv-sh/iterflow/tree/main/examples)

## Need Help?

- [GitHub Discussions](https://github.com/gv-sh/iterflow/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/iterflow)

## License

MIT
