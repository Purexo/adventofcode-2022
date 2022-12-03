/**
 * @template T
 * @typedef {AsyncIterator<T> | AsyncIterable<T>} AsyncConsommable<T>
 */

/**
 * @template T
 * @param {AsyncConsommable<T>} iterator
 * @param {number} size
 * @return {AsyncGenerator<T[], never, never>}
 */
export async function* achunkify(iterator, size = 3) {
  let chunk, i;
  
  function resetChunk() {
    chunk = Array(size);
    i = 0;
  }
  
  resetChunk();
  for await (const item of iterator) {
    chunk[i++] = item;
    
    if (i === size) {
      yield chunk;
      resetChunk();
    }
  }
  
  if (i > 0) {
    yield chunk;
  }
}
export const pachunkify = size => iterator => achunkify(iterator, size);

/**
 * @template T, R
 * @param {AsyncConsommable<T>} iterator
 * @param {mapFn<T, R>} mapFn
 * @return {AsyncGenerator<R, never, never>}
 */
export async function* amap(iterator, mapFn) {
  for await (const item of iterator) {
    yield mapFn(item)
  }
}
export const pamap = mapFn => iterator => amap(iterator, mapFn);

/**
 * @callback reduceFn
 * @template T
 * @template R
 * @param {R} previousValue
 * @param {T} currentValue
 * @return {R}
 */

/**
 * @template T, R
 * @param {AsyncConsommable<T>} iterator
 * @param {reduceFn} reduceFn
 * @param {R=number} [init=0]
 * @return {Promise<R>}
 */
export async function areduce(iterator, reduceFn, init = 0) {
  let previousValue = init;

  for await (const currentValue of iterator) {
    previousValue = reduceFn(previousValue, currentValue);
  }
  
  return previousValue;
}
export const pareduce = (reduceFn, init) => iterator => areduce(iterator, reduceFn, init);
