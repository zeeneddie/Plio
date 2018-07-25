import { createSelector } from 'reselect';
import { filterBySearchMeta } from 'plio-util';

import { getSearchText } from '../global';
import { getRisksFiltered, getRisks } from './state';

export default createSelector([
  getSearchText,
  getRisksFiltered,
  getRisks,
], filterBySearchMeta);
