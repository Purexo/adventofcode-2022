/**
 * @template T
 * @param {Iterable<T> & {length: number}} indexedIterable
 * @return {Generator<*[], void, *>}
 */
export function* iterateInTwoWindow(indexedIterable) {
  let i2 = indexedIterable.length / 2;
  
  for (const c of indexedIterable) {
    yield [c, indexedIterable[i2++]];
  }
}
export const piterateInTwoWindow = indexedIterable => iterateInTwoWindow(indexedIterable);
