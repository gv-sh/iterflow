import { iter } from '../src/index.js';

// Fibonacci generator
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// First 10 even Fibonacci numbers
const evenFibs = iter(fibonacci())
  .filter(x => x % 2 === 0)
  .take(10)
  .toArray();

console.log('First 10 even Fibonacci numbers:');
console.log(evenFibs);
