import { createSelector } from 'reselect';
import { lenses, lensEqById, withUncategorized } from 'plio-util';

import { getStandardTypes } from '../standardTypes';
import { createUncategorizedType } from '../../../../ui/react/standards/helpers';
import { getStandardsFromProps } from './state';

// selector(standards: Array, types: Array) => Array
const selector = (standards, types) => withUncategorized(
  // (lens: Lens) => (type: Object) => (standard: Object) => Boolean
  lensEqById(lenses.typeId),
  lenses.typeId,
  lenses.standards,
  createUncategorizedType({ standards, types }),
  standards,
  types,
);

export default createSelector([
  getStandardsFromProps,
  getStandardTypes,
], selector);
