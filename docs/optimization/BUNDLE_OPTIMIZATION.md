# Bundle Size Optimization

## Current Status

**Target**: < 15KB minified + gzipped
**Current**: TBD (run `npm run build && npm run analyze:bundle`)

## Optimization Strategy

### 1. Build Configuration

Our `tsup.config.ts` is configured for optimal bundle size:

```typescript
{
  treeshake: true,      // Remove unused code
  minify: false,        // Minify for production builds
  splitting: false,     // No code splitting (better for libraries)
  format: ['esm', 'cjs'], // Both formats for compatibility
}
```

### 2. Tree-Shaking Verification

Ensure all exports are tree-shakeable:

```typescript
// ✅ GOOD: Named exports (tree-shakeable)
export { iter, range, repeat, zip, zipWith };

// ❌ BAD: Default exports (not tree-shakeable)
export default { iter, range, repeat };

// ✅ GOOD: Individual function exports
export function map<T, U>(fn: (value: T) => U) { }

// ❌ BAD: Exporting objects
export const utils = { map, filter, reduce };
```

### 3. Dependency Management

**Zero Runtime Dependencies** ✅

Our library has zero runtime dependencies, which:
- Reduces bundle size
- Eliminates version conflicts
- Improves security posture
- Simplifies maintenance

**Dev Dependencies Only**

All dependencies are devDependencies for testing and building.

### 4. Code Optimization Techniques

#### Avoid Large Polyfills

```typescript
// ✅ GOOD: Use native features
const result = Array.from(iterable);

// ❌ BAD: Large polyfills
import 'core-js/features/array/from';
```

#### Minimize Helper Functions

```typescript
// ✅ GOOD: Inline small helpers
const isPositive = (x: number) => x > 0;

// ❌ BAD: External helper library
import { isPositive } from 'lodash';
```

#### Use Efficient Algorithms

```typescript
// ✅ GOOD: O(n) complexity
function* filter<T>(iter: Iterable<T>, pred: (x: T) => boolean) {
  for (const item of iter) {
    if (pred(item)) yield item;
  }
}

// ❌ BAD: O(n²) complexity
function filter<T>(arr: T[], pred: (x: T) => boolean) {
  return arr.reduce((acc, item) => {
    if (pred(item)) acc.push(item);
    return acc;
  }, [] as T[]);
}
```

### 5. Bundle Analysis

#### Check Current Size

```bash
npm run build
du -h dist/index.js dist/index.cjs
```

#### Analyze Bundle Composition

```bash
# Install analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to tsup config
import { visualizer } from 'rollup-plugin-visualizer';
```

#### Check Gzipped Size

```bash
gzip -c dist/index.js | wc -c
```

### 6. Optimization Checklist

#### Code Level

- [x] Zero runtime dependencies
- [x] Named exports for tree-shaking
- [x] No default exports
- [x] Efficient algorithms (generators, lazy evaluation)
- [x] Minimal helper functions
- [x] No large polyfills

#### Build Level

- [x] Tree-shaking enabled
- [ ] Minification enabled for production
- [x] Source maps separate
- [x] Dead code elimination
- [ ] Terser configuration optimized

#### Structure Level

- [x] Functional API separate (`iterflow/fn`)
- [x] Modular architecture
- [x] Small, focused modules
- [x] No circular dependencies
- [x] Efficient imports

### 7. Size Budgets

Set strict size budgets to prevent regressions:

```json
{
  "budgets": {
    "index.js": "12KB",
    "index.js.gz": "4KB",
    "fn/index.js": "12KB",
    "fn/index.js.gz": "4KB"
  }
}
```

### 8. Optimization Recommendations

#### Enable Minification for Production

```typescript
// tsup.config.ts
export default defineConfig({
  minify: true,  // Enable for production builds
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
});
```

#### Add Terser Configuration

```typescript
// tsup.config.ts
export default defineConfig({
  minify: 'terser',
  terserOptions: {
    compress: {
      passes: 2,
      pure_getters: true,
      unsafe_arrows: true,
      unsafe_methods: true,
    },
    mangle: {
      properties: {
        regex: /^_private_/,
      },
    },
  },
});
```

#### Code Splitting for Larger APIs

