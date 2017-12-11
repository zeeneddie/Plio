import { createSelector } from 'reselect';
import { ifElse, filter, equals, propSatisfies, complement } from 'ramda';

import { getStandards } from './state';
import { getFilter } from '../global';
import { STANDARD_FILTER_MAP } from '../../../../api/constants';

const deleted = propSatisfies(equals(true), 'isDeleted');

const selector = ifElse(
  equals(STANDARD_FILTER_MAP.DELETED),
  filter(deleted),
  filter(complement(deleted)),
);

export default createSelector([getFilter, getStandards], selector);
