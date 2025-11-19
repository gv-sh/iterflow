import { bench, describe } from 'vitest';
import { iter } from '../src/index.js';
import _ from 'lodash';
import * as R from 'ramda';

const SMALL_ARRAY = Array.from({ length: 100 }, (_, i) => i);
const MEDIUM_ARRAY = Array.from({ length: 1000 }, (_, i) => i);
const LARGE_ARRAY = Array.from({ length: 10000 }, (_, i) => i);

describe('Reduce Operation - Small Array (100 items)', () => {
  const reducer = (acc: number, x: number) => acc + x;

  bench('iterflow', () => {
    iter(SMALL_ARRAY).reduce(reducer, 0);
  });

  bench('native array', () => {
    SMALL_ARRAY.reduce(reducer, 0);
  });

  bench('lodash', () => {
    _.reduce(SMALL_ARRAY, reducer, 0);
  });

  bench('ramda', () => {
    R.reduce(reducer, 0, SMALL_ARRAY);
  });
});

describe('Reduce Operation - Medium Array (1000 items)', () => {
  const reducer = (acc: number, x: number) => acc + x;

  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).reduce(reducer, 0);
  });

  bench('native array', () => {
    MEDIUM_ARRAY.reduce(reducer, 0);
  });

  bench('lodash', () => {
    _.reduce(MEDIUM_ARRAY, reducer, 0);
  });

  bench('ramda', () => {
    R.reduce(reducer, 0, MEDIUM_ARRAY);
  });
});

describe('Reduce Operation - Large Array (10000 items)', () => {
  const reducer = (acc: number, x: number) => acc + x;

  bench('iterflow', () => {
    iter(LARGE_ARRAY).reduce(reducer, 0);
  });

  bench('native array', () => {
    LARGE_ARRAY.reduce(reducer, 0);
  });

  bench('lodash', () => {
    _.reduce(LARGE_ARRAY, reducer, 0);
  });

  bench('ramda', () => {
    R.reduce(reducer, 0, LARGE_ARRAY);
  });
});

describe('Find Operation - Small Array (100 items)', () => {
  const predicate = (x: number) => x === 50;

  bench('iterflow', () => {
    iter(SMALL_ARRAY).find(predicate);
  });

  bench('native array', () => {
    SMALL_ARRAY.find(predicate);
  });

  bench('lodash', () => {
    _.find(SMALL_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.find(predicate, SMALL_ARRAY);
  });
});

describe('Find Operation - Large Array (10000 items) - Early Match', () => {
  const predicate = (x: number) => x === 10;

  bench('iterflow', () => {
    iter(LARGE_ARRAY).find(predicate);
  });

  bench('native array', () => {
    LARGE_ARRAY.find(predicate);
  });

  bench('lodash', () => {
    _.find(LARGE_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.find(predicate, LARGE_ARRAY);
  });
});

describe('Find Operation - Large Array (10000 items) - Late Match', () => {
  const predicate = (x: number) => x === 9990;

  bench('iterflow', () => {
    iter(LARGE_ARRAY).find(predicate);
  });

  bench('native array', () => {
    LARGE_ARRAY.find(predicate);
  });

  bench('lodash', () => {
    _.find(LARGE_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.find(predicate, LARGE_ARRAY);
  });
});

describe('Some Operation - Small Array (100 items)', () => {
  const predicate = (x: number) => x > 50;

  bench('iterflow', () => {
    iter(SMALL_ARRAY).some(predicate);
  });

  bench('native array', () => {
    SMALL_ARRAY.some(predicate);
  });

  bench('lodash', () => {
    _.some(SMALL_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.any(predicate, SMALL_ARRAY);
  });
});

describe('Some Operation - Large Array (10000 items) - Early Match', () => {
  const predicate = (x: number) => x > 10;

  bench('iterflow', () => {
    iter(LARGE_ARRAY).some(predicate);
  });

  bench('native array', () => {
    LARGE_ARRAY.some(predicate);
  });

  bench('lodash', () => {
    _.some(LARGE_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.any(predicate, LARGE_ARRAY);
  });
});

describe('Every Operation - Small Array (100 items)', () => {
  const predicate = (x: number) => x >= 0;

  bench('iterflow', () => {
    iter(SMALL_ARRAY).every(predicate);
  });

  bench('native array', () => {
    SMALL_ARRAY.every(predicate);
  });

  bench('lodash', () => {
    _.every(SMALL_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.all(predicate, SMALL_ARRAY);
  });
});

describe('Every Operation - Large Array (10000 items) - All Pass', () => {
  const predicate = (x: number) => x >= 0;

  bench('iterflow', () => {
    iter(LARGE_ARRAY).every(predicate);
  });

  bench('native array', () => {
    LARGE_ARRAY.every(predicate);
  });

  bench('lodash', () => {
    _.every(LARGE_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.all(predicate, LARGE_ARRAY);
  });
});

describe('Every Operation - Large Array (10000 items) - Early Failure', () => {
  const predicate = (x: number) => x < 10;

  bench('iterflow', () => {
    iter(LARGE_ARRAY).every(predicate);
  });

  bench('native array', () => {
    LARGE_ARRAY.every(predicate);
  });

  bench('lodash', () => {
    _.every(LARGE_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.all(predicate, LARGE_ARRAY);
  });
});

describe('Count Operation - Small Array (100 items)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY).count();
  });

  bench('lodash', () => {
    _.size(SMALL_ARRAY);
  });

  bench('ramda', () => {
    R.length(SMALL_ARRAY);
  });

  bench('native length', () => {
    SMALL_ARRAY.length;
  });
});

describe('ToArray Operation - Medium Array (1000 items)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY).toArray();
  });

  bench('Array.from', () => {
    Array.from(SMALL_ARRAY);
  });

  bench('spread operator', () => {
    [...SMALL_ARRAY];
  });
});