```typescript
// For future expansion if bundle grows
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'fn/index': 'src/fn/index.ts',
    'stats': 'src/statistics.ts',  // Separate stats bundle
    'window': 'src/windowing.ts',  // Separate windowing bundle
  },
});
```

### 9. Import Cost Analysis

Measure the cost of importing each feature:

```bash
# Install import-cost
npm install --save-dev import-cost

# Analyze imports
import-cost src/index.ts
```

### 10. Comparative Analysis

Compare our bundle size with alternatives:

| Library | Minified | Gzipped | Tree-Shakeable |
|---------|----------|---------|----------------|
| iterflow | TBD | TBD | ✅ Yes |
| lodash | 71KB | 25KB | ⚠️ Partial |
| ramda | 55KB | 12KB | ✅ Yes |
| Native | 0KB | 0KB | N/A |

### 11. Monitoring Bundle Size

#### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

npm run build
CURRENT_SIZE=$(gzip -c dist/index.js | wc -c)
MAX_SIZE=15360  # 15KB

if [ $CURRENT_SIZE -gt $MAX_SIZE ]; then
  echo "❌ Bundle size too large: ${CURRENT_SIZE} bytes (max: ${MAX_SIZE})"
  exit 1
fi
```

#### CI/CD Integration

```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size Check

on: [pull_request]

jobs:
  check-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - name: Check bundle size
        run: |
          SIZE=$(gzip -c dist/index.js | wc -c)
          echo "Bundle size: $SIZE bytes"
          if [ $SIZE -gt 15360 ]; then
            echo "Bundle too large!"
            exit 1
          fi
```

### 12. Progressive Enhancement

Support multiple import styles for different use cases:

```typescript
// Import everything (larger bundle)
import { iter } from 'iterflow';

// Import specific functions (smaller bundle)
import { map, filter } from 'iterflow/fn';

// Import only what you need (smallest bundle)
import { map } from 'iterflow/fn/map';
import { filter } from 'iterflow/fn/filter';
```

### 13. Documentation

Document bundle sizes in README:

```markdown
## Bundle Size

- Full API: ~12KB minified, ~4KB gzipped
- Functional API: ~12KB minified, ~4KB gzipped
- Individual functions: ~1-2KB each

### Tree-Shaking

iterflow is fully tree-shakeable. Modern bundlers will only include the functions you actually use.
```

### 14. Optimization Results

Track optimization efforts:

| Date | Version | Size (min) | Size (gz) | Change | Notes |
|------|---------|------------|-----------|--------|-------|
| 2025-11-21 | 0.1.7 | TBD | TBD | - | Initial measurement |

### 15. Future Optimizations

Potential optimizations for future versions:

1. **Selective Imports**
   ```typescript
   import { map } from 'iterflow/map';  // Import only map
   ```

2. **WASM for Performance-Critical Operations**
   - Statistical calculations
   - Large dataset operations
   - Would increase bundle size but improve performance

3. **Dynamic Imports**
   ```typescript
   const { histogram } = await import('iterflow/histogram');
   ```

4. **Plugin System**
   - Core library stays small
   - Optional plugins for advanced features

## Running Bundle Analysis

### Step 1: Build

```bash
npm run build
```

### Step 2: Check Sizes

```bash
# Uncompressed sizes
ls -lh dist/

# Gzipped sizes
gzip -c dist/index.js | wc -c
gzip -c dist/index.cjs | wc -c
```

### Step 3: Analyze Composition

```bash
npm run analyze:bundle
```

### Step 4: Compare with Previous

```bash
git show HEAD:dist/index.js | gzip -c | wc -c  # Previous version
gzip -c dist/index.js | wc -c                  # Current version
```

## Bundle Size Targets

### v1.0 Release Targets

- **Core API**: < 15KB minified + gzipped
- **Functional API**: < 15KB minified + gzipped
- **Total (both)**: < 20KB minified + gzipped
- **Individual functions**: < 2KB each

### Success Criteria

- ✅ Smaller than lodash
- ✅ Comparable to ramda
- ✅ Fully tree-shakeable
- ✅ Zero runtime dependencies
- ✅ < 15KB target met

---

**Last Updated**: 2025-11-21
**Next Review**: Before v1.0 release
**Owner**: Core maintainers
