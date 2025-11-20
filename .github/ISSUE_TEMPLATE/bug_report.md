---
name: Bug Report
about: Report a bug to help us improve iterflow
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description

A clear and concise description of what the bug is. What went wrong?

## Reproduction Steps

Provide detailed steps to reproduce the behavior:

1. Create iterator with '...'
2. Apply operation '...'
3. Call terminal operation '...'
4. Observe unexpected result

## Minimal Reproducible Example

Please provide a minimal, complete code example that demonstrates the issue:

```typescript
import { iter } from 'iterflow';

// Minimal reproduction case
const result = iter([1, 2, 3])
  .someOperation()
  .toArray();

console.log(result);
// Expected: [...]
// Actual:   [...]
```

**CodeSandbox/StackBlitz Link (optional but helpful):**
<!-- Providing a live reproduction helps us debug faster -->

## Expected Behavior

A clear and concise description of what you expected to happen.

**Example:**
```typescript
// I expected the result to be:
[1, 2, 3]
```

## Actual Behavior

A clear and concise description of what actually happened.

**Example:**
```typescript
// But the actual result was:
[1, 1, 1]
```

## Error Messages

If applicable, paste any error messages or stack traces:

```
Error: ...
  at ...
```

## Environment

Please complete the following information:

- **iterflow version:** [e.g. 0.5.0]
- **Node.js version:** [e.g. 20.10.0] (run `node --version`)
- **TypeScript version:** [e.g. 5.3.3] (run `tsc --version`)
- **Package manager:** [e.g. npm 10.2.5, yarn 1.22.19, pnpm 8.14.0]
- **Operating System:** [e.g. macOS 14.2, Windows 11, Ubuntu 22.04]
- **Runtime environment:** [e.g. Node.js, Browser (Chrome 120), Deno 1.39, Bun 1.0]

## Additional Context

Add any other context about the problem here:

- Does this happen consistently or intermittently?
- Did this work in a previous version of iterflow?
- Have you tried any workarounds?
- Are there any related issues?
- Any relevant configuration or setup details?

## Possible Solution (optional)

If you have suggestions on how to fix the bug, please share them here.

## Checklist

Before submitting, please ensure:

- [ ] I have searched existing issues to ensure this isn't a duplicate
- [ ] I have provided a minimal reproducible example
- [ ] I have included version information
- [ ] I have described expected vs actual behavior clearly