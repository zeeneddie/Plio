import { createSelector } from 'reselect';

import { getOrganization, getOrgSerialNumber } from '../organizations';
import { getUserId, getFilter, getUrlItemId } from '../global';

const selector = (
  organization,
  orgSerialNumber,
  userId,
  filter,
  urlItemId,
) => ({
  organization,
  orgSerialNumber,
  userId,
  filter,
  urlItemId,
});

export default createSelector([
  getOrganization,
  getOrgSerialNumber,
  getUserId,
  getFilter,
  getUrlItemId,
], selector);
