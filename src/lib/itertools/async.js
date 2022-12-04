/**
 * @callback mapFn
 * @template T
 * @template R
 * @param {T} item
 * @return {R}
 */

/**
 * @template T
 * @template R
 * @param {AsyncIterable<T>} iterable
 * @param {mapFn<T, Promise<R>>} mapFn
 * @returns {AsyncGenerator<R, never, never>}
 */
export async function* map(iterable, mapFn) {
  for await (const item of iterable) {
    yield mapFn(item);
  }
}

/**
 * @template T
 * @param {AsyncIterable<T>} iterable
 * @param {mapFn<T, Promise<boolean>>} filterFn
 * @return {AsyncGenerator<T, never, never>}
 */
export async function* filter(iterable, filterFn) {
  for await (const item of iterable) {
    if (await filterFn(item)) yield item;
  }
}

/**
 * @template T
 * @param {AsyncIterable<T>} iterable
 * @param {number} limit
 * @return {AsyncGenerator<T, never, never>}
 */
export async function* take(iterable, limit) {
  let i = 0;
  for await (const item of iterable) {
    if (i++ >= limit) break;
    yield item;
  }
}

/**
 * @template T
 * @param {AsyncIterable<T>} iterable
 * @param {number} limit
 * @return {AsyncGenerator<T, never, never>}
 */
export async function* drop(iterable, limit) {
  let i = 0;
  for await (const item of iterable) {
    if (i++ < limit) continue;
    yield item;
  }
}

/**
 *
 * @template T
 * @param {AsyncIterable<T>} iterable
 * @param {number} i - increment start
 * @return {AsyncGenerator<T, never, never>}
 */
export async function* indexed(iterable, i = 0) {
  for await (const item of iterable) {
    yield [i++, item];
  }
}

/**
 *
 * @template T
 * @template {T|AsyncIterable<T>|Iterable<T>} RT<T>
 * @param {AsyncIterable<RT>} iterable
 * @param {number} [max_depth=1]
 * @param {number} [depth=0] - private arg
 * @return {AsyncGenerator<T, never, never>}
 */
export async function* flat(iterable, max_depth = 1, depth = 0) {
  for await (const item of iterable) {
    if (depth < max_depth && (item[Symbol.asyncIterator] || item[Symbol.iterator])) yield * flat(item, max_depth, depth + 1);
    else yield item;
  }
}

/// --- consumer-only

/**
 *
 * @template T
 * @template R
 * @template {T|AsyncIterable<T>|Iterable<T>} RT<T>
 * @param {AsyncIterable<RT>} iterable
 * @param {mapFn<T, Promise<R>>} mapFn
 * @param {number} [max_depth=1]
 * @param {number} [depth=0] - private arg
 * @return {AsyncGenerator<R, never, never>}
 */
export async function* flatMap(iterable, mapFn, max_depth = 1, depth = 0) {
  for await (const item of iterable) {
    if (depth < max_depth && (item[Symbol.asyncIterator] || item[Symbol.iterator])) yield * flatMap(item, mapFn, max_depth, depth + 1);
    else yield mapFn(item);
  }
}

/**
 * @callback reduceFnA
 * @template R
 * @template T
 * @param {R} previous
 * @param {T} current
 * @return {Promise<R>}
 */

/**
 * @template T
 * @template R
 * @param {AsyncIterable<T>} iterable
 * @param {reduceFnA<R, T>} reduceFn
 * @param {R} [init=0]
 * @return {Promise<R>}
 */
export async function reduce(iterable, reduceFn, init= 0) {
  for await (const item of iterable) {
    init = await reduceFn(init, item);
  }
  
  return init;
}

/**
 *
 * @template T
 * @param {AsyncIterable<T>} iterable
 * @return {Promise<T[]>}
 */
export async function toArray(iterable) {
  const result = [];
  
  for await (const item of iterable) {
    result.push(item);
  }
  
  return result;
}

/**
 *
 * @template T
 * @param {AsyncIterable<T>} iterable
 * @param {mapFn<T, Promise<void>>} forEachFn
 * @return {Promise<void>}
 */
export async function forEach(iterable, forEachFn) {
  for await (const item of iterable) {
    await forEachFn(item);
  }
}

/**
 *
 * @template T
 * @param {AsyncIterable<T>} iterable
 * @param {mapFn<T, Promise<boolean>>} someFn
 * @return {Promise<boolean>}
 */
export async function some(iterable, someFn) {
  for await (const item of iterable) {
    if (await someFn(item)) return true;
  }
  
  return false;
}

/**
 *
 * @template T
 * @param {AsyncIterable<T>} iterable
 * @param {mapFn<T, Promise<boolean>>} everyFn
 * @return {Promise<boolean>}
 */
export async function every(iterable, everyFn) {
  for await (const item of iterable) {
    if (!await everyFn(item)) return false;
  }
}

/**
 *
 * @template T
 * @param {AsyncIterable<T>} iterable
 * @param {mapFn<T, Promise<boolean>>} findFn
 * @return {Promise<T | undefined>}
 */
export async function find(iterable, findFn) {
  for await (const item of iterable) {
    if (await findFn(item)) return item;
  }
}

/// --- extra ---

/**
 * @template T
 * @param {AsyncIterable<T>} iterable
 * @param {number} size
 * @return {AsyncGenerator<T[], never, never>}
 */
export async function* chunkify(iterable, size = 3) {
  let chunk, i;
  
  function resetChunk() {
    chunk = Array(size);
    i = 0;
  }
  
  resetChunk();
  for await (const item of iterable) {
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

/**
 * Consume the iterator
 * for each item use transform callback
 * if his return is truthy return the value returned by transform callback
 * @template T
 * @template R
 * @param {AsyncIterable<T>} iterable
 * @param {mapFn<Promise<T>, Promise<R | undefined>>} transform value = transform(item)
 * @returns {Promise<R>} value if truthy
 */
export async function findMap(iterable, transform) {
  for await (const item of iterable) {
    const value = await transform(item);
    
    if (value) return value;
  }
}
