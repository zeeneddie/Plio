import { createSelector } from 'reselect';

import { getStandards } from './state';
import getIsDeletedFilter from './getIsDeletedFilter';
import { filterByDeleted } from '../../../util';

export default createSelector([getIsDeletedFilter, getStandards], filterByDeleted);
