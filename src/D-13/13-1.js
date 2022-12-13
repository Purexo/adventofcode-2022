import {open} from 'node:fs/promises';

const fh = await open(new URL('./input.txt', import.meta.url));

let countIsInRightOrder = 0;
let indicePairs = 0;
for await (const groups of splitBy(fh.readLines(), line => line === '')) {
  indicePairs++;
  const [left, right] = groups.map(g => JSON.parse(g));

  function deepPairCompare(left=-1, right=-1) {
    const isArrayLeft = Array.isArray(left);
    const isArrayRight = Array.isArray(right);

    if (!isArrayLeft && !isArrayRight) return left - right;

    if (isArrayLeft && !isArrayRight) right = [right];
    else if (!isArrayLeft && isArrayRight) left = [left];

    for (const [l, r] of zip_longest(left, right)) {
      const comparaison = deepPairCompare(l, r);
      if (comparaison === 0) continue;
      return comparaison;
    }

    return 0;
  }

  if (deepPairCompare(left, right) < 0) {
    countIsInRightOrder += indicePairs;
    console.log(indicePairs);
  }
}

// train expected 13
// guessed 5505 too low
// guessed 10866 too high
// guessed 6515 too low
// guessed 6682
// 6623 OK
console.log(countIsInRightOrder);

async function* splitBy(iterable, splitByFn) {
  let acc = [];
  for await (const item of iterable) {
    if (splitByFn(item)) {
      yield acc;
      acc = [];
      continue;
    }

    acc.push(item);
  }

  if (acc.length) {
    yield acc
  }
}

function* zip_longest(...iterables) {
  const iterators = iterables.map(i => i[Symbol.iterator]());

  while (true) {
    const values = iterators.map(i => i.next());

    const yieldable = Array(values.length);
    let done = true;
    for (const [i, v] of values.entries()) {
      yieldable[i] = v.value;
      done = done && v.done;
    }

    if (done) return;

    yield yieldable;
  }
}