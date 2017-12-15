import { set, filter, compose, append, map, curry, length, view } from 'ramda';


/*
pred(item: Object) => Boolean

(
  pred: pred,
  innerLens: Lens,
  outerLens: Lens,
  innerItems: Array
) => (item: Object) => Object
*/
export const setFilteredItems = (pred, innerLens, outerLens, innerItems) => item => set(
  outerLens,
  filter(pred(item), innerItems),
  item,
);

/*
(
  pred: pred,
  innerLens: Lens,
  outerLens: Lens,
  uncategorized: Object,
  innerItems: Array,
  outerItems: Array
) => Array
*/
export default curry((pred, innerLens, outerLens, uncategorized, innerItems, outerItems) => compose(
  filter(compose(length, view(outerLens))),
  append(uncategorized),
  map(setFilteredItems(pred, innerLens, outerLens, innerItems)),
)(outerItems));
