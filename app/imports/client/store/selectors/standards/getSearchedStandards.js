import { createSelector } from 'reselect';
import { unless, isEmpty, contains, filter, __, where } from 'ramda';

import { getSearchText } from '../global';
import getFilteredStandards from './getFilteredStandards';
import { getStandardsFiltered } from './state';

// selector(searchText: String, searchedIds: Array, standards: Array) => Array
const selector = (searchText, searchedIds, standards) => unless(
  () => isEmpty(searchText),
  filter(where({ _id: contains(__, searchedIds) })),
)(standards);

export default createSelector([
  getSearchText,
  getStandardsFiltered,
  getFilteredStandards,
], selector);
