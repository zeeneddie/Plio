import { createSelector } from 'reselect';

import { getRiskTypes } from '../riskTypes';
import { createUncategorizedType } from '../../../../ui/react/risks/helpers';
import { lenses, withUncategorized, lensEqById } from '../../../util';

const getRisks = (_, { risks }) => risks;

// selector(risks: Array, types: Array) => Array
const selector = (risks, types) => withUncategorized(
  lensEqById(lenses.typeId),
  lenses.typeId,
  lenses.risks,
  createUncategorizedType({ risks, types }),
  risks,
  types,
);

export default createSelector([
  getRisks,
  getRiskTypes,
], selector);
