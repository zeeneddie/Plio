import { createSelector } from 'reselect';

import { getStandardsFiltered } from './state';
import getFilteredStandards from './getFilteredStandards';
import { getSearchText } from '../global';

const selector = (standards, standardsFiltered, searchText) => ({
  standards,
  standardsFiltered,
  searchText,
});

export default createSelector([
  getFilteredStandards,
  getStandardsFiltered,
  getSearchText,
], selector);
