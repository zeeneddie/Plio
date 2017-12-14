import { createSelector } from 'reselect';

import { getStandardTypes } from '../standardTypes';
import { createUncategorizedType } from '../../../../ui/react/standards/helpers';
import { lenses, withUncategorized } from '../../../util';

const getRisks = (_, { risks }) => risks;

// selector(risks: Array, types: Array) => Array
const selector = (risks, types) => withUncategorized(
  lenses.typeId,
  lenses.risks,
  createUncategorizedType({ risks, types }),
  risks,
  types,
);

export default createSelector([
  getRisks,
  getStandardTypes,
], selector);
