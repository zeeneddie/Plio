import { createSelector } from 'reselect';

import { getRiskTypes } from '../riskTypes';
import { createUncategorizedType } from '../../../../ui/react/risks/helpers';
import { lenses, lensEqById } from '../../../util';
import { withUncategorized } from '../../../util/plio';

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
