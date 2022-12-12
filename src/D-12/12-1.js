import fs from 'node:fs';

const raw = fs
  .readFileSync(new URL('./input.txt', import.meta.url), {encoding: 'utf8'})
  .split('\n');

const matrix_x = raw[0].length;
const matrix_y = raw.length;

/* xy
001020304050607080
011121314151617181
021222324252627282
031323334353637383
041424344454647484
 as a single array */
const matrix = raw.flatMap(row => Array.from(row))

function getXY(linearIndex) {
  return {
    x: linearIndex % matrix_x,
    y: Math.floor(linearIndex / matrix_x)
  }
}

function getLinear(x, y) {
  return y * matrix_x + x;
}


let start_pos = 0;
let highest_pos = 0;

for (const [index, elevation] of matrix.entries()) {
  if (elevation === 'S') {
    start_pos = index;
    matrix[index] = 'a';
  }
  else if (elevation === 'E') {
    highest_pos = index;
    matrix[index] = 'z';
  }
}

const highest_step_min = new Map();
const NOROLLBACK = new Set([start_pos]);
let possibilities = [start_pos];
let steps = 0;
let stop = false;
while (!stop) {
  possibilities = possibilities.flatMap(pos => {
    NOROLLBACK.add(pos);
    const elevation = matrix[pos];

    if (!highest_step_min.has(elevation)) {
      highest_step_min.set(elevation, steps);
    }

    if (pos === highest_pos) {
      console.log('reached target in', steps, 'steps');
      stop = true;
      return [];
    }

    const elevationp1 = String.fromCharCode(elevation.charCodeAt(0) + 1);

    const {x, y} = getXY(pos);
    const explorations = [];

    function insertIfNoRollback(target) {
      if (NOROLLBACK.has(target)) return;

      explorations.push(target);
    }

    if (x > 0) { // bound matrix left
      const westPos = getLinear(x - 1, y);
      const westElevation = matrix[westPos];
      if (westElevation <= elevationp1) {
        insertIfNoRollback(westPos);
      }
    }
    if (y > 0) { // bound matrix top
      const northPos = getLinear(x, y - 1);
      const northElevation = matrix[northPos];
      if (northElevation <= elevationp1) {
        insertIfNoRollback(northPos);
      }
    }
    if (x < matrix_x - 1) { // bound matrix right
      const eastPos = getLinear(x + 1, y);
      const eastElevation = matrix[eastPos];
      if (eastElevation <= elevationp1) {
        insertIfNoRollback(eastPos);
      }
    }
    if (y < matrix_y - 1) { // bound matrix top
      const southPos = getLinear(x, y + 1);
      const southElevation = matrix[southPos];
      if (southElevation <= elevationp1) {
        insertIfNoRollback(southPos);
      }
    }

    return explorations;
  });
  // dedupe
  possibilities = Array.from(new Set(possibilities));
  if (!possibilities.length) break; // cul de sac

  steps++;
}

let highest_elevation_reached = 'a';
for (const elevation of highest_step_min.keys()) {
  if (elevation > highest_elevation_reached) highest_elevation_reached = elevation;
}

// train expected 31
// guessed 398 but too low
console.log(highest_step_min.get(highest_elevation_reached));
