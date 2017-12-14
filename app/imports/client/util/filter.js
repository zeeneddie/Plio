import { ifElse, equals, compose, filter, nthArg, complement } from 'ramda';

import { isDeleted } from './object-relation';

// (filterDeleted: Boolean, items: Array) => Array
export const filterByDeleted = ifElse(
  equals(true),
  compose(filter(isDeleted), nthArg(1)),
  compose(filter(complement(isDeleted)), nthArg(1)),
);
