import {open} from 'node:fs/promises';

const fh = await open(new URL('../fixtures/01.txt', import.meta.url))

const top_elves = [-Infinity, -Infinity, -Infinity];
let elf = 0;
for await (let line of fh.readLines()) {
  line = line.trim();

  if (!line) {
    // check if elf can be inserted in top top_elves (array must remain ordered)
    for (let i = 0; i < 3; i++) {
      if (elf <= top_elves[i]) continue;

      top_elves.splice(i, 0, elf); // insert in-place (respect order) elf
      top_elves.pop(); // remove the min elf
      break;
    }

    // reset elf
    elf = 0;
    continue;
  }

  const value = Number(line);
  elf += value;
}

const top_three = top_elves.reduce((acc, value) => acc + value, 0);

// 215594
console.log(top_three);