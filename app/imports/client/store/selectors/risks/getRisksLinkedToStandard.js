import { createSelector } from 'reselect';
import { filter, where, contains } from 'ramda';

import { getRisks } from './state';

const getStandardId = (_, { standardId }) => standardId;

const selector = (standardId, risks) =>
  filter(where({ standardsIds: contains(standardId) }), risks);

export default createSelector([getStandardId, getRisks], selector);
