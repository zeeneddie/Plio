import { createSelector } from 'reselect';

import getSortedStandardsByFilter from './getSortedStandardsByFilter';
import getFilteredStandards from './getFilteredStandards';
import { getIsModalOpened } from '../dataImport';
import { getOrganizationId } from '../organizations';
import {
  getSearchText,
  getFilter,
  getAnimating,
  getUrlItemId,
  getUserId,
} from '../global';
import getSearchMatchText from '../../../../api/helpers/getSearchMatchText';

/*
selector(
  standards: Array,
  filteredStandards: Array,
  isModalOpened: Boolean,
  organizationId: String,
  searchText: String,
  filter: Number,
  animating: Boolean,
  urlItemId: String,
  userId: String
) => Object
*/

const selector = (
  standards,
  filteredStandards,
  isModalOpened,
  organizationId,
  searchText,
  filter,
  animating,
  urlItemId,
  userId,
) => ({
  standards,
  filteredStandards,
  organizationId,
  searchText,
  filter,
  animating,
  urlItemId,
  userId,
  isDataImportModalOpened: isModalOpened,
  searchResultsText: getSearchMatchText(searchText, standards.length),
});

export default createSelector([
  getSortedStandardsByFilter,
  getFilteredStandards,
  getIsModalOpened,
  getOrganizationId,
  getSearchText,
  getFilter,
  getAnimating,
  getUrlItemId,
  getUserId,
], selector);
