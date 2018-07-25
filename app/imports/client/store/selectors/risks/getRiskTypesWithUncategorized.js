import { createSelector } from 'reselect';
import { lenses, lensEqById, withUncategorized } from 'plio-util';

import { getRiskTypes } from '../riskTypes';
import { createUncategorizedType } from '../../../../ui/react/risks/helpers';

const getRisks = (_, { risks }) => risks;

// selector(risks: Array, types: Array) => Array
const selector = (risks, types) => withUncategorized(
  // (lens: Lens) => (type: Object) => (risk: Object) => Boolean
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
