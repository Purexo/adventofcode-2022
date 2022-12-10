import fs from 'node:fs/promises';

const fh = await fs.open(new URL('./input.txt', import.meta.url));

let sprite_pos = 1;
let min_sprite_pos = sprite_pos - 1;
let max_sprite_pos = sprite_pos + 1;

function setSprite(pos) {
  sprite_pos = pos;
  min_sprite_pos = sprite_pos - 1;
  max_sprite_pos = sprite_pos + 1;
}

// Cycle   1 -> ######################################## <- Cycle  40
// Cycle  41 -> ######################################## <- Cycle  80
// Cycle  81 -> ######################################## <- Cycle 120
// Cycle 121 -> ######################################## <- Cycle 160
// Cycle 161 -> ######################################## <- Cycle 200
// Cycle 201 -> ######################################## <- Cycle 240

let cycle_pos = 0;
function cycle() {
  if (cycle_pos % 40 === 0) {
    process.stdout.write('\n');
    cycle_pos = 0;
  }
  
  const pixel = cycle_pos >= min_sprite_pos && cycle_pos <= max_sprite_pos
    ? '█' : ' ';
  process.stdout.write(pixel);
  
  cycle_pos++;
}

function noop() {
  return cycle();
}

function addx(amount) {
  cycle();
  cycle();
  
  setSprite(sprite_pos + amount);
}

const INSTRUCTIONS = {noop, addx};

for await (const line of fh.readLines()) {
  const [instruction, amount='0'] = line.split(' ');
  
  INSTRUCTIONS[instruction](Number(amount));
}
