import {open} from 'node:fs/promises';

const fh = await open(new URL('../fixtures/01.txt', import.meta.url))

let max = -Infinity;
let current = 0;
for await (let line of fh.readLines()) {
  line = line.trim();

  if (!line) {
    if (current > max) max = current;
    current = 0
    continue;
  }

  const value = Number(line);
  current+= value;
}

console.log(max);
