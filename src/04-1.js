import {open} from 'node:fs/promises';
import {pipe, sum} from "./utils/itertools.js";
import {pamap, pareduce} from "./utils/async-itertools.js";

const fh = await open(new URL('../fixtures/04.txt', import.meta.url));

const PAIR_SEPARATOR = '-';
const RANGE_SEPARATOR = ',';

const countPairsIncludingOthers = await pipe(
  fh.readLines(),
  pamap(getPairsOfLine),
  pamap(isOnePairFullyContainsTheOther),
  pareduce(sum, 0),
);

// 536
console.log(countPairsIncludingOthers);

function getPairsOfLine(line) {
  const pairs = Array(4);
  
  let value = '';
  let iterationFn = PAIR_0_VALUE_0;
  function PAIR_0_VALUE_0(value, c) {
    if (c === PAIR_SEPARATOR) {
      pairs[0] = Number(value);
      iterationFn = PAIR_0_VALUE_1;
      return '';
    }
    
    return value + c;
  }
  function PAIR_0_VALUE_1(value, c) {
    if (c === RANGE_SEPARATOR) {
      pairs[1] = Number(value);
      iterationFn = PAIR_1_VALUE_0;
      return '';
    }
    
    return value + c;
  }
  function PAIR_1_VALUE_0(value, c) {
    if (c === PAIR_SEPARATOR) {
      pairs[2] = Number(value);
      iterationFn = PAIR_1_VALUE_1;
      return '';
    }
    
    return value + c;
  }
  function PAIR_1_VALUE_1(value, c) {
    return value + c;
  }
  
  for (const c of line) {
    value = iterationFn(value, c);
  }
  pairs[3] = Number(value);
  
  return pairs;
}

function isOnePairFullyContainsTheOther([a, b, c, d]) {
  return c >= a && d <= b // [a..b] ⊃ [c..d]
    || a >= c && b <= d // [c..d] ⊃ [a..b]
}
