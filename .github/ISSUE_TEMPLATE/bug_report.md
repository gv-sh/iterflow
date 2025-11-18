---
name: Bug report
about: Create a report to help us improve iterflow
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Reproduction Steps
Steps to reproduce the behavior:
1. Create iterator with '...'
2. Apply operation '...'
3. Expected vs actual result

## Code Example
```typescript
import { iter } from 'iterflow';

// Minimal reproduction case
const result = iter([1, 2, 3])
  .someOperation()
  .toArray();

console.log(result); // Expected: [...], Actual: [...]
```

## Expected Behavior
A clear and concise description of what you expected to happen.

## Actual Behavior
A clear and concise description of what actually happened.

## Environment
- iterflow version: [e.g. 0.1.0]
- Node.js version: [e.g. 20.1.0]
- TypeScript version: [e.g. 5.6.0]
- Operating System: [e.g. macOS 14.0]

## Additional Context
Add any other context about the problem here, such as:
- Related error messages
- Screenshots if applicable
- Workarounds you've tried