import { bench, describe } from 'vitest';
import { iter } from '../src/index.js';
import _ from 'lodash';
import * as R from 'ramda';

const SMALL_ARRAY = Array.from({ length: 100 }, (_, i) => i);
const MEDIUM_ARRAY = Array.from({ length: 1000 }, (_, i) => i);
const LARGE_ARRAY = Array.from({ length: 10000 }, (_, i) => i);

describe('Chunk Operation - Small Array (100 items, size 10)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY).chunk(10).toArray();
  });

  bench('lodash', () => {
    _.chunk(SMALL_ARRAY, 10);
  });

  bench('ramda', () => {
    R.splitEvery(10, SMALL_ARRAY);
  });

  bench('manual chunking', () => {
    const result = [];
    for (let i = 0; i < SMALL_ARRAY.length; i += 10) {
      result.push(SMALL_ARRAY.slice(i, i + 10));
    }
    return result;
  });
});

describe('Chunk Operation - Medium Array (1000 items, size 50)', () => {
  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).chunk(50).toArray();
  });

  bench('lodash', () => {
    _.chunk(MEDIUM_ARRAY, 50);
  });

  bench('ramda', () => {
    R.splitEvery(50, MEDIUM_ARRAY);
  });

  bench('manual chunking', () => {
    const result = [];
    for (let i = 0; i < MEDIUM_ARRAY.length; i += 50) {
      result.push(MEDIUM_ARRAY.slice(i, i + 50));
    }
    return result;
  });
});

describe('Chunk Operation - Large Array (10000 items, size 100)', () => {
  bench('iterflow', () => {
    iter(LARGE_ARRAY).chunk(100).toArray();
  });

  bench('lodash', () => {
    _.chunk(LARGE_ARRAY, 100);
  });

  bench('ramda', () => {
    R.splitEvery(100, LARGE_ARRAY);
  });

  bench('manual chunking', () => {
    const result = [];
    for (let i = 0; i < LARGE_ARRAY.length; i += 100) {
      result.push(LARGE_ARRAY.slice(i, i + 100));
    }
    return result;
  });
});

describe('Window Operation - Small Array (100 items, size 5)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY).window(5).toArray();
  });

  bench('ramda aperture', () => {
    R.aperture(5, SMALL_ARRAY);
  });

  bench('manual windowing', () => {
    const result = [];
    for (let i = 0; i <= SMALL_ARRAY.length - 5; i++) {
      result.push(SMALL_ARRAY.slice(i, i + 5));
    }
    return result;
  });
});

describe('Window Operation - Medium Array (1000 items, size 10)', () => {
  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).window(10).toArray();
  });

  bench('ramda aperture', () => {
    R.aperture(10, MEDIUM_ARRAY);
  });

  bench('manual windowing', () => {
    const result = [];
    for (let i = 0; i <= MEDIUM_ARRAY.length - 10; i++) {
      result.push(MEDIUM_ARRAY.slice(i, i + 10));
    }
    return result;
  });
});

describe('Window Operation - Large Array (10000 items, size 20)', () => {
  bench('iterflow', () => {
    iter(LARGE_ARRAY).window(20).toArray();
  });

  bench('ramda aperture', () => {
    R.aperture(20, LARGE_ARRAY);
  });

  bench('manual windowing', () => {
    const result = [];
    for (let i = 0; i <= LARGE_ARRAY.length - 20; i++) {
      result.push(LARGE_ARRAY.slice(i, i + 20));
    }
    return result;
  });
});

describe('Moving Average - Small Array (100 items, window 5)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY)
      .window(5)
      .map(win => win.reduce((a, b) => a + b, 0) / win.length)
      .toArray();
  });

  bench('manual calculation', () => {
    const result = [];
    for (let i = 0; i <= SMALL_ARRAY.length - 5; i++) {
      const window = SMALL_ARRAY.slice(i, i + 5);
      const avg = window.reduce((a, b) => a + b, 0) / window.length;
      result.push(avg);
    }
    return result;
  });
});

describe('Moving Average - Medium Array (1000 items, window 10)', () => {
  bench('iterflow', () => {
    iter(MEDIUM_ARRAY)
      .window(10)
      .map(win => win.reduce((a, b) => a + b, 0) / win.length)
      .toArray();
  });

  bench('manual calculation', () => {
    const result = [];
    for (let i = 0; i <= MEDIUM_ARRAY.length - 10; i++) {
      const window = MEDIUM_ARRAY.slice(i, i + 10);
      const avg = window.reduce((a, b) => a + b, 0) / window.length;
      result.push(avg);
    }
    return result;
  });
});

describe('Moving Average - Large Array (10000 items, window 20)', () => {
  bench('iterflow', () => {
    iter(LARGE_ARRAY)
      .window(20)
      .map(win => win.reduce((a, b) => a + b, 0) / win.length)
      .toArray();
  });

  bench('manual calculation', () => {
    const result = [];
    for (let i = 0; i <= LARGE_ARRAY.length - 20; i++) {
      const window = LARGE_ARRAY.slice(i, i + 20);
      const avg = window.reduce((a, b) => a + b, 0) / window.length;
      result.push(avg);
    }
    return result;
  });
});

describe('Skip Operation - Small Array (100 items)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY).skip(10).toArray();
  });

  bench('lodash drop', () => {
    _.drop(SMALL_ARRAY, 10);
  });

  bench('ramda drop', () => {
    R.drop(10, SMALL_ARRAY);
  });

  bench('native slice', () => {
    SMALL_ARRAY.slice(10);
  });
});

describe('Skip Operation - Large Array (10000 items)', () => {
  bench('iterflow', () => {
    iter(LARGE_ARRAY).skip(1000).toArray();
  });

  bench('lodash drop', () => {
    _.drop(LARGE_ARRAY, 1000);
  });

  bench('ramda drop', () => {
    R.drop(1000, LARGE_ARRAY);
  });

  bench('native slice', () => {
    LARGE_ARRAY.slice(1000);
  });
});

describe('Partition Operation - Small Array (100 items)', () => {
  const predicate = (x: number) => x % 2 === 0;

  bench('iterflow', () => {
    iter(SMALL_ARRAY).partition(predicate);
  });

  bench('lodash', () => {
    _.partition(SMALL_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.partition(predicate, SMALL_ARRAY);
  });

  bench('manual partition', () => {
    const truthy = [];
    const falsy = [];
    for (const item of SMALL_ARRAY) {
      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    }
    return [truthy, falsy];
  });
});

describe('Partition Operation - Medium Array (1000 items)', () => {
  const predicate = (x: number) => x % 2 === 0;

  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).partition(predicate);
  });

  bench('lodash', () => {
    _.partition(MEDIUM_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.partition(predicate, MEDIUM_ARRAY);
  });

  bench('manual partition', () => {
    const truthy = [];
    const falsy = [];
    for (const item of MEDIUM_ARRAY) {
      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    }
    return [truthy, falsy];
  });
});
