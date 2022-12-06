import {open} from 'node:fs/promises';
import {pipe, sum} from "../lib/functools.js";
import {pamap, pareduce} from "../lib/pipable-itertools/async.js";
import {piterateInTwoWindow} from "../utils/itertools.js";
import {pfindMap} from "../lib/pipable-itertools/index.js";

const fh = await open(new URL('./input.txt', import.meta.url));

// 1. find the char which is in both part of the row
// 2. associate char to value following these rules
//    - Lowercase item types a through z have priorities 1 through 26
//    - Uppercase item types A through Z have priorities 27 through 52
// 3. sum the values

// 'a'.charCodeAt(0) - ? = 1
// 97 - ? = 1
// -? = 1 - 97
// ? = -1 * (1 - 97)
const LOWER_SUB = -1 * (1 - 'a'.charCodeAt(0));
const UPPER_SUB = -1 * (27 - 'A'.charCodeAt(0));

const priorities = await pipe(
  fh.readLines(),
  pamap(getCharInTwoPartOfTheLine),
  pamap(getBadgeValue),
  pareduce(sum, 0),
);

// 7795
console.log(priorities);

function getCharInTwoPartOfTheLine(line) {
  const s1 = new Set();
  const s2 = new Set();
  
  function findChar([c1, c2]) {
    s1.add(c1);
    s2.add(c2);
    
    if (s1.has(c2)) return c2;
    if (s2.has(c1)) return c1;
  }
  
  return pipe(line, piterateInTwoWindow, pfindMap(findChar));
}

/**
 * @param {string} badge
 * @return {number}
 */
function getBadgeValue(badge) {
  const badgeAsciiValue = badge.charCodeAt(0);
  
  return Number(badge >= 'a' && badge <= 'z') * (badgeAsciiValue - LOWER_SUB)
    + Number(badge >= 'A' && badge <= 'Z') * (badgeAsciiValue - UPPER_SUB);
}
