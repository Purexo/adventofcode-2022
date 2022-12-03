import {open} from 'node:fs/promises';

const fh = await open(new URL('../fixtures/03.txt', import.meta.url));

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

let badges = 0;
for await (let [r1, r2, r3] of asyncChunkify(fh.readLines())) {
  const s1 = new Set();
  const s2 = new Set();
  const s3 = new Set();
  
  const iterations = range(0, Math.max(r1.length, r2.length, r3.length), 1)
  const entries = map(iterations, i => [r1[i], r2[i], r3[i]]);
  const badge = findTransform(entries, ([c1, c2, c3]) => {
    s1.add(c1);
    s2.add(c2);
    s3.add(c3);
  
    if (s2.has(c1) && s3.has(c1)) return c1;
    if (s1.has(c2) && s3.has(c2)) return c2;
    if (s1.has(c3) && s2.has(c3)) return c3;
  });
  const badgeAsciiValue = badge.charCodeAt(0);
  
  const value = Number(badge >= 'a' && badge <= 'z') * (badgeAsciiValue - LOWER_SUB)
    + Number(badge >= 'A' && badge <= 'Z') * (badgeAsciiValue - UPPER_SUB);
  
  badges += value;
}

// 2703
console.log(badges);

async function* asyncChunkify(iterator, size = 3) {
  let chunk = Array(size);
  let i = 0;
  
  function resetChunk() {
    chunk = Array(size);
    i = 0;
  }
  
  for await (const item of iterator) {
    chunk[i++] = item;
    
    if (i === size) {
      yield chunk;
      resetChunk();
    }
  }
  
  if (i > 0) {
    yield chunk;
  }
}

function* range(start, end, step) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

function* map(iterator, mapFn) {
  for (const item of iterator) {
    yield mapFn(item);
  }
}

/**
 * Consume the iterator
 * for each item use transform callback
 * if his return is truthy return the value returned by transform callback
 * @param iterator
 * @param transform value = transform(item)
 * @returns {*} value if truthy
 */
function findTransform(iterator, transform) {
  for (const item of iterator) {
    const value = transform(item);

    if (value) return value;
  }
}
