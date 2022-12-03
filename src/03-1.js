import {open} from 'node:fs/promises';

const fh = await open(new URL('../fixtures/03.txt', import.meta.url));

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

let priorities = 0;
for await (let line of fh.readLines()) {
  const s1 = new Set();
  const s2 = new Set();
  
  const char = findTransform(iterateInTwoWindow(line), ([c1, c2]) => {
    s1.add(c1);
    s2.add(c2);
  
    if (s1.has(c2)) return c2;
    if (s2.has(c1)) return c1;
  });
  const charAsciiValue = char.charCodeAt(0);
  
  const value = Number(char >= 'a' && char <= 'z') * (charAsciiValue - LOWER_SUB)
    + Number(char >= 'A' && char <= 'Z') * (charAsciiValue - UPPER_SUB);

  priorities += value;
}

// 8890
console.log(priorities);

function* iterateInTwoWindow(str) {
  let i2 = str.length / 2;
  
  for (const c of str) {
    yield [c, str[i2++]];
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
