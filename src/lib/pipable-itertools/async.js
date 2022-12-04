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
} from "../itertools/async.js";

export const pamap = mapFn => iterable => map(iterable, mapFn);
export const pafilter = filterFn => iterable => filter(iterable, filterFn);
export const patake = limit => iterable => take(iterable, limit);
export const padrop = limit => iterable => drop(iterable, limit);
export const paindexed = start => iterable => indexed(iterable, start);
export const paflat = max_depth => iterable => flat(iterable, max_depth);
export const paflatMap = (mapFn, max_depth) => iterable => flatMap(iterable, mapFn, max_depth);
export const pareduce = (reduceFn, init) => iterable => reduce(iterable, reduceFn, init);
export const paforEach = forEachFn => iterable => forEach(iterable, forEachFn);
export const paevery = everyFn => iterable => every(iterable, everyFn);
export const pafind = findFn => iterable => every(iterable, findFn);

export const pachunkify = size => iterable => chunkify(iterable, size);
export const pafindMap = transform => iterator => findMap(iterator, transform);
