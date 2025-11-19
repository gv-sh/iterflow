import { bench, describe } from 'vitest';
import { iter } from '../src/index.js';
import _ from 'lodash';
import * as R from 'ramda';

const LARGE_ARRAY = Array.from({ length: 10000 }, (_, i) => i);
const HUGE_ARRAY = Array.from({ length: 100000 }, (_, i) => i);

describe('Early Termination - Find First Match (Large Array)', () => {
  const predicate = (x: number) => x === 100;

  bench('iterflow (lazy)', () => {
    iter(LARGE_ARRAY)
      .map(x => x * 2)
      .filter(x => x > 50)
      .find(predicate);
  });

  bench('native array (eager)', () => {
    LARGE_ARRAY
      .map(x => x * 2)
      .filter(x => x > 50)
      .find(predicate);
  });

  bench('lodash chain (lazy)', () => {
    _(LARGE_ARRAY)
      .map(x => x * 2)
      .filter(x => x > 50)
      .find(predicate);
  });
});

describe('Early Termination - Take First 10 After Transform (Large Array)', () => {
  bench('iterflow (lazy)', () => {
    iter(LARGE_ARRAY)
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .take(10)
      .toArray();
  });

  bench('native array (eager)', () => {
    LARGE_ARRAY
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .slice(0, 10);
  });

  bench('lodash chain (lazy)', () => {
    _(LARGE_ARRAY)
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .take(10)
      .value();
  });
});

describe('Early Termination - Take First 10 After Transform (Huge Array)', () => {
  bench('iterflow (lazy)', () => {
    iter(HUGE_ARRAY)
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .take(10)
      .toArray();
  });

  bench('native array (eager)', () => {
    HUGE_ARRAY
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .slice(0, 10);
  });

  bench('lodash chain (lazy)', () => {
    _(HUGE_ARRAY)
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .take(10)
      .value();
  });
});

describe('Short-Circuit - Some Operation After Complex Chain', () => {
  const predicate = (x: number) => x > 200;

  bench('iterflow (lazy)', () => {
    iter(LARGE_ARRAY)
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .some(predicate);
  });

  bench('native array (eager)', () => {
    LARGE_ARRAY
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .some(predicate);
  });
});

describe('Short-Circuit - Every Operation After Complex Chain', () => {
  const predicate = (x: number) => x < 100;

  bench('iterflow (lazy)', () => {
    iter(LARGE_ARRAY)
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .every(predicate);
  });

  bench('native array (eager)', () => {
    LARGE_ARRAY
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .every(predicate);
  });
});

describe('Memory Efficiency - Large Pipeline Without Materialization', () => {
  bench('iterflow (lazy - only count)', () => {
    iter(HUGE_ARRAY)
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .map(x => x + 1)
      .filter(x => x % 3 === 0)
      .count();
  });

  bench('native array (eager - full materialization)', () => {
    HUGE_ARRAY
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .map(x => x + 1)
      .filter(x => x % 3 === 0)
      .length;
  });
});

describe('Complex Chain - Full Consumption (Large Array)', () => {
  bench('iterflow', () => {
    iter(LARGE_ARRAY)
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .map(x => x + 1)
      .filter(x => x % 3 === 0)
      .toArray();
  });

  bench('native array', () => {
    LARGE_ARRAY
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .map(x => x + 1)
      .filter(x => x % 3 === 0);
  });

  bench('lodash chain', () => {
    _(LARGE_ARRAY)
      .map(x => x * 2)
      .filter(x => x % 2 === 0)
      .map(x => x + 1)
      .filter(x => x % 3 === 0)
      .value();
  });

  bench('ramda pipe', () => {
    R.pipe(
      R.map((x: number) => x * 2),
      R.filter((x: number) => x % 2 === 0),
      R.map((x: number) => x + 1),
      R.filter((x: number) => x % 3 === 0)
    )(LARGE_ARRAY);
  });
});

describe('Infinite Iterator Simulation - Take from Large Stream', () => {
  function* infiniteNumbers() {
    let i = 0;
    while (i < 1000000) {
      yield i++;
    }
  }

  bench('iterflow from generator', () => {
    iter(infiniteNumbers())
      .filter(x => x % 2 === 0)
      .map(x => x * 2)
      .take(100)
      .toArray();
  });

  bench('manual iteration with generator', () => {
    const result = [];
    const gen = infiniteNumbers();
    let count = 0;
    for (const x of gen) {
      if (x % 2 === 0) {
        const transformed = x * 2;
        result.push(transformed);
        count++;
        if (count >= 100) break;
      }
    }
    return result;
  });
});

describe('Skip and Take Pattern - Large Array', () => {
  bench('iterflow', () => {
    iter(LARGE_ARRAY)
      .skip(1000)
      .take(100)
      .toArray();
  });

  bench('native slice', () => {
    LARGE_ARRAY.slice(1000, 1100);
  });

  bench('lodash chain', () => {
    _(LARGE_ARRAY)
      .drop(1000)
      .take(100)
      .value();
  });

  bench('ramda', () => {
    R.pipe(
      R.drop(1000),
      R.take(100)
    )(LARGE_ARRAY);
  });
});

describe('Filter Heavy Chain - Large Array', () => {
  bench('iterflow', () => {
    iter(LARGE_ARRAY)
      .filter(x => x % 2 === 0)
      .filter(x => x % 3 === 0)
      .filter(x => x % 5 === 0)
      .toArray();
  });

  bench('native array', () => {
    LARGE_ARRAY
      .filter(x => x % 2 === 0)
      .filter(x => x % 3 === 0)
      .filter(x => x % 5 === 0);
  });

  bench('native array (single filter)', () => {
    LARGE_ARRAY.filter(x => x % 2 === 0 && x % 3 === 0 && x % 5 === 0);
  });

  bench('lodash chain', () => {
    _(LARGE_ARRAY)
      .filter(x => x % 2 === 0)
      .filter(x => x % 3 === 0)
      .filter(x => x % 5 === 0)
      .value();
  });
});
