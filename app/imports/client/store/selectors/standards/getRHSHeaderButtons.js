import { createSelector } from 'reselect';

import { getIsFullScreenMode, getUserId } from '../global';
import { getOrganizationId } from '../organizations';
import { getIsDiscussionOpened } from '../discussion';
import { canChangeStandards } from '../../../../api/checkers/roles';
import { isOrgOwner } from '../../../../api/checkers/membership';

const selector = (userId, organizationId, isFullScreenMode, isDiscussionOpened) => {
  const hasAccess = canChangeStandards(userId, organizationId);
  const hasFullAccess = isOrgOwner(userId, organizationId);

  return {
    hasAccess,
    hasFullAccess,
    userId,
    organizationId,
    isFullScreenMode,
    isDiscussionOpened,
  };
};

export default createSelector([
  getUserId,
  getOrganizationId,
  getIsFullScreenMode,
  getIsDiscussionOpened,
], selector);
