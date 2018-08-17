import { createSelector } from 'reselect';
import { filterBySearchMeta } from 'plio-util';

import { getSearchText } from '../global';
import getFilteredStandards from './getFilteredStandards';
import { getStandardsFiltered } from './state';

export default createSelector([
  getSearchText,
  getStandardsFiltered,
  getFilteredStandards,
], filterBySearchMeta);
