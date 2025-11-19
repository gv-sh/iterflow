import { bench, describe } from 'vitest';
import { iter } from '../src/index.js';
import _ from 'lodash';
import * as R from 'ramda';

const SMALL_ARRAY = Array.from({ length: 100 }, (_, i) => i);
const MEDIUM_ARRAY = Array.from({ length: 1000 }, (_, i) => i);
const LARGE_ARRAY = Array.from({ length: 10000 }, (_, i) => i);

describe('Map Operation - Small Array (100 items)', () => {
  const mapper = (x: number) => x * 2;

  bench('iterflow', () => {
    iter(SMALL_ARRAY).map(mapper).toArray();
  });

  bench('native array', () => {
    SMALL_ARRAY.map(mapper);
  });

  bench('lodash', () => {
    _.map(SMALL_ARRAY, mapper);
  });

  bench('ramda', () => {
    R.map(mapper, SMALL_ARRAY);
  });
});

describe('Map Operation - Medium Array (1000 items)', () => {
  const mapper = (x: number) => x * 2;

  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).map(mapper).toArray();
  });

  bench('native array', () => {
    MEDIUM_ARRAY.map(mapper);
  });

  bench('lodash', () => {
    _.map(MEDIUM_ARRAY, mapper);
  });

  bench('ramda', () => {
    R.map(mapper, MEDIUM_ARRAY);
  });
});

describe('Map Operation - Large Array (10000 items)', () => {
  const mapper = (x: number) => x * 2;

  bench('iterflow', () => {
    iter(LARGE_ARRAY).map(mapper).toArray();
  });

  bench('native array', () => {
    LARGE_ARRAY.map(mapper);
  });

  bench('lodash', () => {
    _.map(LARGE_ARRAY, mapper);
  });

  bench('ramda', () => {
    R.map(mapper, LARGE_ARRAY);
  });
});

describe('Filter Operation - Small Array (100 items)', () => {
  const predicate = (x: number) => x % 2 === 0;

  bench('iterflow', () => {
    iter(SMALL_ARRAY).filter(predicate).toArray();
  });

  bench('native array', () => {
    SMALL_ARRAY.filter(predicate);
  });

  bench('lodash', () => {
    _.filter(SMALL_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.filter(predicate, SMALL_ARRAY);
  });
});

describe('Filter Operation - Medium Array (1000 items)', () => {
  const predicate = (x: number) => x % 2 === 0;

  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).filter(predicate).toArray();
  });

  bench('native array', () => {
    MEDIUM_ARRAY.filter(predicate);
  });

  bench('lodash', () => {
    _.filter(MEDIUM_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.filter(predicate, MEDIUM_ARRAY);
  });
});

describe('Filter Operation - Large Array (10000 items)', () => {
  const predicate = (x: number) => x % 2 === 0;

  bench('iterflow', () => {
    iter(LARGE_ARRAY).filter(predicate).toArray();
  });

  bench('native array', () => {
    LARGE_ARRAY.filter(predicate);
  });

  bench('lodash', () => {
    _.filter(LARGE_ARRAY, predicate);
  });

  bench('ramda', () => {
    R.filter(predicate, LARGE_ARRAY);
  });
});

describe('Map + Filter Chain - Small Array (100 items)', () => {
  const mapper = (x: number) => x * 2;
  const predicate = (x: number) => x % 4 === 0;

  bench('iterflow', () => {
    iter(SMALL_ARRAY).map(mapper).filter(predicate).toArray();
  });

  bench('native array', () => {
    SMALL_ARRAY.map(mapper).filter(predicate);
  });

  bench('lodash chain', () => {
    _.chain(SMALL_ARRAY).map(mapper).filter(predicate).value();
  });

  bench('ramda pipe', () => {
    R.pipe(R.map(mapper), R.filter(predicate))(SMALL_ARRAY);
  });
});

describe('Map + Filter Chain - Medium Array (1000 items)', () => {
  const mapper = (x: number) => x * 2;
  const predicate = (x: number) => x % 4 === 0;

  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).map(mapper).filter(predicate).toArray();
  });

  bench('native array', () => {
    MEDIUM_ARRAY.map(mapper).filter(predicate);
  });

  bench('lodash chain', () => {
    _.chain(MEDIUM_ARRAY).map(mapper).filter(predicate).value();
  });

  bench('ramda pipe', () => {
    R.pipe(R.map(mapper), R.filter(predicate))(MEDIUM_ARRAY);
  });
});

describe('Map + Filter Chain - Large Array (10000 items)', () => {
  const mapper = (x: number) => x * 2;
  const predicate = (x: number) => x % 4 === 0;

  bench('iterflow', () => {
    iter(LARGE_ARRAY).map(mapper).filter(predicate).toArray();
  });

  bench('native array', () => {
    LARGE_ARRAY.map(mapper).filter(predicate);
  });

  bench('lodash chain', () => {
    _.chain(LARGE_ARRAY).map(mapper).filter(predicate).value();
  });

  bench('ramda pipe', () => {
    R.pipe(R.map(mapper), R.filter(predicate))(LARGE_ARRAY);
  });
});

describe('FlatMap Operation - Small Array (100 items)', () => {
  const mapper = (x: number) => [x, x * 2];

  bench('iterflow', () => {
    iter(SMALL_ARRAY).flatMap(mapper).toArray();
  });

  bench('native array', () => {
    SMALL_ARRAY.flatMap(mapper);
  });

  bench('lodash', () => {
    _.flatMap(SMALL_ARRAY, mapper);
  });

  bench('ramda', () => {
    R.chain(mapper, SMALL_ARRAY);
  });
});

describe('FlatMap Operation - Medium Array (1000 items)', () => {
  const mapper = (x: number) => [x, x * 2];

  bench('iterflow', () => {
    iter(MEDIUM_ARRAY).flatMap(mapper).toArray();
  });

  bench('native array', () => {
    MEDIUM_ARRAY.flatMap(mapper);
  });

  bench('lodash', () => {
    _.flatMap(MEDIUM_ARRAY, mapper);
  });

  bench('ramda', () => {
    R.chain(mapper, MEDIUM_ARRAY);
  });
});

describe('Take Operation - Small Array (100 items)', () => {
  bench('iterflow', () => {
    iter(SMALL_ARRAY).take(10).toArray();
  });

  bench('lodash', () => {
    _.take(SMALL_ARRAY, 10);
  });

  bench('ramda', () => {
    R.take(10, SMALL_ARRAY);
  });

  bench('native slice', () => {
    SMALL_ARRAY.slice(0, 10);
  });
});

describe('Take Operation - Large Array (10000 items)', () => {
  bench('iterflow', () => {
    iter(LARGE_ARRAY).take(10).toArray();
  });

  bench('lodash', () => {
    _.take(LARGE_ARRAY, 10);
  });

  bench('ramda', () => {
    R.take(10, LARGE_ARRAY);
  });

  bench('native slice', () => {
    LARGE_ARRAY.slice(0, 10);
  });
});
