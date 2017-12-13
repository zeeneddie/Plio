import { createSelector } from 'reselect';

import { getSelectedStandardIsDeleted } from './state';
import { getStandardTypes } from '../standardTypes';
import { createUncategorizedType } from '../../../../ui/react/standards/helpers';
import { withUncategorized } from './util';

const getStandards = (_, { standards }) => standards;

/*
selector(
  standards: Array,
  standardTypes: Array,
  isSelectedStandardDeleted: Boolean
)
*/
const selector = (standards, standardTypes, isSelectedStandardDeleted) => {
  const uncategorized = createUncategorizedType({ standards, types: standardTypes });
  const types = withUncategorized('typeId', uncategorized, standards, standardTypes);

  return {
    types,
    standardTypes,
    isSelectedStandardDeleted,
  };
};

export default createSelector([
  getStandards,
  getStandardTypes,
  getSelectedStandardIsDeleted,
], selector);
