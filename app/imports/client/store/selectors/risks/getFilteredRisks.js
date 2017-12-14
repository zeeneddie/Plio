import { createSelector } from 'reselect';

import { getRisks } from './state';
import getIsDeletedFilter from './getIsDeletedFilter';
import { filterByDeleted } from '../../../util';

export default createSelector([getIsDeletedFilter, getRisks], filterByDeleted);
