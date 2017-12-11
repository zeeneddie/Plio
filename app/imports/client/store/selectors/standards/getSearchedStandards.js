import { createSelector } from 'reselect';
import { when, complement, isEmpty, contains, filter, __, where } from 'ramda';

import { getSearchText } from '../global';
import getFilteredStandards from './getFilteredStandards';
import { getStandardsFiltered } from './state';

const selector = (searchText, searchedIds, standards) => when(
  complement(isEmpty),
  () => filter(where({ _id: contains(__, searchedIds) }), standards),
)(searchText);

export default createSelector([
  getSearchText,
  getStandardsFiltered,
  getFilteredStandards,
], selector);
