import { createSelector } from 'reselect';
import { filterByDeleted } from 'plio-util';

import { getRisks } from './state';
import getIsDeletedFilter from './getIsDeletedFilter';

export default createSelector([getIsDeletedFilter, getRisks], filterByDeleted);
