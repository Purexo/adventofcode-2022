import fs from 'node:fs/promises';

const fh = await fs.open(new URL('./input.txt', import.meta.url));

let HEAD_X = 0, HEAD_Y = 0;
let TAIL_X = 0, TAIL_Y = 0;

const TAIL_VISITED = new Set([`${TAIL_X}-${TAIL_Y}`]);

/*
 * Used in a context of step by step so
 * - 0 mean on same coordinate
 * - 1 mean aside on only one axis
 * - 2 mean in diagonal
 */
function getDistance() {
  const diff_x = HEAD_X - TAIL_X;
  const diff_y = HEAD_Y - TAIL_Y;

  return diff_x*diff_x + diff_y*diff_y;
}

const MOVE_STRATEGY = {
  U(length) {
    for (let i = 0; i < length; i++) {
      HEAD_Y--;

      if (getDistance() <= 2) continue;

      TAIL_Y--; // following on y axis
      TAIL_X += HEAD_X - TAIL_X // diagonal following

      TAIL_VISITED.add(`${TAIL_X}-${TAIL_Y}`);
    }
  },
  D(length) {
    for (let i = 0; i < length; i++) {
      HEAD_Y++;

      if (getDistance() <= 2) continue;

      TAIL_Y++; // following on y axis
      TAIL_X += HEAD_X - TAIL_X // diagonal following

      TAIL_VISITED.add(`${TAIL_X}-${TAIL_Y}`);
    }
  },
  L(length) {
    for (let i = 0; i < length; i++) {
      HEAD_X--;

      if (getDistance() <= 2) continue;

      TAIL_X--; // following on y axis
      TAIL_Y += HEAD_Y - TAIL_Y // diagonal following

      TAIL_VISITED.add(`${TAIL_X}-${TAIL_Y}`);
    }
  },
  R(length) {
    for (let i = 0; i < length; i++) {
      HEAD_X++;

      if (getDistance() <= 2) continue;

      TAIL_X++; // following on y axis
      TAIL_Y += HEAD_Y - TAIL_Y // diagonal following

      TAIL_VISITED.add(`${TAIL_X}-${TAIL_Y}`);
    }
  },
};

for await (const line of fh.readLines()) {
  let [direction, distance] = line.split(' ');
  distance = Number(distance);

  MOVE_STRATEGY[direction](distance);
}

// train expected = 13
console.log(TAIL_VISITED.size);
