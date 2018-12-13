import { getId, getOrganizationId, getNotify } from 'plio-util';

import { Milestones } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getMilestoneName, getMilestoneDesc } from '../../../helpers/description';
import { getMilestoneUrl } from '../../../helpers/url';
import onCreated from './on-created';
import onRemoved from './on-removed';
import * as UpdateHandlers from './fields';

export default {
  onCreated,
  onRemoved,
  updateHandlers: Object.values(UpdateHandlers),
  collection: Milestones,
  collectionName: CollectionNames.MILESTONES,
  docId: getId,
  docDescription: getMilestoneDesc,
  docName: getMilestoneName,
  docOrgId: getOrganizationId,
  docNotifyList: getNotify,
  docUrl: getMilestoneUrl,
};
