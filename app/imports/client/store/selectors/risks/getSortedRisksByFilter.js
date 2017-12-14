import { createSelector } from 'reselect';
import { reverse, sort } from 'ramda';

import { getRisks } from './state';
import getIsDeletedFilter from './getIsDeletedFilter';
import { getSearchText } from '../global';
import sortByTitlePrefix from '../../../../api/helpers/sortByTitlePrefix';
import { bySequentialId, byDeletedAt } from '../../../util';

const selector = (searchText, isDeletedFilter, inputRisks) => {
  const by = searchText ? bySequentialId : byDeletedAt;
  let risks = inputRisks;

  // NANI???
  if (!isDeletedFilter) {
    if (!searchText) {
      risks = sortByTitlePrefix(risks);
    } else risks = sort(by, risks);
  } else {
    risks = sort(by, risks);
    if (!searchText) risks = reverse(risks);
  }

  return risks;
};

export default createSelector([getSearchText, getIsDeletedFilter, getRisks], selector);
