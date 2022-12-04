/// --- producer only ---

/**
 *
 * @param {number} [i=0]
 * @return {Generator<number, never, never>}
 */
export function* naturals(i = 0) {
  while (true) yield i++;
}

/**
 * Think of it as a classic for
 * for (let i = start; i < end; i++)
 *
 * @param {number} start - inclusive
 * @param {number} end - exclusive
 * @param {number} [step=1]
 * @returns {Generator<number, void, void>} - iterable through [start..end[ by step
 */
export function* range(start, end, step = 1) {
  step = Math.abs(step);
  [start, end] = [start, end].sort((a, b) => a - b);
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

/**
 * @param {number} start - inclusive
 * @param {number} end - exclusive
 * @param {number} [step=1]
 * @returns {Generator<number, void, void>} - iterable through [start..end[ by step
 */
export function* rangeReverse(start, end, step = 1) {
  step = Math.abs(step);
  [end, start] = [start, end].sort((a, b) => a - b);
  for (let i = start; i > end; i -= step) {
    yield i;
  }
}

/// --- consumer-producer ---

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
 * @param {Iterable<T>} iterable
 * @param {mapFn<T, R>} mapFn
 * @returns {Generator<R, never, never>}
 */
export function* map(iterable, mapFn) {
  for (const item of iterable) {
    yield mapFn(item);
  }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {mapFn<T, boolean>} filterFn
 * @return {Generator<T, never, never>}
 */
export function* filter(iterable, filterFn) {
  for (const item of iterable) {
    if (filterFn(item)) yield item;
  }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} limit
 * @return {Generator<T, never, never>}
 */
export function* take(iterable, limit) {
  let i = 0;
  for (const item of iterable) {
    if (i++ >= limit) break;
    yield item;
  }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} limit
 * @return {Generator<T, never, never>}
 */
export function* drop(iterable, limit) {
  let i = 0;
  for (const item of iterable) {
    if (i++ < limit) continue;
    yield item;
  }
}

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} i - increment start
 * @return {Generator<T, never, never>}
 */
export function* indexed(iterable, i = 0) {
  for (const item of iterable) {
    yield [i++, item];
  }
}

/**
 *
 * @template T
 * @template {T|Iterable<T>} RT<T>
 * @param {Iterable<RT>} iterable
 * @param {number} [max_depth=1]
 * @param {number} [depth=0] - private arg
 * @return {Generator<T, never, never>}
 */
export function* flat(iterable, max_depth = 1, depth = 0) {
  for (const item of iterable) {
    if (depth < max_depth && item[Symbol.iterator]) yield * flat(item, max_depth, depth + 1);
    else yield item;
  }
}

/// --- consumer-only

/**
 *
 * @template T
 * @template R
 * @template {T|Iterable<T>} RT<T>
 * @param {Iterable<RT>} iterable
 * @param {mapFn<T, R>} mapFn
 * @param {number} [max_depth=1]
 * @param {number} [depth=0] - private arg
 * @return {Generator<R, never, never>}
 */
export function* flatMap(iterable, mapFn, max_depth = 1, depth = 0) {
  for (const item of iterable) {
    if (depth < max_depth && item[Symbol.iterator]) yield * flatMap(item, mapFn, max_depth, depth + 1);
    else yield mapFn(item);
  }
}

/**
 * @callback reduceFn
 * @template R
 * @template T
 * @param {R} previous
 * @param {T} current
 * @return {R}
 */

/**
 * @template T
 * @template R
 * @param {Iterable<T>} iterable
 * @param {reduceFn<R, T>} reduceFn
 * @param {R} [init=0]
 * @return {R}
 */
export function reduce(iterable, reduceFn, init= 0) {
  for (const item of iterable) {
    init = reduceFn(init, item);
  }
  
  return init;
}

/**
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @return {T[]}
 */
export function toArray(iterable) {
  const result = [];
  
  for (const item of iterable) {
    result.push(result);
  }
  
  return result;
}

/**
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @param {mapFn<T, void>} forEachFn
 * @return {void}
 */
export function forEach(iterable, forEachFn) {
  for (const item of iterable) {
    forEachFn(item);
  }
}

/**
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @param {mapFn<T, boolean>} someFn
 * @return {boolean}
 */
export function some(iterable, someFn) {
  for (const item of iterable) {
    if (someFn(item)) return true;
  }
  
  return false;
}

/**
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @param {mapFn<T, boolean>} everyFn
 * @return {boolean}
 */
export function every(iterable, everyFn) {
  for (const item of iterable) {
    if (!everyFn(item)) return false;
  }
}

/**
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @param {mapFn<T, boolean>} findFn
 * @return {T | undefined}
 */
export function find(iterable, findFn) {
  for (const item of iterable) {
    if (findFn(item)) return item;
  }
}

/// --- extra ---

/**
 * @template T
 * @param {Iterable<T>} iterable
 * @param {number} size
 * @return {Generator<T[], never, never>}
 */
export function* chunkify(iterable, size = 3) {
  let chunk, i;
  
  function resetChunk() {
    chunk = Array(size);
    i = 0;
  }
  
  resetChunk();
  for (const item of iterable) {
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
 * @param {Iterable<T>} iterable
 * @param {mapFn<T, R | undefined>} transform value = transform(item)
 * @returns {R} value if truthy
 */
export function findMap(iterable, transform) {
  for (const item of iterable) {
    const value = transform(item);
    
    if (value) return value;
  }
}
