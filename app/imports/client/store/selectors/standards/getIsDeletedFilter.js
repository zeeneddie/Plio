import { createSelector } from 'reselect';
import { equals } from 'ramda';

import { STANDARD_FILTER_MAP } from '../../../../api/constants';
import { getFilter } from '../global';

export default createSelector(getFilter, equals(STANDARD_FILTER_MAP.DELETED));
