import fs from 'node:fs';

const raw_data = fs.readFileSync(new URL(' ./input.txt', import.meta.url), {encoding: "utf-8"});
const data_y_x = raw_data.split('\n').map(str => Array.from(str).map(Number));

const data_x_y = Array.from(data_y_x[0], () => Array(data_y_x.length)); // pivot for getter optimisation
for (const [y, trees] of data_y_x.entries()) {
  for (const [x, tree] of trees.entries()) {
    data_x_y[x][y] = tree;
  }
}

/*
 * Scan approach
 * on each row I check from left side and count visible trees, same from right
 * on each column I check from top side and count visible trees, same from bottom
 */

/** @type {Set<string>} */
const treeSeen = new Set();

// check by left and right
for (let y = 0; y < data_y_x.length; y++) {
  const trees_y = data_y_x[y];

  // left
  let maxHeight = -1;
  for (let x = 0; x < trees_y.length; x++) {
    const tree = trees_y[x];
    if (tree > maxHeight) {
      treeSeen.add(`${x}-${y}`);
      maxHeight = tree;
    }
  }

  // right
  maxHeight = -1
  for (let x = trees_y.length - 1; x >= 0; x--) {
    const tree = trees_y[x];
    if (tree > maxHeight) {
      treeSeen.add(`${x}-${y}`);
      maxHeight = tree;
    }
  }
}
// check by top and bottom
for (let x = 0; x < data_x_y.length; x++) {
  const trees_x = data_x_y[x];

  // top
  let maxHeight = -1;
  for (let y = 0; y < trees_x.length; y++) {
    const tree = trees_x[y];
    if (tree > maxHeight) {
      treeSeen.add(`${x}-${y}`);
      maxHeight = tree;
    }
  }

  // bottom
  maxHeight = -1
  for (let y = trees_x.length - 1; y >= 0; y--) {
    const tree = trees_x[y];
    if (tree > maxHeight) {
      treeSeen.add(`${x}-${y}`);
      maxHeight = tree;
    }
  }
}

// OK  1693
console.log(treeSeen.size);

/*
 * Walker approch
 * On each tree, check if we can see the outside of the forest
 *
 * Not functional, I have bug counting somewhere
 */

let treeVisibleFromOutside = 0;

// top left higher memoization
const topHigherTree = Array(data_x_y.length).fill(-1); // index column by x
const leftHigherTrees = Array(data_y_x.length).fill(-1); // index column by y

for (const [y, trees] of data_y_x.entries()) {
  for (const [x, tree] of trees.entries()) {
    // check from higher memory
    const isHigherLeft = tree > leftHigherTrees[y];
    const isHigherTop = tree > topHigherTree[x];
    if (isHigherLeft) leftHigherTrees[y] = tree;
    if (isHigherTop) topHigherTree[x] = tree;
    if (isHigherLeft || isHigherTop) {
      treeVisibleFromOutside++;
      continue;
    }

    // iterate on rest of the trees to check
    const rightTrees = trees.slice(-x);
    const bottomTrees = data_x_y[x].slice(-x);

    const isVisibleFromRight = rightTrees.every(rt => tree > rt);
    if (isVisibleFromRight) {
      treeVisibleFromOutside++;
      continue;
    }

    const isVisibleFromBottom = bottomTrees.every(bt => tree > bt);
    if (isVisibleFromBottom) treeVisibleFromOutside++;
  }
}

// NOT 1399
console.log(treeVisibleFromOutside)