import { bench, describe } from 'vitest';
import { iter } from '../src/index.js';

// Memory profiling for windowing operations
// These benchmarks focus on memory efficiency of lazy evaluation vs eager evaluation

const LARGE_ARRAY = Array.from({ length: 10000 }, (_, i) => i);
const HUGE_ARRAY = Array.from({ length: 100000 }, (_, i) => i);

describe('Memory Efficiency - Window Operations', () => {
  // Lazy windowing should not materialize all windows at once
  bench('iterflow window (lazy) - consume first 10', () => {
    iter(LARGE_ARRAY)
      .window(100)
      .take(10)
      .toArray();
  });

  // Manual approach materializes all windows
  bench('manual window (eager) - slice first 10', () => {
    const windows = [];
    for (let i = 0; i <= LARGE_ARRAY.length - 100; i++) {
      windows.push(LARGE_ARRAY.slice(i, i + 100));
    }
    windows.slice(0, 10);
  });
});

describe('Memory Efficiency - Large Window Operations', () => {
  bench('iterflow window size 1000 (lazy)', () => {
    iter(LARGE_ARRAY)
      .window(1000)
      .take(5)
      .toArray();
  });

  bench('manual window size 1000 (eager)', () => {
    const windows = [];
    for (let i = 0; i <= LARGE_ARRAY.length - 1000; i++) {
      windows.push(LARGE_ARRAY.slice(i, i + 1000));
    }
    windows.slice(0, 5);
  });
});

describe('Memory Efficiency - Chunk Operations (Large Array)', () => {
  bench('iterflow chunk (lazy) - take first 10 chunks', () => {
    iter(LARGE_ARRAY)
      .chunk(100)
      .take(10)
      .toArray();
  });

  bench('manual chunk (eager) - slice first 10 chunks', () => {
    const chunks = [];
    for (let i = 0; i < LARGE_ARRAY.length; i += 100) {
      chunks.push(LARGE_ARRAY.slice(i, i + 100));
    }
    chunks.slice(0, 10);
  });
});

describe('Memory Efficiency - Chunk Operations (Huge Array)', () => {
  bench('iterflow chunk (lazy) - take first 10 chunks', () => {
    iter(HUGE_ARRAY)
      .chunk(1000)
      .take(10)
      .toArray();
  });

  bench('manual chunk (eager) - slice first 10 chunks', () => {
    const chunks = [];
    for (let i = 0; i < HUGE_ARRAY.length; i += 1000) {
      chunks.push(HUGE_ARRAY.slice(i, i + 1000));
    }
    chunks.slice(0, 10);
  });
});

describe('Memory Efficiency - Complex Windowing Pipeline', () => {
  // Process windows without materializing intermediate results
  bench('iterflow (lazy pipeline)', () => {
    iter(LARGE_ARRAY)
      .window(50)
      .map(win => win.reduce((a, b) => a + b, 0))
      .filter(sum => sum > 1000)
      .take(20)
      .toArray();
  });

  // Materializes all windows first, then all sums, then filters
  bench('native array (eager pipeline)', () => {
    const windows = [];
    for (let i = 0; i <= LARGE_ARRAY.length - 50; i++) {
      windows.push(LARGE_ARRAY.slice(i, i + 50));
    }
    windows
      .map(win => win.reduce((a, b) => a + b, 0))
      .filter(sum => sum > 1000)
      .slice(0, 20);
  });
});

describe('Memory Efficiency - Windowed Statistics', () => {
  bench('iterflow windowed average (lazy)', () => {
    iter(LARGE_ARRAY)
      .window(100)
      .map(win => win.reduce((a, b) => a + b, 0) / win.length)
      .take(50)
      .toArray();
  });

  bench('manual windowed average (eager)', () => {
    const windows = [];
    for (let i = 0; i <= LARGE_ARRAY.length - 100; i++) {
      windows.push(LARGE_ARRAY.slice(i, i + 100));
    }
    windows
      .map(win => win.reduce((a, b) => a + b, 0) / win.length)
      .slice(0, 50);
  });
});

describe('Memory Efficiency - Sliding Window Max/Min', () => {
  bench('iterflow sliding max (lazy)', () => {
    iter(LARGE_ARRAY)
      .window(20)
      .map(win => Math.max(...win))
      .take(100)
      .toArray();
  });

  bench('manual sliding max (eager)', () => {
    const windows = [];
    for (let i = 0; i <= LARGE_ARRAY.length - 20; i++) {
      windows.push(LARGE_ARRAY.slice(i, i + 20));
    }
    windows
      .map(win => Math.max(...win))
      .slice(0, 100);
  });
});

describe('Memory Efficiency - Skip + Window Pattern', () => {
  bench('iterflow (lazy)', () => {
    iter(HUGE_ARRAY)
      .skip(10000)
      .window(100)
      .take(10)
      .toArray();
  });

  bench('manual (eager slice)', () => {
    const skipped = HUGE_ARRAY.slice(10000);
    const windows = [];
    for (let i = 0; i <= skipped.length - 100; i++) {
      windows.push(skipped.slice(i, i + 100));
    }
    windows.slice(0, 10);
  });
});

describe('Memory Efficiency - Generator with Windows', () => {
  function* largeGenerator() {
    for (let i = 0; i < 100000; i++) {
      yield i;
    }
  }

  bench('iterflow from generator with windows', () => {
    iter(largeGenerator())
      .window(100)
      .take(10)
      .toArray();
  });

  bench('manual generator to array then window', () => {
    const arr = Array.from(largeGenerator());
    const windows = [];
    for (let i = 0; i <= arr.length - 100 && windows.length < 10; i++) {
      windows.push(arr.slice(i, i + 100));
    }
    return windows;
  });
});
