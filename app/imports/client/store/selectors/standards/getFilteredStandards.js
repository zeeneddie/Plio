import { createSelector } from 'reselect';
import { compose, ifElse, filter, equals, propSatisfies, complement, nthArg } from 'ramda';

import { getStandards } from './state';
import getIsDeletedFilter from './getIsDeletedFilter';

const deleted = propSatisfies(equals(true), 'isDeleted');

const selector = ifElse(
  equals(true),
  compose(filter(deleted), nthArg(1)),
  compose(filter(complement(deleted)), nthArg(1)),
);

export default createSelector([getIsDeletedFilter, getStandards], selector);
