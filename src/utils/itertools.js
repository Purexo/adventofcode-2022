/**
 * @template T
 * @typedef {Iterator<T> | Iterable<T>} Consommable<T>
 */

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
 * @param {Consommable<T>} iterator
 * @param {mapFn<T, R>} mapFn
 * @returns {Generator<R, never, never>}
 */
export function* map(iterator, mapFn) {
  for (const item of iterator) {
    yield mapFn(item);
  }
}
export const pmap = mapFn => iterator => map(iterator, mapFn);

/**
 * Consume the iterator
 * for each item use transform callback
 * if his return is truthy return the value returned by transform callback
 * @template T
 * @template R
 * @param {Consommable<T>} iterator
 * @param {mapFn<T, R | undefined>} transform value = transform(item)
 * @returns {R} value if truthy
 */
export function findTransform(iterator, transform) {
  for (const item of iterator) {
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
