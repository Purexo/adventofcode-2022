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

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export function sum(a, b) {
  return a + b;
}


