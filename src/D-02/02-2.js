import {open} from 'node:fs/promises';

const fh = await open(new URL('./input.txt', import.meta.url));

// The first column is what your opponent is going to play: A for Rock, B for Paper, and C for Scissors
const ENCODED_DECODED_OPPONENT = {
  A: 'Rock',
  B: 'Paper',
  C: 'Scissors',
};

// X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win
const ENCODED_DECODED_OUTCOME = {
  X: 'Lost',
  Y: 'Draw',
  Z: 'Won',
}

// STRATEGY_PLAY[opponent][my_outcome]: score
// The score for a single round is the score for the shape you selected plus the score for the outcome of the round
// my_outcome :
//  Lost: 0
//  Draw: 3
//  Won: 6
// shape :
//  Rock: 1
//  Paper: 2
//  Scissors: 3
const STRATEGY_PLAY = {
  Rock: {
    Lost: 0 + 3, // Scissors
    Draw: 3 + 1, // Rock
    Won: 6 + 2, // Paper
  },
  Paper: {
    Lost: 0 + 1, // Rock
    Draw: 3 + 2, // Paper
    Won: 6 + 3, // Scissors
  },
  Scissors: {
    Lost: 0 + 2, // Paper
    Draw: 3 + 3, // Scissors
    Won: 6 + 1, // Rock
  },
}

let score = 0;
for await (let line of fh.readLines()) {
  const [opponent_encoded, outcome_encoded] = line.split(' ');

  const opponent = ENCODED_DECODED_OPPONENT[opponent_encoded];
  const outcome = ENCODED_DECODED_OUTCOME[outcome_encoded];

  score += STRATEGY_PLAY[opponent][outcome];
}

// 10238
console.log(score);
