# eslint-plugin-iterflow

ESLint plugin for [iterflow](https://github.com/gv-sh/iterflow) best practices.

## Installation

```bash
npm install --save-dev eslint-plugin-iterflow
```

## Usage

Add `iterflow` to the plugins section of your ESLint configuration:

```javascript
// eslint.config.js
import iterflow from 'eslint-plugin-iterflow';

export default [
  {
    plugins: {
      iterflow
    },
    rules: {
      'iterflow/prefer-iterflow-over-array': 'warn',
      'iterflow/no-array-from-in-loop': 'error',
      'iterflow/prefer-lazy-evaluation': 'warn'
    }
  }
];
```

Or use the recommended configuration:

```javascript
// eslint.config.js
import iterflow from 'eslint-plugin-iterflow';

export default [
  iterflow.configs.recommended
];
```

## Rules

### `prefer-iterflow-over-array`

Suggests using iterflow for chained array operations to enable lazy evaluation.

```javascript
// ❌ Bad
const result = data
  .map(x => x * 2)
  .filter(x => x > 10)
  .reduce((a, b) => a + b, 0);

// ✅ Good
import { iter } from 'iterflow';
const result = iter(data)
  .map(x => x * 2)
  .filter(x => x > 10)
  .sum();
```

### `no-array-from-in-loop`

Prevents using `Array.from()` inside loops when iterflow can work with iterators directly.

```javascript
// ❌ Bad
for (const item of items) {
  const arr = Array.from(item.iterator);
  // process arr
}

// ✅ Good
import { iter } from 'iterflow';
for (const item of items) {
  const processed = iter(item.iterator)
    .map(x => process(x))
    .toArray();
}
```

### `prefer-lazy-evaluation`

Suggests lazy evaluation patterns when only the first N items are needed.

```javascript
// ❌ Bad
const first10 = data
  .filter(x => x > 0)
  .slice(0, 10);

// ✅ Good
import { iter } from 'iterflow';
const first10 = iter(data)
  .filter(x => x > 0)
  .take(10)
  .toArray();
```

## Configurations

### `recommended`

Enables recommended rules with appropriate severity levels:
- `prefer-iterflow-over-array`: warn
- `no-array-from-in-loop`: error
- `prefer-lazy-evaluation`: warn

### `strict`

All rules enabled as errors for maximum enforcement.

## License

MIT
