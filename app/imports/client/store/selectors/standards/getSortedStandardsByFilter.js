import { createSelector } from 'reselect';
import { ifElse, equals, sortBy, descend, compose, nthArg, view } from 'ramda';

import getSearchedStandards from './getSearchedStandards';
import getIsDeletedFilter from './getIsDeletedFilter';
import lenses from '../lenses';
import sortByTitlePrefix from '../../../../api/helpers/sortByTitlePrefix';

const byDeleted = descend(view(lenses.deletedAt));

// selector(isDeletedFilter: Boolean, standards: Array) => Array
const selector = ifElse(
  equals(true),
  compose(sortBy(byDeleted), nthArg(1)),
  compose(sortByTitlePrefix, nthArg(1)),
);

export default createSelector([getIsDeletedFilter, getSearchedStandards], selector);
