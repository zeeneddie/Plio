import { createSelector } from 'reselect';
import { when, complement, isEmpty, contains, filter } from 'ramda';

import { getSearchText } from '../global';
import getFilteredStandards from './getFilteredStandards';
import { getStandardsFiltered } from './state';

const selector = (searchText, searchedIds, standards) => when(
  complement(isEmpty),
  () => filter(({ _id }) => contains(_id, searchedIds), standards),
)(searchText);

export default createSelector([
  getSearchText,
  getStandardsFiltered,
  getFilteredStandards,
], selector);
