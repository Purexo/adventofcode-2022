import {open} from 'node:fs/promises';
import {sum} from "../lib/functools.js";
import {ExtendAsyncIterator} from "../lib/IteratorHelpers/index.js";

const fh = await open(new URL('./input.txt', import.meta.url));

const PAIR_SEPARATOR = '-';
const CELL_SEPARATOR = ',';

const countPairsOverlap = await ExtendAsyncIterator(fh.readLines())
  .map(getPairsOfLine)
  .map(isPairsOverlapping)
  .reduce(sum, 0);

// 845
console.log(countPairsOverlap);

/**
 * parse line char by char, on find a separator put the aggregated value to the right place in pairs
 * @param {string} line
 * @return {[number, number, number, number]} - [start_a, end_a, start_b, end_b]
 */
function getPairsOfLine(line) {
  const pairs = Array(4);
  
  // self-mutable-state-machine-iterator
  // start with PAIR_0_VALUE_0 iteration parsing
  let iterationFn = PAIR_0_VALUE_0;
  
  // when find the PAIR_SEPARATOR put the aggregated value as Number to the pairs[0]
  // and pass to PAIR_0_VALUE_1 for next iterations
  function PAIR_0_VALUE_0(value, c) {
    if (c === PAIR_SEPARATOR) {
      pairs[0] = Number(value);
      iterationFn = PAIR_0_VALUE_1;
      return '';
    }
    
    return value + c;
  }
  
  // when find the CELL_SEPARATOR put the aggregated value as Number to the pairs[1]
  // and pass to PAIR_1_VALUE_0 for next iterations
  function PAIR_0_VALUE_1(value, c) {
    if (c === CELL_SEPARATOR) {
      pairs[1] = Number(value);
      iterationFn = PAIR_1_VALUE_0;
      return '';
    }
    
    return value + c;
  }
  
  // when find the PAIR_SEPARATOR put the aggregated value as Number to the pairs[2]
  // and pass to PAIR_1_VALUE_1 for next iterations
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
  
  let value = '';
  for (const c of line) {
    value = iterationFn(value, c);
  }
  pairs[3] = Number(value);
  
  return pairs;
}

function isPairsOverlapping([start_a, end_a, start_b, end_b]) {
  return start_a <= end_b && end_a >= start_b; // [start_a..end_a] ⋂ [start_b..end_b]
}
