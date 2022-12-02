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

// 1 for Rock, 2 for Paper, and 3 for Scissors
const SHAPE_SCORE = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
};

// 0 if you lost, 3 if the round was a draw, and 6 if you won
const OUTCOME_SCORE = {
  Lost: 0,
  Draw: 3,
  Won: 6,
}

const IS_WIN = {
  Rock(opponent) {
    return opponent === 'Scissors';
  },
  Paper(opponent) {
    return opponent === 'Rock';
  },
  Scissors(opponent) {
    return opponent === 'Paper';
  },
}

// The score for a single round is the score for the shape you selected plus the score for the outcome of the round
function getRoundScore(me, opponent) {
  const shape_score = SHAPE_SCORE[me];

  if (me === opponent) return shape_score + OUTCOME_SCORE.Draw;

  return shape_score
    + Number(IS_WIN[me](opponent)) * OUTCOME_SCORE.Won // Number(true) = 1, Number(false) = 0
}

let score = 0;
for await (let line of fh.readLines()) {
  const [opponent_encoded, me_encoded] = line.split(' ');

  score += getRoundScore(ENCODED_DECODED[me_encoded], ENCODED_DECODED[opponent_encoded]);
}

console.log(score);
