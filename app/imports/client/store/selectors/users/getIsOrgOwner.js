import { createSelector } from 'reselect';

import { getUserId } from '../global';
import { getOrganizationId } from '../organizations';
import { isOrgOwner } from '../../../../api/checkers';

export default createSelector([getUserId, getOrganizationId], isOrgOwner);
