import { createSelector } from 'reselect';
import { filterByDeleted } from 'plio-util';

import { getStandards } from './state';
import getIsDeletedFilter from './getIsDeletedFilter';

export default createSelector([getIsDeletedFilter, getStandards], filterByDeleted);
