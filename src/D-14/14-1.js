import fs from 'node:fs';
import {open} from 'node:fs/promises';
import {pipe} from "../lib/functools.js";
import {pamap} from "../lib/pipable-itertools/async.js";
import {toArray} from "../lib/itertools/async.js";

const fh = await open(new URL('./train.txt', import.meta.url));

let min_x = Infinity, min_y = Infinity;
let max_x = -Infinity, max_y = -Infinity;

const paths = await pipe(
  fh.readLines(),
  pamap(row =>
    row.split(' -> ').map(coordinate => {
      const [x, y] = coordinate.split(',').map(Number);

      if (x < min_x) min_x = x;
      if (x > max_x) max_x = x;
      if (y < min_y) min_y = y;
      if (y > max_y) max_y = y;

      return {x, y};
    })
  ),
  toArray
);

const size_x = max_x + 1;
const size_y = max_y + 1;

const SAND_X = 500;
const SAND_Y = 0;

const matrix = Array(size_x * size_y).fill('.');
matrix.toString = function () {
  const window_start_x = min_x - 1;
  const window_start_y = 0;

  let str = '';

  for (let y = window_start_y; y <= size_y; y++) {
    const slice_start = y * size_x + window_start_x;
    const slice_end = slice_start + (size_x - min_x) + 1;
    str += matrix.slice(slice_start, slice_end).join('') + '\n';
  }

  return str;
}

function getXY(linearIndex) {
  return {
    x: linearIndex % size_x,
    y: Math.floor(linearIndex / size_x)
  }
}

function getLinear(x, y) {
  return y * size_x + x;
}

matrix[getLinear(SAND_X, SAND_Y)] = '+';
for (const path of paths) {
  console.log()

  let previous_coordinate = path[0];
  for (let i = 1; i < path.length; i++) {
    const coordinate = path[i];

    console.log(previous_coordinate, coordinate);

    const x_direction = Math.sign(coordinate.x - previous_coordinate.x);
    for (let x = previous_coordinate.x; true; x += x_direction) {
      const index = getLinear(x, coordinate.y);
      matrix[index] = '#';

      if (x === coordinate.x) break;
    }
    const y_direction = Math.sign(coordinate.y - previous_coordinate.y);
    for (let y = previous_coordinate.y; true; y += y_direction) {
      const index = getLinear(coordinate.x, y);
      matrix[index] = '#';

      if (y === coordinate.y) break;
    }

    previous_coordinate = coordinate;
  }
}

const debugStream = fs.createWriteStream('./matrix.txt', {encoding: "utf-8"});
debugStream.write(matrix.toString());

let stable_sand = 0;
adding_sand: while (true) {
  const sand = {x: SAND_X, y: SAND_Y};
  while (true) {
    if (sand.y >= size_y || sand.x >= size_x || sand.x < 0) {
      // sand out of bounds
      break adding_sand;
    }
    const down_down = matrix[getLinear(sand.x, sand.y + 1)];
    const down_left = matrix[getLinear(sand.x - 1, sand.y + 1)];
    const down_right = matrix[getLinear(sand.x + 1, sand.y + 1)];

    if ([down_down, down_left, down_right].every(isBlocking)) {
      matrix[getLinear(sand.x, sand.y)] = 'o';
      break;
    }

    if (!isBlocking(down_down)) sand.y++;
    else if (!isBlocking(down_left)) {sand.x--; sand.y++;}
    else if (!isBlocking(down_right)) {sand.x++; sand.y++;}
  }

  stable_sand++;
}

console.log(stable_sand);

debugStream.write(matrix.toString());

function isBlocking(value) {
  return value === '#' || value === 'o';
}