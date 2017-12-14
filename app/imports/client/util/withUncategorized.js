import { set, filter, equals, compose, append, map, curry, length, view } from 'ramda';

// (lensA: Lens, lensB: Lens, itemsA: Array) => (item: Object) => Object
export const setFilteredItems = (lensA, lensB, itemsA) => item => set(
  lensB,
  filter(compose(equals(item._id), view(lensA)), itemsA),
  item,
);

// (lensA: Lens, lensB: Lens, uncategorized: Object, itemsA: Array, itemsB: Array) => Array
export default curry((lensA, lensB, uncategorized, itemsA, itemsB) => compose(
  filter(compose(length, view(lensB))),
  append(uncategorized),
  map(setFilteredItems(lensA, lensB, itemsA)),
)(itemsB));
