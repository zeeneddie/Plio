import { createSelector } from 'reselect';

import { getUserId } from '../global';
import { getOrganizationId } from '../organizations';
import { canChangeStandards } from '../../../../api/checkers';

export default createSelector([getUserId, getOrganizationId], canChangeStandards);
