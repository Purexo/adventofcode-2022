import {open} from 'node:fs/promises';

const fh = await open(new URL('../fixtures/02.txt', import.meta.url));

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

// STRATEGY_PLAY[opponent][my_outcome]: Shape
const STRATEGY_PLAY = {
  Rock: {
    Lost: 'Scissors',
    Draw: 'Rock',
    Won: 'Paper',
  },
  Paper: {
    Lost: 'Rock',
    Draw: 'Paper',
    Won: 'Scissors',
  },
  Scissors: {
    Lost: 'Paper',
    Draw: 'Scissors',
    Won: 'Rock',
  },
}

let score = 0;
for await (let line of fh.readLines()) {
  const [opponent_encoded, outcome_encoded] = line.split(' ');

  const opponent = ENCODED_DECODED_OPPONENT[opponent_encoded];
  const outcome = ENCODED_DECODED_OUTCOME[outcome_encoded];
  const me = STRATEGY_PLAY[opponent][outcome]

  score += getRoundScore(me, opponent);
}

// 10238
console.log(score);
