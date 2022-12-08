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
 * Walker approach
 * On each tree, check if we can see the outside of the forest
 */

/**
 * @type {Map<string, number>} - <x-y, score>
 */
const scores = new Map();
for (const [y, trees] of data_y_x.entries()) {
  for (const [x, tree] of trees.entries()) {

    // iterate on rest of the trees to check
    const topTrees = data_x_y[x].slice(0, y).reverse();
    const bottomTrees = data_x_y[x].slice(y+1);
    const leftTrees = trees.slice(0, x).reverse();
    const rightTrees = trees.slice(x+1);

    let tc = 0;
    for (const tt of topTrees) {
      tc++;
      if (tt >= tree) break; // view stoped by same or higher hight
    }

    let bc = 0;
    for (const tt of bottomTrees) {
      bc++;
      if (tt >= tree) break;
    }

    let lc = 0;
    for (const tt of leftTrees) {
      lc++;
      if (tt >= tree) break;
    }

    let rc = 0;
    for (const tt of rightTrees) {
      rc++;
      if (tt >= tree) break;
    }

    scores.set(`${x}-${y}`, tc * bc * lc * rc);
  }
}

let max = -Infinity;
for (const score of scores.values()) {
  if (score > max) max = score;
}

// 422059
console.log(max)