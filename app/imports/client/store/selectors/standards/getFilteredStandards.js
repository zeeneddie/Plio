import { createSelector } from 'reselect';
import { compose, ifElse, filter, equals, propSatisfies, complement, nthArg } from 'ramda';

import { getStandards } from './state';
import { getFilter } from '../global';
import { STANDARD_FILTER_MAP } from '../../../../api/constants';

const deleted = propSatisfies(equals(true), 'isDeleted');

const selector = ifElse(
  equals(STANDARD_FILTER_MAP.DELETED),
  compose(filter(deleted), nthArg(1)),
  compose(filter(complement(deleted)), nthArg(1)),
);

export default createSelector([getFilter, getStandards], selector);
