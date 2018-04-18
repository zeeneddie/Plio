import { getId, getOrganizationId } from 'plio-util';

import { Milestones } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getMilestoneName, getMilestoneDesc } from '../../../helpers/description';
import onCreated from './on-created';
import onRemoved from './on-removed';
import GoalAuditConfig from '../goals/goal-audit-config';
import * as updateHandlers from './fields';

export default {
  onCreated,
  onRemoved,
  updateHandlers,
  collection: Milestones,
  collectionName: CollectionNames.Milestones,
  docId: getId,
  docDescription: getMilestoneDesc,
  docName: getMilestoneName,
  docOrgId: getOrganizationId,
  docUrl: GoalAuditConfig.docUrl.bind(GoalAuditConfig),
};
