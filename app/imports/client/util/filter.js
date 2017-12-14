import {
  ifElse,
  equals,
  compose,
  filter,
  nthArg,
  complement,
  unless,
  isEmpty,
  where,
  contains,
  __,
  curry,
} from 'ramda';

import { isDeleted } from './object-relation';

// (filterDeleted: Boolean, items: Array) => Array
export const filterByDeleted = ifElse(
  equals(true),
  compose(filter(isDeleted), nthArg(1)),
  compose(filter(complement(isDeleted)), nthArg(1)),
);

/*
interface Item {
  _id: ID
}
findByIds(ids: [...ID], items: [...Item]) => Array
*/
export const findByIds = curry((ids, items) =>
  filter(where({ _id: contains(__, ids) }), items));

// (searchText: String, searchedIds: Array, items: Array) => Array
export const filterBySearchMeta = (searchText, searchedIds, items) => unless(
  () => isEmpty(searchText),
  findByIds(searchedIds),
  items,
);
