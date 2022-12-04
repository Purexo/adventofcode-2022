import {
  chunkify,
  drop,
  every,
  filter,
  find, findMap,
  flat,
  flatMap,
  forEach,
  indexed,
  map,
  reduce,
  some,
  take,
  toArray
} from "../itertools/index.js";

export const polyfill_sync = Object.freeze({
  // consume and produce
  map(mapFn) {return map(this, mapFn)},
  filter(filterFn) {return filter(this, filterFn)},
  take(limit) {return take(this, limit)},
  drop(limit) {return drop(this, limit)},
  indexed(start) {return indexed(this, start)},
  flat(max_depth) {return flat(this, max_depth)},
  flatMap(mapFn, max_depth) {return flatMap(this, mapFn, max_depth)},
  
  // consume only
  reduce(reduceFn, acc) {return reduce(this, reduceFn, acc)},
  toArray() {return toArray(this)},
  forEach(forEachFn) {return forEach(this, forEachFn)},
  some(someFn) {return some(this, someFn)},
  every(everyFn) {return every(this, everyFn)},
  find(findFn) {return find(this, findFn)},
  
  // iterable
  [Symbol.iterator]() {
    return this;
  },
  
  // extra
  chunkify(size) {return chunkify(this, size)},
  findMap(findMapFn) {return findMap(this, findMapFn)},
});
