import { createSelector } from 'reselect';

import { getSearchText } from '../global';
import { getStandardsFiltered } from './state';

// selector(searchText: String, standardsFiltered: [...ID])
const selector = (searchText, standardsFiltered) => ({
  searchText,
  standardsFiltered,
});

export default createSelector([getSearchText, getStandardsFiltered], selector);
