import {open} from 'node:fs/promises';

const fh = await open(new URL('./input.txt', import.meta.url))

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

// 75501
console.log(max);
