import fs from 'node:fs/promises';

const fh = await fs.open(new URL('./input.txt', import.meta.url));
const iterator = fh.readLines()[Symbol.asyncIterator]();

const monkeys = new Map();

/**
 * Monkey 0:
 *   Starting items: 73, 77
 *   Operation: new = old * 5
 *   Test: divisible by 11
 *     If true: throw to monkey 6
 *     If false: throw to monkey 5
 *
 * fine iteration on line to parse monkey by monkey
 */
while (true) {
  const identifierLine = await iterator.next();
  if (identifierLine.done) break;
  const id = Number(identifierLine.value.slice(7, -1));
  
  const itemsLine = await iterator.next();
  const items = itemsLine.value.slice(18).split(', ').map(Number);
  
  const operationLine = await iterator.next();
  const operationExpression = operationLine.value.slice(19);
  const operation = new Function('old', `return ${operationExpression};`)
  
  const testLine = await iterator.next();
  const testDivideNumber = testLine.value.slice(21)
  const test = divisibleBy(Number(testDivideNumber));
  
  const trueLine = await iterator.next();
  const ifTrueId = Number(trueLine.value.slice(29));
  
  const falseLine = await iterator.next();
  const ifFalseId = Number(falseLine.value.slice(30));
  
  monkeys.set(id, {
    // usable
    id, items, operation, test, ifTrueId, ifFalseId, inspectCount: 0,
    // debug
    operationExpression, testDivideNumber,
  })
  
  await iterator.next();
}

// 20 rounds
// each round monkeys in order inpect (exec operation) items fifo, worry divide by 3, and throw them depending test
// find 2 monkeys with the more items

for (let i = 0; i < 20; i++) {
  for (const monkey of monkeys.values()) {
    while (monkey.items.length) { // foreach fifo
      // take item fifo
      let item = monkey.items.shift();
      
      // inspect
      item = monkey.operation(item);
      monkey.inspectCount++;
      
      // bored
      item = Math.floor(item / 3);
      
      // throw
      const monkeyToThrowAt = monkey.test(item)
        ? monkeys.get(monkey.ifTrueId)
        : monkeys.get(monkey.ifFalseId);
      monkeyToThrowAt.items.push(item);
    }
  }
}

const monkeysInOrder = Array.from(monkeys.values()).sort((ma, mb) => ma.inspectCount - mb.inspectCount);
const [topa, topb] = monkeysInOrder.slice(-2);

// train expected 101 * 105 = 10605
console.log(topa.inspectCount * topb.inspectCount);

function divisibleBy(divide) {
  return value => value % divide === 0;
}
