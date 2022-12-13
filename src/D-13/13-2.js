import {open} from 'node:fs/promises';
import util from 'node:util';
import {pipe} from "../lib/functools.js";
import {pafilter, pamap} from "../lib/pipable-itertools/async.js";
import {toArray} from "../lib/itertools/async.js";
import {indexed} from "../lib/itertools/index.js";

const fh = await open(new URL('./input.txt', import.meta.url));

const signals = await pipe(
  fh.readLines(),
  pafilter(line => line !== ''),
  pamap(JSON.parse),
  toArray,
)

const divider2 = [[2]];
const divider6 = [[6]];
signals.push(divider2, divider6);

signals.sort(deepPairCompare);
for (const signal of signals) {
  console.log(util.inspect(signal, {compact: true, depth: Infinity}));
}

let index2, index6;
for (const [index, signal] of indexed(signals, 1)) {
  if (signal === divider2) index2 = index;
  if (signal === divider6) index6 = index;
}

// train expected 10 - 14 : 140
// 117 - 197 : 23049 OK
console.log(index2, index6, index2 * index6);


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