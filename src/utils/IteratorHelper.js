// these methods produce new iterators, so we need to override them to extend their iterator result
import {drop, filter, flat, flatMap, forEach, indexed, map, reduce, take, toArray} from "./itertools.js";

const method_to_override = new Set(['map', 'filter', 'take', 'drop', 'indexed', 'flatMap']);

const polyfill = {
  map(mapFn) {return map(this, mapFn)},
  filter(filterFn) {return filter(this, filterFn)},
  take(limit) {return take(this, limit)},
  drop(limit) {return drop(this, limit)},
  indexed(start) {return indexed(this, start)},
  flat(max_depth) {return flat(this, max_depth)},
  flatMap(mapFn, max_depth) {return flatMap(this, mapFn, max_depth)},
  reduce(reduceFn, acc) {return reduce(this, reduceFn, acc)},
  toArray() {return toArray(this)},
  forEach(forEachFn) {return forEach(this, forEachFn)},
  [Symbol.iterator]() {
    return this;
  },
}

/**
 * @template T
 * @param {Iterator<T>} iterator
 * @param {object} methods - an object of methods
 * @param {Iterable<string>} chainableMethods - list of chainable method
 * @return {IterableIterator<T>} return the iterator enrich with helpers from methods
 * @example
 * ```js
 * function* naturals(i = 0) {
 *   while (true) yield i++;
 * }
 *
 * ExtendIterator(naturals(), {
 *   tap: function* tap(tapFn) {
 *     for (const item of this) {
 *       tapFn(item);
 *       yield item;
 *     }
 *   },
 *   chunkify: function* chunkify(size=3) {
 *     let chunk, i;
 *
 *     function resetChunk() {
 *       chunk = Array(size);
 *       i = 0;
 *     }
 *
 *     resetChunk();
 *     for (const item of iterator) {
 *       chunk[i++] = item;
 *
 *       if (i === size) {
 *         yield chunk;
 *         resetChunk();
 *       }
 *     }
 *
 *     if (i > 0) {
 *       yield chunk;
 *     }
 *   },
 *   findMap(findFn) {
 *     for (const item of this) {
 *       const value = findFn(item);
 *       if (value) return value;
 *     }
 *   },
 * })
 *  .filter(n => n % 2)
 *  .chunkify(10)
 *  .map(chunk => chunk.reduce((r, n) => r * n, 1))
 *  .tap(console.log)
 *  .drop(100)
 *  .take(100)
 *  .map(v => [v, v / 2, v / 4, v / 8])
 *  .findMap(([v1, v2, v3, v4])) => {
 *    if (v1 % 5641) return v1
 *    if (v2 % 8943) return v2
 *    if (v3 % 1368) return v3
 *    if (v4 % 4535) return v4
 *  })
 * ```
 */
export function ExtendIterator(iterator, methods, chainableMethods) {
  // get prototype of iterator
  const origin_prototype = Object.getPrototypeOf(iterator);
  
  // prepare new prototype
  const new_prototype = {...polyfill};
  
  // override methods so their iterator result is also extended
  for (const method_name of method_to_override) {
    new_prototype[method_name] = function () {
      const inner_it = origin_prototype[method_name].apply(iterator, arguments);
      return ExtendIterator(inner_it, methods, chainableMethods);
    };
  }
  
  // add methods in new prototype
  chainableMethods = chainableMethods instanceof Set ? chainableMethods : new Set(chainableMethods);
  for (const method_name of Object.keys(methods)) {
    new_prototype[method_name] = chainableMethods.has(method_name)
      ? function () {
        const inner_it = methods[method_name].apply(iterator, arguments);
        return ExtendIterator(inner_it, methods, chainableMethods);
      }
      : methods[method_name];
  }
  
  // put new_prototype in prototype chain between the iterator and his origin prototype
  // before : iterator -> origin_prototype
  // after  : iterator -> new_prototype -> origin_prototype
  Object.setPrototypeOf(new_prototype, origin_prototype);
  Object.setPrototypeOf(iterator, new_prototype);
  
  return iterator;
}

