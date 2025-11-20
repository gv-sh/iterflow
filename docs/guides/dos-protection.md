# DoS Protection Guide

This guide explains Denial of Service (DoS) risks in IterFlow and provides best practices for secure usage in production environments.

## Table of Contents

- [Understanding DoS Risks](#understanding-dos-risks)
- [Attack Vectors](#attack-vectors)
- [Protection Strategies](#protection-strategies)
- [Secure Usage Patterns](#secure-usage-patterns)
- [Production Hardening](#production-hardening)
- [Security Checklist](#security-checklist)

---

## Understanding DoS Risks

IterFlow is a general-purpose iterator library that provides powerful data transformation capabilities. Like any powerful tool, it can be misused to cause resource exhaustion if not used carefully.

### Key Risk Areas

1. **Infinite Loops** - User-provided functions that never terminate
2. **Memory Exhaustion** - Loading excessive data into memory
3. **CPU Exhaustion** - Computationally expensive operations
4. **Algorithmic Complexity** - Operations with poor worst-case performance

---

## Attack Vectors

### 1. Infinite Loop in User Functions

**Risk Level:** 🔴 **CRITICAL**

User-provided callbacks can contain infinite loops that hang the application:

```typescript
// ❌ DANGEROUS: Infinite loop in predicate
iter([1, 2, 3]).filter(x => {
  while (true) {} // Freezes the application forever
  return true;
});

// ❌ DANGEROUS: Never-terminating computation
iter([1, 2, 3]).map(x => {
  return slowAlgorithm(Number.MAX_SAFE_INTEGER); // Takes years to complete
});
```

**Impact:**
- Application hangs indefinitely
- No automatic timeout or recovery
- Requires process restart
- Can affect all users in a shared environment

**Mitigation:** Never pass untrusted user code to IterFlow operations. See [Protection Strategies](#protection-strategies).

### 2. Memory Exhaustion

**Risk Level:** 🔴 **HIGH**

Operations that collect all elements can exhaust available memory:

```typescript
// ❌ DANGEROUS: Loads infinite sequence into memory
iter.range(0, Infinity).toArray(); // Out of memory crash

// ❌ DANGEROUS: Loads huge dataset
iter.range(0, 100_000_000).toArray(); // May crash or slow down system

// ❌ DANGEROUS: Unbounded window size
iter([1, 2, 3]).window(Number.MAX_SAFE_INTEGER); // Attempts huge allocation
```

**Impact:**
- Out of memory errors
- System slowdown due to swapping
- Application crash
- Affects all processes on the system

**Mitigation:** Always validate and limit dataset sizes. See [Memory Safety Guide](./memory-safety.md).

### 3. CPU Exhaustion

**Risk Level:** 🟡 **MEDIUM**

Expensive operations on large datasets can monopolize CPU:

```typescript
// ❌ DANGEROUS: Sorts huge array
iter.range(0, 100_000_000).sort().toArray(); // O(n log n) on 100M elements

// ❌ DANGEROUS: Nested iterations
iter(dataset1).flatMap(x =>
  iter(dataset2).flatMap(y =>
    iter(dataset3).filter(z => expensive(x, y, z))
  )
); // O(n³) complexity
```

**Impact:**
- High CPU usage (100% for extended period)
- Slow response times
- Affects other operations in event loop (Node.js)
- May trigger cloud cost alerts

**Mitigation:** Set reasonable limits on input sizes and operation complexity.

### 4. Algorithmic Complexity Attacks

**Risk Level:** 🟡 **MEDIUM**

Adversarial inputs can trigger worst-case algorithmic behavior:

```typescript
// ❌ DANGEROUS: Adversarial comparator
iter(largeArray).sort((a, b) => {
  // Intentionally bad comparator causes O(n²) behavior
  return Math.random() - 0.5;
});

// ❌ DANGEROUS: Hash collision attack
const maliciousKeys = generateCollidingKeys(100000);
iter(maliciousKeys).toSet(); // Degrades to O(n²) in worst case
```

**Impact:**
- Unexpectedly slow operations
- CPU exhaustion
- Timing attacks possible

**Mitigation:** Validate comparators and use trusted key functions only.

---

## Protection Strategies

### Strategy 1: Input Validation and Limits

Always validate inputs before processing:

```typescript
import { iter } from 'iterflow';

function secureProcess(userArray: unknown[]) {
  // ✅ Validate array size
  if (!Array.isArray(userArray)) {
    throw new Error('Input must be an array');
  }

  if (userArray.length > 10_000) {
    throw new Error('Input exceeds maximum size (10,000 elements)');
  }

  // ✅ Validate element types
  if (!userArray.every(x => typeof x === 'number')) {
    throw new Error('All elements must be numbers');
  }

  // ✅ Safe to process
  return iter(userArray)
    .filter(x => x > 0)
    .map(x => x * 2)
    .toArray();
}
```

### Strategy 2: Function Allow-Lists

Never construct functions from user strings. Use allow-lists instead:

```typescript
// ❌ NEVER DO THIS - Remote Code Execution vulnerability
const userFilter = new Function('x', userProvidedCode);
iter(data).filter(userFilter); // CRITICAL SECURITY VULNERABILITY

// ✅ Use allow-list of safe operations
const allowedFilters = {
  'positive': (x: number) => x > 0,
  'even': (x: number) => x % 2 === 0,
  'negative': (x: number) => x < 0,
  'odd': (x: number) => x % 2 !== 0,
} as const;

function secureFilter(data: number[], filterName: string) {
  if (!(filterName in allowedFilters)) {
    throw new Error(`Invalid filter: ${filterName}`);
  }

  return iter(data)
    .filter(allowedFilters[filterName as keyof typeof allowedFilters])
    .toArray();
}
```

### Strategy 3: Timeout Wrappers

Wrap operations with timeouts for untrusted code:

```typescript
import { iter } from 'iterflow';

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

function withTimeout<T>(
  operation: () => T,
  timeoutMs: number
): T {
  let timeoutId: NodeJS.Timeout;
  let completed = false;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      if (!completed) {
        reject(new TimeoutError(`Operation exceeded timeout (${timeoutMs}ms)`));
      }
    }, timeoutMs);
  });

  const operationPromise = Promise.resolve().then(() => {
    const result = operation();
    completed = true;
    clearTimeout(timeoutId);
    return result;
  });

  return Promise.race([operationPromise, timeoutPromise]) as any;
}

// Usage
async function secureProcessing(data: number[]) {
  try {
    return await withTimeout(
      () => iter(data).map(expensiveFunction).toArray(),
      5000 // 5 second timeout
    );
  } catch (err) {
    if (err instanceof TimeoutError) {
      console.error('Operation timed out');
      return [];
    }
    throw err;
  }
}
```

**Note:** JavaScript timeouts don't interrupt synchronous code. For true isolation, use Worker Threads.

### Strategy 4: Worker Thread Isolation

For untrusted code, run operations in isolated Worker Threads:

```typescript
import { Worker } from 'worker_threads';

function processInWorker<T>(
  data: T[],
  operation: string,
  timeoutMs: number = 10000
): Promise<any> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', {
      workerData: { data, operation }
    });

    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error('Worker timeout'));
    }, timeoutMs);

    worker.on('message', (result) => {
      clearTimeout(timeout);
      resolve(result);
    });

    worker.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });

    worker.on('exit', (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// worker.js
const { workerData, parentPort } = require('worker_threads');
const { iter } = require('iterflow');

const { data, operation } = workerData;

// Process in isolated environment
const result = iter(data)
  .filter(x => x > 0)
  .map(x => x * 2)
  .toArray();

parentPort.postMessage(result);
```

### Strategy 5: Resource Monitoring

Monitor resource usage and abort if limits exceeded:

```typescript
import { iter } from 'iterflow';

class ResourceExceededError extends Error {
  constructor(resource: string, limit: number) {
    super(`${resource} exceeded limit: ${limit}`);
    this.name = 'ResourceExceededError';
  }
}

function processWithMonitoring<T>(
  data: Iterable<T>,
  options: {
    maxMemoryMB?: number;
    maxIterations?: number;
  } = {}
) {
  const maxMemory = options.maxMemoryMB || 100;
  const maxIterations = options.maxIterations || 1_000_000;

  const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024;
  let iterations = 0;

  return iter(data)
    .map(x => {
      iterations++;

      // Check iteration limit
      if (iterations > maxIterations) {
        throw new ResourceExceededError('iterations', maxIterations);
      }

      // Check memory limit (every 1000 iterations)
      if (iterations % 1000 === 0) {
        const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        const memoryUsed = currentMemory - initialMemory;

        if (memoryUsed > maxMemory) {
          throw new ResourceExceededError('memory (MB)', maxMemory);
        }
      }

      return x;
    });
}

// Usage
try {
  const result = processWithMonitoring(untrustedData, {
    maxMemoryMB: 50,
    maxIterations: 100_000
  })
    .filter(x => x.isValid)
    .toArray();
} catch (err) {
  if (err instanceof ResourceExceededError) {
    console.error('Resource limit exceeded:', err.message);
  }
}
```

---

## Secure Usage Patterns

### Pattern 1: Validated Inputs

```typescript
import { iter } from 'iterflow';

interface SecureIterOptions {
  maxElements?: number;
  maxWindowSize?: number;
  allowInfinite?: boolean;
}

class SecureIter {
  private static DEFAULT_MAX_ELEMENTS = 10_000;
  private static DEFAULT_MAX_WINDOW = 1_000;

  static from<T>(
    source: Iterable<T>,
    options: SecureIterOptions = {}
  ) {
    const maxElements = options.maxElements || this.DEFAULT_MAX_ELEMENTS;

    // Validate source is not infinite (if disallowed)
    if (!options.allowInfinite && !Array.isArray(source)) {
      // Convert to array with limit
      const limited = iter(source).take(maxElements + 1).toArray();
      if (limited.length > maxElements) {
        throw new Error(`Source exceeds maximum elements (${maxElements})`);
      }
      return iter(limited);
    }

    return iter(source).take(maxElements);
  }

  static window<T>(
    source: Iterable<T>,
    size: number,
    options: SecureIterOptions = {}
  ) {
    const maxWindowSize = options.maxWindowSize || this.DEFAULT_MAX_WINDOW;

    if (size > maxWindowSize) {
      throw new Error(`Window size ${size} exceeds maximum (${maxWindowSize})`);
    }

    return iter(source).window(size);
  }
}

// Usage
const secureResult = SecureIter
  .from(untrustedData, { maxElements: 5000 })
  .filter(x => x.isValid)
  .toArray();
```

### Pattern 2: Rate Limiting

```typescript
class RateLimiter {
  private operations = 0;
  private resetTime = Date.now();
  private readonly maxOpsPerSecond: number;

  constructor(maxOpsPerSecond: number = 1000) {
    this.maxOpsPerSecond = maxOpsPerSecond;
  }

  check(): void {
    const now = Date.now();

    // Reset counter every second
    if (now - this.resetTime >= 1000) {
      this.operations = 0;
      this.resetTime = now;
    }

    this.operations++;

    if (this.operations > this.maxOpsPerSecond) {
      throw new Error('Rate limit exceeded');
    }
  }
}

// Usage
const rateLimiter = new RateLimiter(100); // 100 ops/sec

function rateLimitedProcess(data: number[]) {
  return iter(data)
    .map(x => {
      rateLimiter.check();
      return expensiveOperation(x);
    })
    .toArray();
}
```

### Pattern 3: Safe Defaults with Recovery

```typescript
import { iter } from 'iterflow';
import { safePredicate, safeComparator, withDefault } from 'iterflow/recovery';

function safeProcess(
  data: unknown[],
  userPredicate?: (x: any) => boolean,
  userComparator?: (a: any, b: any) => number
) {
  // Use safe wrappers that handle errors gracefully
  const predicate = userPredicate
    ? safePredicate(userPredicate, false) // Returns false on error
    : () => true;

  const comparator = userComparator
    ? safeComparator(userComparator, (a, b) => 0) // Returns 0 on error
    : undefined;

  return withDefault(
    () => iter(data)
      .filter(predicate)
      .take(1000) // Always limit
      [comparator ? 'sort' : 'toArray'](comparator),
    [] // Return empty array on any error
  );
}
```

---

## Production Hardening

### 1. Environment Configuration

Set resource limits in your production environment:

```javascript
// server.js
import cluster from 'cluster';
import { availableParallelism } from 'os';

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart crashed workers
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Worker process configuration
  process.setMaxListeners(20);

  // Handle uncaught errors gracefully
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    process.exit(1); // Let cluster restart
  });

  // Start your application
  startServer();
}
```

### 2. Node.js Flags

Run Node.js with resource limits:

```bash
# Limit heap size
node --max-old-space-size=2048 app.js

# Set stack size
node --stack-size=2048 app.js

# Enable strict mode
node --use-strict app.js
```

### 3. Docker Resource Limits

```yaml
# docker-compose.yml
services:
  app:
    image: node:18
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 4. Kubernetes Resource Quotas

```yaml
# deployment.yaml
apiVersion: v1
kind: Pod
metadata:
  name: iterflow-app
spec:
  containers:
  - name: app
    image: iterflow-app:latest
    resources:
      limits:
        memory: "2Gi"
        cpu: "2000m"
      requests:
        memory: "1Gi"
        cpu: "1000m"
```

### 5. Application-Level Limits

```typescript
// config.ts
export const SECURITY_LIMITS = {
  MAX_ARRAY_SIZE: 100_000,
  MAX_WINDOW_SIZE: 10_000,
  MAX_OPERATION_TIME_MS: 30_000,
  MAX_MEMORY_MB: 500,
  MAX_ITERATIONS: 1_000_000,
} as const;

// Apply globally
import { iter } from 'iterflow';

const originalIter = iter;

// Wrap iter with security checks
export function secureIter<T>(source: Iterable<T>) {
  if (Array.isArray(source) && source.length > SECURITY_LIMITS.MAX_ARRAY_SIZE) {
    throw new Error(`Array size ${source.length} exceeds limit`);
  }

  return originalIter(source);
}
```

---

## Security Checklist

Use this checklist when deploying IterFlow in production:

### Input Validation
- [ ] All user inputs validated before processing
- [ ] Array sizes limited to reasonable bounds
- [ ] Window/chunk sizes validated
- [ ] Element types validated
- [ ] Infinite sequences properly handled

### Function Safety
- [ ] No user-provided code constructed with `eval()` or `Function()`
- [ ] Allow-lists used for permitted operations
- [ ] User functions wrapped in error handlers
- [ ] Timeouts implemented for long-running operations
- [ ] Worker threads used for untrusted code

### Resource Limits
- [ ] Memory limits configured
- [ ] CPU limits configured
- [ ] Operation timeouts set
- [ ] Rate limiting implemented
- [ ] Monitoring and alerting configured

### Error Handling
- [ ] All operations wrapped in try-catch
- [ ] Graceful degradation on errors
- [ ] Error logging configured
- [ ] Circuit breakers for external calls
- [ ] Health checks implemented

### Testing
- [ ] DoS scenarios tested
- [ ] Memory exhaustion tested
- [ ] CPU exhaustion tested
- [ ] Timeout handling tested
- [ ] Error recovery tested

### Production
- [ ] Resource quotas configured (Docker/K8s)
- [ ] Node.js memory limits set
- [ ] Process clustering enabled
- [ ] Monitoring dashboards created
- [ ] Incident response plan documented

---

## Additional Resources

- [Memory Safety Guide](./memory-safety.md) - Memory management best practices
- [Security Policy](../../SECURITY.md) - Vulnerability reporting
- [Security Audit](../../SECURITY_AUDIT.md) - Detailed security analysis
- [Error Handling Guide](./error-handling.md) - Error management patterns

---

## Summary

**Key Security Principles:**

1. 🔒 **Never trust user input** - Always validate and sanitize
2. 🚫 **Never execute untrusted code** - Use allow-lists only
3. ⏱️ **Always set timeouts** - Prevent infinite loops
4. 📏 **Always limit sizes** - Prevent memory exhaustion
5. 🔍 **Always monitor resources** - Detect attacks early
6. 🛡️ **Always isolate untrusted operations** - Use worker threads
7. 📝 **Always log security events** - Enable incident response

**Remember:** IterFlow is a powerful tool that requires responsible usage. When in doubt, apply stricter limits and isolate untrusted operations.
