import { bench, describe } from 'vitest';
import { iter } from '../src/index.js';
import _ from 'lodash';
import * as R from 'ramda';

const SMALL_ARRAY = Array.from({ length: 100 }, (_, i) => i);
const MEDIUM_ARRAY = Array.from({ length: 1000 }, (_, i) => i);
const LARGE_ARRAY = Array.from({ length: 10000 }, (_, i) => i);

describe('Sum Operation - Small Array (100 items)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY).sum();
  });

  bench('lodash', () => {
    _.sum(SMALL_ARRAY);
  });

  bench('ramda', () => {
    R.sum(SMALL_ARRAY);
  });

  bench('native reduce', () => {
    SMALL_ARRAY.reduce((a, b) => a + b, 0);
  });
});

describe('Sum Operation - Medium Array (1000 items)', () => {
  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).sum();
  });

  bench('lodash', () => {
    _.sum(MEDIUM_ARRAY);
  });

  bench('ramda', () => {
    R.sum(MEDIUM_ARRAY);
  });

  bench('native reduce', () => {
    MEDIUM_ARRAY.reduce((a, b) => a + b, 0);
  });
});

describe('Sum Operation - Large Array (10000 items)', () => {
  bench('iterflow', () => {
    iter(LARGE_ARRAY).sum();
  });

  bench('lodash', () => {
    _.sum(LARGE_ARRAY);
  });

  bench('ramda', () => {
    R.sum(LARGE_ARRAY);
  });

  bench('native reduce', () => {
    LARGE_ARRAY.reduce((a, b) => a + b, 0);
  });
});

describe('Mean Operation - Small Array (100 items)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY).mean();
  });

  bench('lodash', () => {
    _.mean(SMALL_ARRAY);
  });

  bench('ramda', () => {
    R.mean(SMALL_ARRAY);
  });

  bench('manual calculation', () => {
    SMALL_ARRAY.reduce((a, b) => a + b, 0) / SMALL_ARRAY.length;
  });
});

describe('Mean Operation - Medium Array (1000 items)', () => {
  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).mean();
  });

  bench('lodash', () => {
    _.mean(MEDIUM_ARRAY);
  });

  bench('ramda', () => {
    R.mean(MEDIUM_ARRAY);
  });

  bench('manual calculation', () => {
    MEDIUM_ARRAY.reduce((a, b) => a + b, 0) / MEDIUM_ARRAY.length;
  });
});

describe('Mean Operation - Large Array (10000 items)', () => {
  bench('iterflow', () => {
    iter(LARGE_ARRAY).mean();
  });

  bench('lodash', () => {
    _.mean(LARGE_ARRAY);
  });

  bench('ramda', () => {
    R.mean(LARGE_ARRAY);
  });

  bench('manual calculation', () => {
    LARGE_ARRAY.reduce((a, b) => a + b, 0) / LARGE_ARRAY.length;
  });
});

describe('Min/Max Operations - Small Array (100 items)', () => {
  bench('iterflow min', () => {
    iter(SMALL_ARRAY).min();
  });

  bench('iterflow max', () => {
    iter(SMALL_ARRAY).max();
  });

  bench('lodash min', () => {
    _.min(SMALL_ARRAY);
  });

  bench('lodash max', () => {
    _.max(SMALL_ARRAY);
  });

  bench('ramda min', () => {
    R.reduce(R.min, Infinity, SMALL_ARRAY);
  });

  bench('ramda max', () => {
    R.reduce(R.max, -Infinity, SMALL_ARRAY);
  });

  bench('Math.min', () => {
    Math.min(...SMALL_ARRAY);
  });

  bench('Math.max', () => {
    Math.max(...SMALL_ARRAY);
  });
});

