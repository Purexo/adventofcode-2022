import {open} from 'node:fs/promises';

const fh = await open(new URL('../fixtures/02.txt', import.meta.url));

const ENCODED_DECODED = {
  // The first column is what your opponent is going to play: A for Rock, B for Paper, and C for Scissors
  A: 'Rock',
  B: 'Paper',
  C: 'Scissors',

  X: 'Rock', // you should choose Rock (X)
  Y: 'Paper', // you should choose Paper (Y)
  Z: 'Scissors', // C Z | both players choosing Scissors
};

// STRATEGY_SCORE[opponent_shape][my_shape]: score
// The score for a single round is the score for the shape you selected plus the score for the outcome of the round
// my_outcome :
//  Lost: 0
//  Draw: 3
//  Won: 6
// shape :
//  Rock: 1
//  Paper: 2
//  Scissors: 3
const STRATEGY_SCORE = {
  Rock: {
    Rock: 1 + 3, // Draw
    Paper: 2 + 6, // Won
    Scissors: 0 + 3, // Lose
  },
  Paper: {
    Rock: 1 + 0, // Lose
    Paper: 2 + 3, // Draw
    Scissors: 3 + 6, // Win
  },
  Scissors: {
    Rock: 1 + 6, // Win
    Paper: 2 + 0, // Lose
    Scissors: 3 + 3, // Draw
  },
}

let score = 0;
for await (let line of fh.readLines()) {
  const [opponent_encoded, me_encoded] = line.split(' ');

  const opponent = ENCODED_DECODED[opponent_encoded];
  const me = ENCODED_DECODED[me_encoded];

  score += STRATEGY_SCORE[opponent][me];
}

// 8890
console.log(score);
