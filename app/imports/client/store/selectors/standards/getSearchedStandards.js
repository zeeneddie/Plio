import { createSelector } from 'reselect';

import { getSearchText } from '../global';
import getFilteredStandards from './getFilteredStandards';
import { getStandardsFiltered } from './state';
import { filterBySearchMeta } from '../../../util';

export default createSelector([
  getSearchText,
  getStandardsFiltered,
  getFilteredStandards,
], filterBySearchMeta);
