import { createSelector } from 'reselect';

import { getStandards, getStandardsByIds, getStandardsFiltered } from './state';
import { getIsModalOpened } from '../dataImport';
import { getOrganizationId } from '../organizations';
import {
  getSearchText,
  getFilter,
  getAnimating,
  getUrlItemId,
  getUserId,
} from '../global';

export default createSelector([
  getStandards,
  getStandardsByIds,
  getStandardsFiltered,
  getIsModalOpened,
  getOrganizationId,
  getSearchText,
  getFilter,
  getAnimating,
  getUrlItemId,
  getUserId,
], (
  standards,
  standardsByIds,
  standardsFiltered,
  isModalOpened,
  organizationId,
  searchText,
  filter,
  animating,
  urlItemId,
  userId,
) => ({}));
