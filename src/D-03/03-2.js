import {open} from 'node:fs/promises';
import {pachunkify, pamap, pareduce} from "../lib/pipable-itertools/async.js";
import {pipe, sum} from "../lib/functools.js";
import {range} from "../lib/itertools/index.js";
import {pfindMap, pmap} from "../lib/pipable-itertools/index.js";

const fh = await open(new URL('./input.txt', import.meta.url));

// 1. read rows by chunk of three
// 2. find the char included in 3 rows
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

const badges = await pipe(
  fh.readLines(),
  pachunkify(3),
  pamap(getBadgeOfChunck),
  pamap(getBadgeValue),
  pareduce(sum, 0),
);

// 2703
console.log(badges);

/**
 * @param {string} r1
 * @param {string} r2
 * @param {string} r3
 * @return {string} the char in common on three lines
 */
function getBadgeOfChunck([r1, r2, r3]) {
  const s1 = new Set();
  const s2 = new Set();
  const s3 = new Set();
  
  function findBadge([c1, c2, c3]) {
    s1.add(c1);
    s2.add(c2);
    s3.add(c3);
    
    if (s2.has(c1) && s3.has(c1)) return c1;
    if (s1.has(c2) && s3.has(c2)) return c2;
    if (s1.has(c3) && s2.has(c3)) return c3;
  }
  
  return pipe(
    range(0, Math.max(r1.length, r2.length, r3.length), 1),
    pmap(i => [r1[i], r2[i], r3[i]]),
    pfindMap(findBadge),
  );
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
