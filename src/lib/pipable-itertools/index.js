import {
  chunkify,
  drop,
  every,
  filter,
  findMap,
  flat,
  flatMap,
  forEach,
  indexed,
  map,
  reduce,
  take
} from "../itertools/index.js";

export const pmap = mapFn => iterable => map(iterable, mapFn);
export const pfilter = filterFn => iterable => filter(iterable, filterFn);
export const ptake = limit => iterable => take(iterable, limit);
export const pdrop = limit => iterable => drop(iterable, limit);
export const pindexed = start => iterable => indexed(iterable, start);
export const pflat = max_depth => iterable => flat(iterable, max_depth);
export const pflatMap = (mapFn, max_depth) => iterable => flatMap(iterable, mapFn, max_depth);
export const preduce = (reduceFn, init) => iterable => reduce(iterable, reduceFn, init);
export const pforEach = forEachFn => iterable => forEach(iterable, forEachFn);
export const pevery = everyFn => iterable => every(iterable, everyFn);
export const pfind = findFn => iterable => every(iterable, findFn);

export const pchunkify = size => iterable => chunkify(iterable, size);
export const pfindMap = transform => iterator => findMap(iterator, transform);
