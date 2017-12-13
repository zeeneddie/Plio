import { createSelector } from 'reselect';
import { anyPass, view } from 'ramda';

import { getIsFullScreenMode, getIsCardReady, getUrlItemId, getSearchText } from '../global';
import { getStandardsByIds, getStandardsFiltered } from './state';
import getFilteredStandards from './getFilteredStandards';
import { lenses } from '../../../../client/util';

/*
  selector(
    standards: Array,
    standardsByIds: Object,
    standardsFiltered: Array,
    urlItemId: String,
    isCardReady: Boolean,
    isFullScreenMode: Boolean,
    searchText: String
  ) => Object
*/
const selector = (
  standards,
  standardsByIds,
  standardsFiltered,
  urlItemId,
  isCardReady,
  isFullScreenMode,
  searchText,
) => {
  const standard = standardsByIds[urlItemId];
  const isReady = !!(isCardReady && standards.length && standard);
  const hasDocxAttachment = anyPass([
    view(lenses.source1.htmlUrl),
    view(lenses.source2.htmlUrl),
  ])(standard);

  return {
    standard,
    isReady,
    hasDocxAttachment,
    standards,
    standardsByIds,
    standardsFiltered,
    urlItemId,
    isCardReady,
    isFullScreenMode,
    searchText,
  };
};

export default createSelector([
  getFilteredStandards,
  getStandardsByIds,
  getStandardsFiltered,
  getUrlItemId,
  getIsCardReady,
  getIsFullScreenMode,
  getSearchText,
], selector);
