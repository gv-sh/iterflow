---
name: Performance Issue
about: Report a performance problem or suggest an optimization
title: '[PERF] '
labels: performance
assignees: ''
---

## Performance Issue

Describe the performance problem you've encountered:

## Affected Operation(s)

Which iterflow operations are involved?

- [ ] Transformation operations (map, filter, flatMap, etc.)
- [ ] Terminal operations (reduce, toArray, forEach, etc.)
- [ ] Statistical operations (mean, median, etc.)
- [ ] Window operations (window, chunk, etc.)
- [ ] Async operations
- [ ] Composition/chaining
- [ ] Other: _____________

**Specific methods:** [e.g. map(), filter(), reduce()]

## Reproduction

Provide a reproducible example that demonstrates the performance issue:

```typescript
import { iter } from 'iterflow';

// Performance test case
const largeArray = Array.from({ length: 1000000 }, (_, i) => i);

console.time('iterflow');
const result = iter(largeArray)
  .map(x => x * 2)
  .filter(x => x % 2 === 0)
  .toArray();
console.timeEnd('iterflow');

// For comparison, native array methods:
console.time('native');
const nativeResult = largeArray
  .map(x => x * 2)
  .filter(x => x % 2 === 0);
console.timeEnd('native');
```

## Benchmark Results

If you've run benchmarks, please share the results:

**Environment:**
- iterflow version: [e.g. 0.5.0]
- Node.js version: [e.g. 20.10.0]
- Operating System: [e.g. macOS 14.2]
- CPU: [e.g. M1 Max, Intel i7-9700K]
- Memory: [e.g. 16GB]

**Results:**
```
iterflow: XXXms
native:   YYYms
lodash:   ZZZms (if compared)
```

**Dataset size:** [e.g. 1,000,000 elements]
**Operations performed:** [e.g. map -> filter -> reduce]

## Expected Performance

What performance would you expect?

- Similar to native array methods
- Within X% of native performance
- Better than library Y
- Other: _____________

## Actual Performance

What performance are you observing?

- X times slower than native
- Takes Y seconds for Z elements
- Memory usage is unexpectedly high
- Other: _____________

## Impact

How does this affect your use case?

- [ ] Blocks adoption for production use
- [ ] Causes noticeable delays in application
- [ ] Acceptable but could be better
- [ ] Critical for high-throughput scenarios
- [ ] Affects specific use case: _____________

## Profiling Data (optional)

If you've profiled the code, please share relevant findings:

- Hotspots identified:
- Memory allocation patterns:
- Call stack analysis:
- Chrome DevTools profile (link or screenshot):

## Potential Causes

If you have insights into what might be causing the performance issue:

- Unnecessary object allocations
- Inefficient algorithm
- Missing optimizations (early termination, etc.)
- Iterator overhead
- Type checking overhead
- Other: _____________

## Suggested Optimization

If you have ideas for optimization:

```typescript
// Current implementation (simplified):
// ...

// Suggested optimization:
// ...
```

**Why this would be faster:**
- ...

## Additional Context

Any other context about the performance issue:

- Does performance degrade with larger datasets?
- Is this a regression from a previous version?
- Are there specific patterns that trigger the issue?
- Related performance issues:

## Checklist

Before submitting:

- [ ] I have provided a reproducible example
- [ ] I have included benchmark results
- [ ] I have tested with the latest version of iterflow
- [ ] I have compared with native array methods or other libraries
- [ ] I have described the expected vs actual performance
