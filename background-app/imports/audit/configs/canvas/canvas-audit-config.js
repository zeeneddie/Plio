import { lenses, getId, getOrganizationId, getNotify, getTitle } from 'plio-util';
import { view } from 'ramda';

import onCreated from './on-created';
import onRemoved from './on-removed';
import * as UpdateHandlers from './fields';

export default {
  onCreated,
  onRemoved,
  updateHandlers: Object.values(UpdateHandlers),
  docId: getId,
  docName: getTitle,
  docOrgId: getOrganizationId,
  docNotifyList: getNotify,
  docOwner: view(lenses.originatorId),
};
