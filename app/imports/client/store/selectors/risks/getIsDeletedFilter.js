import { createSelector } from 'reselect';
import { equals } from 'ramda';

import { RiskFilterIndexes } from '../../../../api/constants';
import { getFilter } from '../global';

export default createSelector(getFilter, equals(RiskFilterIndexes.DELETED));
