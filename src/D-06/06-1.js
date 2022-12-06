import {createReadStream} from "node:fs";
const chars = createReadStream(new URL('./input.txt', import.meta.url), {highWaterMark: 1, encoding: 'utf8'});

const last4Chars = [];
let i = 0
for await (const char of chars) {
  const index = last4Chars.indexOf(char);

  last4Chars.splice(0, index + 1);
  last4Chars.push(char);

  i++;
  if (last4Chars.length === 4) break;
}

// 1909
console.log(i);