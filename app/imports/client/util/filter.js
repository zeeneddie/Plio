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
  reject,
} from 'ramda';

import { isDeleted } from './object-relation';

// (filterDeleted: Boolean, items: Array) => Array
export const filterByDeleted = ifElse(
  equals(true),
  compose(filter(isDeleted), nthArg(1)),
  compose(filter(complement(isDeleted)), nthArg(1)),
);

// rejectBy(prop: String, value: [...String|Number], items: [...Object]) => Array
export const rejectBy = curry((prop, values, items) =>
  reject(where({ [prop]: contains(__, values) }), items));

// findBy(prop: String, values: [...String|Number], items: [...Object]) => Array
export const filterBy = curry((prop, values, items) =>
  filter(where({ [prop]: contains(__, values) }), items));

/*
interface Item {
  _id: ID
}
findByIds(ids: [...ID], items: [...Item]) => Array
*/
export const findByIds = filterBy('_id');

// (searchText: String, searchedIds: Array, items: Array) => Array
export const filterBySearchMeta = (searchText, searchedIds, items) => unless(
  () => isEmpty(searchText),
  findByIds(searchedIds),
  items,
);
