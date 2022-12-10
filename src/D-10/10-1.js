import fs from 'node:fs/promises';

const fh = await fs.open(new URL('./input.txt', import.meta.url));

let cycles = 0;
let X = 1;
let strengthSum = 0;

function shouldStop() {
  return cycles >= 220;
}

function cycle() {
  cycles++;
  
  if (cycles % 40 === 20) {
    const strength = cycles * X;
    strengthSum += strength;
    console.log({cycles, X, strength, strengthSum});
  }
  
  return shouldStop();
}
function noop() {
  return cycle();
}

function addx(amount) {
  if (cycle()) return true;
  if (cycle()) return true;
  
  X += amount
  
  return false;
}

const INSTRUCTIONS = {noop, addx};

for await (const line of fh.readLines()) {
  const [instruction, amount='0'] = line.split(' ');
  
  const shouldBreak = INSTRUCTIONS[instruction](Number(amount));
  if (shouldBreak) break;
}

// train expected 13140
console.log(strengthSum);
