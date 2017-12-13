import { createSelector } from 'reselect';

import { getStandardTypes } from '../standardTypes';
import { createUncategorizedType } from '../../../../ui/react/standards/helpers';
import { withUncategorized } from './util';
import { getStandardsFromProps } from './state';

// selector(standards: Array, types: Array) => Array
const selector = (standards, types) => withUncategorized(
  'typeId',
  createUncategorizedType({ standards, types }),
  standards,
  types,
);

export default createSelector([
  getStandardsFromProps,
  getStandardTypes,
], selector);