describe('Min/Max Operations - Medium Array (1000 items)', () => {
  bench('iterflow min', () => {
    iter(MEDIUM_ARRAY).min();
  });

  bench('iterflow max', () => {
    iter(MEDIUM_ARRAY).max();
  });

  bench('lodash min', () => {
    _.min(MEDIUM_ARRAY);
  });

  bench('lodash max', () => {
    _.max(MEDIUM_ARRAY);
  });

  bench('ramda min', () => {
    R.reduce(R.min, Infinity, MEDIUM_ARRAY);
  });

  bench('ramda max', () => {
    R.reduce(R.max, -Infinity, MEDIUM_ARRAY);
  });
});

describe('Median Operation - Small Array (100 items)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY).median();
  });

  bench('manual calculation', () => {
    const sorted = [...SMALL_ARRAY].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  });
});

describe('Median Operation - Medium Array (1000 items)', () => {
  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).median();
  });

  bench('manual calculation', () => {
    const sorted = [...MEDIUM_ARRAY].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  });
});

describe('Variance Operation - Small Array (100 items)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY).variance();
  });

  bench('manual calculation', () => {
    const mean = SMALL_ARRAY.reduce((a, b) => a + b, 0) / SMALL_ARRAY.length;
    const squaredDiffs = SMALL_ARRAY.map(x => Math.pow(x - mean, 2));
    squaredDiffs.reduce((a, b) => a + b, 0) / SMALL_ARRAY.length;
  });
});

describe('Variance Operation - Medium Array (1000 items)', () => {
  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).variance();
  });

  bench('manual calculation', () => {
    const mean = MEDIUM_ARRAY.reduce((a, b) => a + b, 0) / MEDIUM_ARRAY.length;
    const squaredDiffs = MEDIUM_ARRAY.map(x => Math.pow(x - mean, 2));
    squaredDiffs.reduce((a, b) => a + b, 0) / MEDIUM_ARRAY.length;
  });
});

describe('Standard Deviation - Small Array (100 items)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY).stddev();
  });

  bench('manual calculation', () => {
    const mean = SMALL_ARRAY.reduce((a, b) => a + b, 0) / SMALL_ARRAY.length;
    const squaredDiffs = SMALL_ARRAY.map(x => Math.pow(x - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / SMALL_ARRAY.length;
    Math.sqrt(variance);
  });
});

describe('Standard Deviation - Medium Array (1000 items)', () => {
  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).stddev();
  });

  bench('manual calculation', () => {
    const mean = MEDIUM_ARRAY.reduce((a, b) => a + b, 0) / MEDIUM_ARRAY.length;
    const squaredDiffs = MEDIUM_ARRAY.map(x => Math.pow(x - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / MEDIUM_ARRAY.length;
    Math.sqrt(variance);
  });
});

describe('Group By Operation - Small Array (100 items)', () => {
  const keyFn = (x: number) => x % 10;

  bench('iterflow', () => {
    iter(SMALL_ARRAY).groupBy(keyFn);
  });

  bench('lodash', () => {
    _.groupBy(SMALL_ARRAY, keyFn);
  });

  bench('ramda', () => {
    R.groupBy(x => String(keyFn(x)), SMALL_ARRAY);
  });

  bench('manual reduce', () => {
    SMALL_ARRAY.reduce((acc, x) => {
      const key = keyFn(x);
      if (!acc[key]) acc[key] = [];
      acc[key].push(x);
      return acc;
    }, {} as Record<number, number[]>);
  });
});

describe('Group By Operation - Medium Array (1000 items)', () => {
  const keyFn = (x: number) => x % 10;

  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).groupBy(keyFn);
  });

  bench('lodash', () => {
    _.groupBy(MEDIUM_ARRAY, keyFn);
  });

  bench('ramda', () => {
    R.groupBy(x => String(keyFn(x)), MEDIUM_ARRAY);
  });

  bench('manual reduce', () => {
    MEDIUM_ARRAY.reduce((acc, x) => {
      const key = keyFn(x);
      if (!acc[key]) acc[key] = [];
      acc[key].push(x);
      return acc;
    }, {} as Record<number, number[]>);
  });
});
