import fs from 'node:fs/promises';

const fh = await fs.open(new URL('./input.txt', import.meta.url));

/**
 * @typedef Knot
 * @property {number} x
 * @property {number} y
 */

/**
 * @type {Knot[]}
 */
const rope = Array.from(Array(10), () => ({x: 0, y: 0}));

const TAIL_VISITED = new Set([`0|0`]);

function followMove(head, knot) {
  const distance_x = head.x - knot.x;
  const distance_y = head.y - knot.y;
  const distance_x_abs = Math.abs(distance_x);
  const distance_y_abs = Math.abs(distance_y);

  const should_snap = distance_x_abs > 1 || distance_y_abs > 1;

  knot.x += should_snap * Math.sign(distance_x);
  knot.y += should_snap * Math.sign(distance_y);
}

/**
 *
 * @param {Knot} direction - normalized vector : 0;1 | 0;-1 | 1;0 | -1;0
 * @param {number} length
 */
function moveRope(direction, length) {
  for (let i = 0; i < length; i++) {
    let head = rope[0];

    head.x += direction.x;
    head.y += direction.y;

    for (let i = 1; i < rope.length; i++) {
      const knot = rope[i];

      followMove(head, knot);

      head = knot;
    }

    const tail = rope.at(-1);
    TAIL_VISITED.add(`${tail.x}|${tail.y}`);
  }
}

const DIRECTIONS = {
  U: {x: 0, y: -1},
  D: {x: 0, y: +1},
  L: {x: -1, y: 0},
  R: {x: +1, y: 0},
}
for await (const line of fh.readLines()) {
  let [direction, length] = line.split(' ');

  direction = DIRECTIONS[direction];
  length = Number(length);

  moveRope(direction, length);
}

// train expected 36
// answer is 2327
console.log(TAIL_VISITED.size);

/*
 * Draw tail positions
 * for fun
 * because why not
 */

let min_x = 0, max_x = 0;
let min_y = 0, max_y = 0;

for (const pos of TAIL_VISITED) {
  const [x, y] = pos.split('|').map(Number);

  if (x < min_x) min_x = x;
  if (y < min_y) min_y = y;
  if (x > max_x) max_x = x;
  if (y > max_y) max_y = y;
}

const offset_x = -min_x;
const offset_y = -min_y;
const row_size = max_x - min_x + 1;
const column_size = max_y - min_y + 1;

const matrix_y_x = Array.from(Array(column_size), () => Array.from(Array(row_size), () => ' '));

for (const pos of TAIL_VISITED) {
  const [x, y] = pos.split('|').map(Number);

  const mx = x + offset_x;
  const my = y + offset_y;

  matrix_y_x[my][mx] = '█';
}

const fht = await fs.open(new URL('./tail-output.txt', import.meta.url), 'w');
for (const line of matrix_y_x) {
  await fht.write(line.join('') + '\n');
}

