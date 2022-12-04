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
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

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
  for (const item of iterator) {
    yield mapFn(item);
  }
}
export const pmap = mapFn => iterable => map(iterable, mapFn);

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
export const pfilter = filterFn => iterable => filter(iterable, filterFn);

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
export const ptake = limit => iterable => take(iterable, limit);

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
export const pdrop = limit => iterable => drop(iterable, limit);

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
export const pindexed = start => iterable => indexed(iterable, start);

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
export const pflat = max_depth => iterable => flat(iterable, max_depth);

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
export const pflatMap = (mapFn, max_depth) => iterable => flatMap(iterable, mapFn, max_depth);

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
export const preduce = (reduceFn, init) => iterable => reduce(iterable, reduceFn, init);

export const toArray = Array.from;

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
export const pforEach = forEachFn => iterable => forEach(iterable, forEachFn);

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
export function findTransform(iterable, transform) {
  for (const item of iterable) {
    const value = transform(item);
    
    if (value) return value;
  }
}
export const pfindTransform = transform => iterator => findTransform(iterator, transform);

export function* iterateInTwoWindow(str) {
  let i2 = str.length / 2;
  
  for (const c of str) {
    yield [c, str[i2++]];
  }
}
export const piterateInTwoWindow = str => iterateInTwoWindow(str);

/**
 * Improve lisibility by simulate pipeline operator instead fn nesting
 *
 * @template T
 * @template R
 * @param {T} value
 * @param {...[mapFn<T, any>, ...mapFn<any, any>, mapFn<any, R>] | mapFn<T, R>} functions
 * @return {R}
 *
 * @example
 * ```js
 * output = pipe(input, fnA, fnB, fnC) // think input | fnA | fnB | fnC in bash
 * // without this function we should use intermediate variable (lot of name to find for each transformation)
 * // or use nesting fn (unreadable with lot of nesting)
 * // fnC(fnB(fnA(v)))
 * ```
 */
export function pipe(value, ...functions) {
  return functions.reduce((previousValue, fn) => fn(previousValue), value);
}

export function sum(a, b) {
  return a + b;
}
