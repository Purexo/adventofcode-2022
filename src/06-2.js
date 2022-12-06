import {createReadStream} from "node:fs";
const chars = createReadStream(new URL('../fixtures/06.txt', import.meta.url), {highWaterMark: 1, encoding: 'utf8'});
// const chars = 'mjqjpqmgbljsphdztnvjfqwrcgsmlb' // 19

const last14Chars = [];
let i = 0
for await (const char of chars) {
  const index = last14Chars.indexOf(char);

  last14Chars.splice(0, index + 1);
  last14Chars.push(char);

  i++;
  if (last14Chars.length === 14) break;
}

// 1909
console.log(i);