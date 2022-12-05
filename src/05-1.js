import {open} from "node:fs/promises";
import {ExtendIterator} from "./lib/IteratorHelpers/index.js";
import {range} from "./lib/itertools/index.js";
import {sum} from "./lib/functools.js";

// move 10 from 7 to 2
const REGEX_EXTRACT_POSITIONS = /move (\d+) from (\d)+ to (\d+)/;

const fh = await open(new URL('../fixtures/05.txt', import.meta.url));

/**
 * @type {Map<number, string[]>}
 */
const stacks = new Map();

let parse = parseStacks;
for await (const line of fh.readLines()) {
  parse(line)
}

function parseStacks(line) {
  if (!line) {
    for (const stack of stacks.values()) {
      stack.pop(); // remove unused row of digit key
      stack.reverse(); // reverse file to stack
    }
    return parse = parseMovements;
  }
  
  // transforme chaque ligne en iterable de caractère indéxé à partir de 1
  // '[Q] [D] [P] [L] [V] [D] [D] [C] [Z]'
  // deviens
  // 'QDPLVDDCZ' 1-indexed
  const iline = ExtendIterator(range(1, line.length, 4)).map(i => line[i]).indexed(1);
  
  for (const [stackIndex, char] of iline) {
    if (!stacks.has(stackIndex)) stacks.set(stackIndex, []); // ensure stack is init
    if (char === ' ') continue; // skip if empty
    
    const stack = stacks.get(stackIndex);
    stack.push(char);
  }
}

function parseMovements(line) {
  const [amount, fromKey, toKey] = ExtendIterator(line.match(REGEX_EXTRACT_POSITIONS).values()).drop(1).take(3).map(Number);
  const from = stacks.get(fromKey);
  const to = stacks.get(toKey);
  
  const move = from.splice(-amount);
  to.push.apply(to, move.reverse()); // move one at time
  console.log(move);
}

const top_items = ExtendIterator(stacks.values())
  .map(stack => stack.pop())
  .reduce(sum, '');

// NOT TCGLQSLPW
console.log(top_items);



// /**
//  * @type {Map<number, string[]>}
//  */
// const stacks =  await ExtendAsyncIterator(ExtendAsyncIterator.from(linesIterableIterator), {
//   takeUntil: function (takeUntilFn) {return takeUntil(this, takeUntilFn)}
// }, ['takeUntil'])
//   .takeUntil(Boolean) // stop à la première ligne vide
//   .map(
//     line => ExtendIterator(range(1, line.length, 4))
//       .map(i => line[i])
//       .indexed(1)
//   )
//   .reduce((stacks, line) => {
//     // positionne chaque caractère de la ligne en fonction de la colonne
//     for (const [stackIndex, char] of line) {
//       if (!stacks.has(stackIndex)) stacks.set(stackIndex, []); // ensure stack is init
//       if (char === ' ') continue; // skip if empty
//
//       const stack = stacks.get(stackIndex);
//       stack.push(char);
//     }
//
//     return stacks;
//   }, new Map());
//
// for (const stack of stacks.values()) {
//   stack.pop();
//   stack.reverse();
// }
//
// // move 10 from 7 to 2
// const REGEX_EXTRACT_POSITIONS = /move (\d+) from (\d)+ to (\d+)/;
// for await (const line of linesIterableIterator) { // shit l'iterateur n'est pas résumable, une fois que ça a break avec le takeUntil, l'iterateur est clos...
//   const [amount, fromKey, toKey] = ExtendIterator(line.match(REGEX_EXTRACT_POSITIONS)).drop(1).take(3).map(Number);
//   const from = stacks.get(fromKey);
//   const to = stacks.get(toKey);
//
//   const move = from.splice(-amount);
//   to.push.apply(to, move);
// }
//
// async function* takeUntil(iterable, takeUntilFn) {
//   for await (const item of iterable) {
//     if (!await takeUntilFn(item)) break;
//     yield item;
//   }
// }
