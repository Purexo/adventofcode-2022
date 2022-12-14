import {open} from 'node:fs/promises';
import {pipe} from "../lib/functools.js";
import {pamap} from "../lib/pipable-itertools/async.js";
import {toArray} from "../lib/itertools/async.js";


class InfiniteCavern extends Map {
  min_x = Infinity; min_y = Infinity;
  max_x = -Infinity; max_y = -Infinity;

  constructor() {
    super();
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {string} value
   * @return {this}
   */
  set(x, y, value) {
    if (x < this.min_x) this.min_x = x;
    if (x > this.max_x) this.max_x = x;
    if (y < this.min_y) this.min_y = y;
    if (y > this.max_y) this.max_y = y;

    return super.set(`${x}-${y}`, value);
  }

  floor = 0;
  setFloor() {
    this.floor = this.max_y + 2;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @return {string}
   */
  get(x, y) {
    if (y >= this.floor) return '#';
    return super.get(`${x}-${y}`) ?? '.';
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  has(x, y) {
    return super.has(`${x}-${y}`);
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  delete(x, y) {
    return super.delete(`${x}-${y}`);
  }

  /**
   *
   * @return {string}
   */
  toString() {
    let str = '';

    for (let y = 0; y <= this.max_y + 1; y++) {
      for (let x = 0; x <= this.max_x; x++) {
        str += this.get(x, y);
      }
      str += '\n';
    }

    return str + '\n';
  }
}

const fh = await open(new URL('./input.txt', import.meta.url));

const SAND_X = 500;
const SAND_Y = 0;
const matrix = new InfiniteCavern();

const paths = await pipe(
  fh.readLines(),
  pamap(row =>
    row.split(' -> ').map(coordinate => {
      const [x, y] = coordinate.split(',').map(Number);

      return {x, y};
    })
  ),
  toArray
);

matrix.set(SAND_X, SAND_Y, '+');

for (const path of paths) {
  console.log()

  let previous_coordinate = path[0];
  for (let i = 1; i < path.length; i++) {
    const coordinate = path[i];

    console.log(previous_coordinate, coordinate);

    const x_direction = Math.sign(coordinate.x - previous_coordinate.x);
    for (let x = previous_coordinate.x; true; x += x_direction) {
      matrix.set(x, coordinate.y, '#');

      if (x === coordinate.x) break;
    }
    const y_direction = Math.sign(coordinate.y - previous_coordinate.y);
    for (let y = previous_coordinate.y; true; y += y_direction) {
      matrix.set(coordinate.x, y, '#');

      if (y === coordinate.y) break;
    }

    previous_coordinate = coordinate;
  }
}
matrix.setFloor();

const fhDebug = await open('./matrix.txt', 'w');
await fhDebug.write(matrix.toString());

let stable_sand = 0;
adding_sand: while (true) {
  const sand = {x: SAND_X, y: SAND_Y};
  while (true) {
    const down_down = matrix.get(sand.x, sand.y + 1);
    const down_left = matrix.get(sand.x - 1, sand.y + 1);
    const down_right = matrix.get(sand.x + 1, sand.y + 1);

    if ([down_down, down_left, down_right].every(isBlocking)) {
      matrix.set(sand.x, sand.y, 'o');
      stable_sand++;

      // await fhDebug.write(matrix.toString());

      if (sand.y === SAND_Y && sand.x === SAND_X) {
        // sand blocking the source
        break adding_sand;
      }
      break;
    }

    if (!isBlocking(down_down)) sand.y++;
    else if (!isBlocking(down_left)) {sand.x--; sand.y++;}
    else if (!isBlocking(down_right)) {sand.x++; sand.y++;}
  }
}

console.log(stable_sand);

await fhDebug.write(matrix.toString());

function isBlocking(value) {
  return value === '#' || value === 'o';
}