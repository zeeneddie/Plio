import { createSelector } from 'reselect';

import { getSearchText } from '../global';
import { getRisksFiltered, getRisks } from './state';
import { filterBySearchMeta } from '../../../util';

export default createSelector([
  getSearchText,
  getRisksFiltered,
  getRisks,
], filterBySearchMeta);
