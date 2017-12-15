import { set, filter, compose, append, map, curry, length, view } from 'ramda';

/*
(
  pred: (item: Object, itemsA: Array) => Boolean,
  lensA: Lens,
  lensB: Lens,
  itemsA: Array
) => (item: Object) => Object
*/
export const setFilteredItems = (pred, lensA, lensB, itemsA) => item => set(
  lensB,
  filter(pred(item, itemsA), itemsA),
  item,
);

// (lensA: Lens, lensB: Lens, uncategorized: Object, itemsA: Array, itemsB: Array) => Array
export default curry((pred, lensA, lensB, uncategorized, itemsA, itemsB) => compose(
  filter(compose(length, view(lensB))),
  append(uncategorized),
  map(setFilteredItems(pred, lensA, lensB, itemsA)),
)(itemsB));
