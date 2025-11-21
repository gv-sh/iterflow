# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in iterflow, please report it privately by:

1. **Email:** Send details to hi@gvsh.cc
2. **GitHub:** Use the private vulnerability reporting feature
3. **Subject:** Include "iterflow Security" in the subject line

### What to Include

Please provide:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested fixes (if available)

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Varies based on severity

### Security Best Practices

When using iterflow in production:

#### General Security
- ✅ Keep dependencies up to date
- ✅ Validate and limit all inputs before processing
- ✅ Never execute untrusted user code
- ✅ Use allow-lists for permitted operations
- ✅ Monitor resource usage in production

#### Memory Safety
- ✅ Be aware that some operations (like `toArray()`, `sort()`, `median()`) load all elements into memory
- ✅ Always use `take()` or similar limiting operations with infinite or unknown-size iterators
- ✅ Process large datasets in chunks using `chunk()` or pagination
- ✅ Prefer streaming operations (`map`, `filter`) over collecting operations when possible
- ⚠️ See [Memory Safety Guide](./docs/guides/memory-safety.md) for detailed guidance

#### DoS Protection
- ✅ Set maximum limits on array sizes (recommended: 10,000-100,000 elements)
- ✅ Validate window/chunk sizes before operations
- ✅ Implement timeouts for long-running operations
- ✅ Use worker threads for untrusted code isolation
- ✅ Rate-limit operations from user input
- ⚠️ See [DoS Protection Guide](./docs/guides/dos-protection.md) for detailed guidance

#### Input Validation
- ✅ Validate array sizes before processing: `if (arr.length > MAX_SIZE) throw new Error()`
- ✅ Validate element types before operations: `arr.every(x => typeof x === 'number')`
- ✅ Use TypeScript for type safety at compile time
- ✅ Validate numeric ranges for operations like `percentile()`, `window()`, etc.
- ❌ Never construct functions from user strings: `new Function(userInput)` - RCE vulnerability!

## Security Considerations

### Memory Usage

**High-Memory Operations (O(n) space):**
- `toArray()`, `toSet()`, `toMap()` - Collect all elements
- `reverse()`, `sort()`, `sortBy()` - Require full array in memory
- `median()`, `variance()`, `stddev()`, `mode()` - Load all values for calculation
- `groupBy()`, `partition()` - Store all elements in grouped structure

**Memory Safety Guidelines:**
- 1M numbers ≈ 8 MB memory
- 10M numbers ≈ 80 MB memory
- 100M numbers ≈ 800 MB memory (may cause performance issues)
- Maximum recommended: 10M elements for in-memory operations
- For larger datasets, use streaming operations with `take()`, `chunk()`, or external processing

**Example:**
```typescript
// ❌ Dangerous: Unbounded memory usage
iter(unknownSource).toArray();

// ✅ Safe: Limited memory usage
iter(unknownSource).take(10_000).toArray();
```

### Input Validation

**IterFlow Provides:**
- ✅ Type safety through TypeScript
- ✅ Parameter validation for numeric inputs (positive integers, ranges, etc.)
- ✅ Runtime error checking with detailed error messages

**Your Responsibility:**
- ⚠️ Validate input sizes before processing untrusted data
- ⚠️ Never pass user-provided code strings to operations
- ⚠️ Validate element types and values match expected format
- ⚠️ Set reasonable limits based on your application's resource constraints

**Secure Usage Pattern:**
```typescript
// ✅ Proper input validation
function secureProcess(userArray: unknown[]) {
  // Validate type
  if (!Array.isArray(userArray)) {
    throw new Error('Input must be an array');
  }

  // Validate size
  if (userArray.length > 10_000) {
    throw new Error('Input too large');
  }

  // Validate element types
  if (!userArray.every(x => typeof x === 'number')) {
    throw new Error('All elements must be numbers');
  }

  // Safe to process
  return iter(userArray)
    .filter(x => x > 0)
    .map(x => x * 2)
    .toArray();
}
```

### User-Provided Functions

**CRITICAL SECURITY WARNING:**

⚠️ **NEVER pass untrusted user code to IterFlow operations:**

```typescript
// ❌ CRITICAL VULNERABILITY - Remote Code Execution (RCE)
const userFilter = new Function('x', req.body.filterCode);
iter(data).filter(userFilter); // Executes arbitrary code!

// ❌ CRITICAL VULNERABILITY - eval() is equally dangerous
const userMapper = eval(`(x) => ${req.body.mapCode}`);
iter(data).map(userMapper);
```

**Safe Alternative - Use Allow-Lists:**

```typescript
// ✅ SECURE - Predefined safe operations only
const allowedFilters = {
  'positive': (x: number) => x > 0,
  'even': (x: number) => x % 2 === 0,
  'large': (x: number) => x > 100,
} as const;

function secureFilter(data: number[], filterName: string) {
  if (!(filterName in allowedFilters)) {
    throw new Error('Invalid filter name');
  }

  return iter(data)
    .filter(allowedFilters[filterName as keyof typeof allowedFilters])
    .toArray();
}
```

**Operations Requiring Trusted Functions:**
- `map()`, `flatMap()` - Mappers
- `filter()`, `find()`, `every()`, `some()`, `takeWhile()`, `dropWhile()` - Predicates
- `reduce()`, `scan()` - Reducers
- `sort()`, `sortBy()`, `min()`, `max()` - Comparators
- `groupBy()`, `uniqueBy()` - Key extractors

### Known Limitations

#### No Protection Against Infinite Loops

IterFlow **cannot protect** against infinite loops in user-provided functions:

```typescript
// ❌ Will hang forever - no timeout
iter([1, 2, 3]).filter(x => {
  while (true) {} // Infinite loop
  return true;
});
```

**Mitigation:**
1. Only use trusted functions
2. Implement application-level timeouts
3. Use worker threads for isolation
4. Monitor CPU usage and kill runaway processes

#### Numeric Precision Limitations

JavaScript uses IEEE 754 double-precision floats:
- Safe integer range: -(2^53 - 1) to (2^53 - 1)
- Operations on very large numbers may lose precision
- Floating-point arithmetic has rounding errors

```typescript
// ⚠️ Precision loss with large numbers
iter([Number.MAX_SAFE_INTEGER, 1]).sum(); // May be incorrect

// ⚠️ Floating-point rounding
iter([0.1, 0.2]).sum(); // 0.30000000000000004 (not exactly 0.3)
```

**Mitigation:** Use appropriate numeric libraries for high-precision arithmetic if needed.

#### Memory Exhaustion Possible

Large datasets can exhaust available memory:

```typescript
// ❌ Out of memory crash
iter.range(0, 100_000_000).toArray();

// ✅ Safe alternatives
iter.range(0, 100_000_000).take(1000).toArray(); // Limit size
iter.range(0, 100_000_000).forEach(x => process(x)); // Stream processing
```

#### No Built-in Timeouts

Long-running operations will not automatically timeout:

```typescript
// ❌ May take very long
iter(hugeArray).sort().toArray();

// ✅ Implement application-level timeout
await Promise.race([
  processData(hugeArray),
  timeout(30000, 'Operation timeout'),
]);
```

## Disclosure Policy

- Security issues will be disclosed publicly after a fix is available
- Credit will be given to reporters unless anonymity is requested
- We follow responsible disclosure practices

Thank you for helping keep iterflow secure!